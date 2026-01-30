import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], filename: string = 'report', groupBy?: string) => {
  const workbook = XLSX.utils.book_new();
  
  if (!data || data.length === 0) {
    // Create empty worksheet with message
    const wsData = [['No data available to export']];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return;
  }

  // Create worksheet data array
  const wsData: any[][] = [];
  
  // Add main title with date
  const currentDate = new Date().toLocaleDateString('en-GB');
  wsData.push(['GENERAL AND TRAFFIC OFFENCE REPORT', '', '', '', '', '', '', `Generated: ${currentDate}`]);
  wsData.push([]); // Empty row
  
  // Add summary row
  const totalRecords = data.length;
  const pendingTotal = data.filter(item => !item.actionStatus).length;
  const takenTotal = totalRecords - pendingTotal;
  wsData.push(['SUMMARY:', '', '', `Total Records: ${totalRecords}`, `Pending: ${pendingTotal}`, `Taken: ${takenTotal}`, '', '']);
  wsData.push([]); // Empty row
  
  // Add table headers
  wsData.push(['Sr No.', 'Name & Details', 'Unit', 'FMN', 'Report No.', 'Date', 'Time', 'Offence Type', 'Description', 'Status']);
  
  if (groupBy && data.length > 0) {
    // Group data by specified field
    const grouped = data.reduce((acc, item) => {
      let key = 'Ungrouped';
      
      // Try different ways to get the grouping value
      if (item[groupBy]) {
        key = item[groupBy];
      } else if (item.offenceType) {
        key = item.offenceType;
      } else if (item.brief) {
        key = item.brief;
      } else if (item.offenceBrief) {
        key = item.offenceBrief;
      }
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    let serialNo = 1;
    
    Object.entries(grouped).forEach(([groupName, items], groupIndex) => {
      // Add spacing between groups
      if (groupIndex > 0) {
        wsData.push([]);
      }
      
      // Add group header with counts
      const pendingCount = (items as any[]).filter(item => !item.actionStatus).length;
      const takenCount = (items as any[]).length - pendingCount;
      
      wsData.push([
        `${groupName.toUpperCase()}`,
        '',
        '',
        '',
        '',
        '',
        '',
        `Records: ${(items as any[]).length}`,
        `Pending: ${pendingCount}`,
        `Taken: ${takenCount}`
      ]);
      
      // Add items in group
      (items as any[]).forEach((item) => {
        // Extract data with fallbacks for different data structures
        const getName = () => {
          return item.driverDetails?.name || 
                 item.victimDetails?.name || 
                 item.assignedMP?.name || 
                 item.name || 
                 'N/A';
        };
        
        const getRank = () => {
          return item.driverDetails?.rank || 
                 item.victimDetails?.rank || 
                 item.assignedMP?.rank || 
                 item.rank || 
                 '';
        };
        
        const getArmyNumber = () => {
          return item.driverDetails?.armyNumber || 
                 item.victimDetails?.armyNumber || 
                 item.assignedMP?.armyNumber || 
                 item.armyNumber || 
                 item.reportNumber || 
                 '';
        };
        
        const getMPName = () => {
          return item.mpName || 
                 item.reportingMPName || 
                 item.assignedMP?.name || 
                 'N/A';
        };
        
        const getUnit = () => {
          return item.unit || 
                 item.driverDetails?.unit || 
                 item.victimDetails?.unit || 
                 item.assignedMP?.unit || 
                 'N/A';
        };
        
        const getFMN = () => {
          return item.fmn || 
                 item.driverDetails?.fmn || 
                 item.victimDetails?.fmn || 
                 item.assignedMP?.fmn || 
                 'N/A';
        };
        
        const getReportNo = () => {
          return item.reportNo || 
                 item.reportNumber || 
                 item._id || 
                 'N/A';
        };
        
        const getDate = () => {
          return item.date || 
                 (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A');
        };
        
        const getTime = () => {
          return item.time || 
                 (item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A');
        };
        
        const getDescription = () => {
          return item.offenceBrief || 
                 item.brief || 
                 item.description || 
                 item.offenceDescription || 
                 'N/A';
        };
        
        const nameDetails = `${getName()}\n${getRank()} ${getArmyNumber()}\nMP: ${getMPName()}`;
        
        wsData.push([
          serialNo,
          nameDetails,
          getUnit(),
          getFMN(),
          getReportNo(),
          getDate(),
          getTime(),
          groupName,
          getDescription(),
          item.actionStatus ? 'Taken' : 'Pending'
        ]);
        serialNo++;
      });
    });
    
  } else {
    // Simple table without grouping
    data.forEach((item, index) => {
      const getName = () => {
        return item.driverDetails?.name || 
               item.victimDetails?.name || 
               item.assignedMP?.name || 
               item.name || 
               'N/A';
      };
      
      const getRank = () => {
        return item.driverDetails?.rank || 
               item.victimDetails?.rank || 
               item.assignedMP?.rank || 
               item.rank || 
               '';
      };
      
      const getArmyNumber = () => {
        return item.driverDetails?.armyNumber || 
               item.victimDetails?.armyNumber || 
               item.assignedMP?.armyNumber || 
               item.armyNumber || 
               item.reportNumber || 
               '';
      };
      
      const getMPName = () => {
        return item.mpName || 
               item.reportingMPName || 
               item.assignedMP?.name || 
               'N/A';
      };
      
      const nameDetails = `${getName()}\n${getRank()} ${getArmyNumber()}\nMP: ${getMPName()}`;
      
      wsData.push([
        index + 1,
        nameDetails,
        item.unit || item.driverDetails?.unit || item.victimDetails?.unit || item.assignedMP?.unit || 'N/A',
        item.fmn || item.driverDetails?.fmn || item.victimDetails?.fmn || item.assignedMP?.fmn || 'N/A',
        item.reportNo || item.reportNumber || item._id || 'N/A',
        item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A'),
        item.time || (item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A'),
        item.offenceType || item.offenceBrief || item.brief || 'N/A',
        item.offenceBrief || item.brief || item.description || item.offenceDescription || 'N/A',
        item.actionStatus ? 'Taken' : 'Pending'
      ]);
    });
  }
  
  // Create worksheet from array
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths for better readability
  worksheet['!cols'] = [
    { width: 8 },   // Sr No.
    { width: 25 },  // Name & Details
    { width: 15 },  // Unit
    { width: 12 },  // FMN
    { width: 15 },  // Report No.
    { width: 12 },  // Date
    { width: 8 },   // Time
    { width: 20 },  // Offence Type
    { width: 35 },  // Description
    { width: 10 }   // Status
  ];
  
  // Set row heights
  worksheet['!rows'] = wsData.map((row, index) => {
    if (index === 0) return { hpt: 25 }; // Title row
    if (index === 2) return { hpt: 20 }; // Summary row
    if (index === 4) return { hpt: 20 }; // Header row
    if (row[1] && typeof row[1] === 'string' && row[1].includes('\n')) {
      return { hpt: 60 }; // Multi-line content
    }
    return { hpt: 18 };
  });
  
  // Apply styles
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
  // Style title row (row 0)
  for (let col = 0; col <= 9; col++) {
    const cell = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2E7D32" } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thick' },
          bottom: { style: 'thick' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    }
  }
  
  // Style summary row (row 2)
  for (let col = 0; col <= 9; col++) {
    const cell = XLSX.utils.encode_cell({ r: 2, c: col });
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true, sz: 11 },
        fill: { fgColor: { rgb: "E8F5E8" } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    }
  }
  
  // Style headers (row 4)
  for (let col = 0; col <= 9; col++) {
    const cell = XLSX.utils.encode_cell({ r: 4, c: col });
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1976D2" } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
          top: { style: 'medium' },
          bottom: { style: 'medium' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    }
  }
  
  // Style data rows and group headers
  for (let row = 5; row <= range.e.r; row++) {
    for (let col = 0; col <= 9; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (worksheet[cellRef]) {
        const cellValue = worksheet[cellRef].v;
        
        // Check if it's a group header row
        if (typeof cellValue === 'string' && cellValue === cellValue.toUpperCase() && cellValue.length > 3) {
          worksheet[cellRef].s = {
            font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "FF9800" } },
            alignment: { horizontal: 'left', vertical: 'center' },
            border: {
              top: { style: 'medium' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          };
        } else {
          // Regular data cell with alternating colors
          const isEvenRow = (row - 5) % 2 === 0;
          worksheet[cellRef].s = {
            alignment: { horizontal: col === 1 ? 'left' : 'center', vertical: 'top', wrapText: true },
            fill: { fgColor: { rgb: isEvenRow ? "FFFFFF" : "F5F5F5" } },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          };
        }
      }
    }
  }
  
  // Merge cells
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Title
    { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } }  // Summary label
  ];
  
  // Add group header merges
  let rowIndex = 5;
  if (groupBy && data.length > 0) {
    const grouped = data.reduce((acc, item) => {
      let key = 'Ungrouped';
      if (item[groupBy]) {
        key = item[groupBy];
      } else if (item.offenceType) {
        key = item.offenceType;
      } else if (item.brief) {
        key = item.brief;
      } else if (item.offenceBrief) {
        key = item.offenceBrief;
      }
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, any[]>);
    
    Object.entries(grouped).forEach(([groupName, items], groupIndex) => {
      if (groupIndex > 0) rowIndex++; // Account for extra spacing
      
      // Merge group header cells
      if (worksheet['!merges']) {
        worksheet['!merges'].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 6 } });
      }
      rowIndex += (items as any[]).length + 1;
    });
  }
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};