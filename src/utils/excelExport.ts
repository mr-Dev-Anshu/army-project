import * as XLSX from 'xlsx-js-style';

export const exportToExcel = (data: any[], filename: string = 'report', groupBy?: string, title?: string) => {
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
  
  // Add main title (centered)
  const reportTitle = title || 'GENERAL AND TRAFFIC OFFENCE REPORT';
  wsData.push([reportTitle]);
  wsData.push([]); // Empty row
  
  // Add summary row
  const totalRecords = data.length;
  const pendingTotal = data.filter(item => !item.actionStatus).length;
  const takenTotal = totalRecords - pendingTotal;
  wsData.push(['SUMMARY:', '', '', '', '', '', '', `Total Records: ${totalRecords}`, `Pending: ${pendingTotal}`, `Taken: ${takenTotal}`]);
  wsData.push([]); // Empty row
  
  // Add table headers based on report type
  let headers: string[];
  if (title && title.includes('STATIC SPEED')) {
    headers = ['Sr No.', 'Place of Offence', 'Particulars of Driver/Rider', 'Unit', 'FMN', 'Report Number', 'Date & Time', 'Offence Brief', 'Veh. BA No. / Make & Take', 'Auth. Speed', 'Actual Speed', 'Over Speed', 'Particulars of Co-Driver/Rider', 'Action Status'];
  } else if (title && title.includes('MP OCCURRENCE')) {
    headers = ['Sr no.', 'Particulars of Individual/Victim', 'Unit', 'FMN', 'Report Number', 'Date & Time', 'Offence Type', 'Brief of Occurrence', 'Action Status	'];
  } else if (title && title.includes('GENERAL') && title.includes('TRAFFIC')) {
    if (groupBy) {
      // Grouped format
      headers = ['Sr no.', 'Particulars of Indls.', 'Unit', 'FMN', 'Report no.', 'Date', 'Time', 'Type of Offence','Offence Description', 'Action Status'];
    } else {
      // Non-grouped format
      headers = ['Sr no.', 'Particulars of Driver/Rider', 'Unit', 'FMN', 'Report Number', 'Date & Time', 'Offence Type /Brief', 'Veh. BA No. , Make & Take', 'Particulars of Co-Driver/Rider', 'Action Status'];
    }
  } else {
    headers = ['Sr No.', 'Name & Details', 'Unit', 'FMN', 'Report No.', 'Date', 'Time', 'Offence Type', 'Description', 'Status'];
  }
  wsData.push(headers);
  
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
                 '';
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
                 '';
        };
        
        const getUnit = () => {
          return item.unit || 
                 item.driverDetails?.unit || 
                 item.victimDetails?.unit || 
                 item.assignedMP?.unit || 
                 '';
        };
        
        const getFMN = () => {
          return item.fmn || 
                 item.driverDetails?.fmn || 
                 item.victimDetails?.fmn || 
                 item.assignedMP?.fmn || 
                 '';
        };
        
        const getReportNo = () => {
          return item.reportNo || 
                 item.reportNumber || 
                 item._id || 
                 '';
        };
        
        const getDate = () => {
          return item.date || 
                 (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : '');
        };
        
        const getTime = () => {
          return item.time || 
                 (item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '');
        };
        
        const getDescription = () => {
          return item.offenceBrief || 
                 item.brief || 
                 item.description || 
                 item.offenceDescription || 
                 '';
        };
        
        const nameDetails = getName() || getRank() || getArmyNumber() || getMPName() ? 
          `${getName()}\n${getRank()} ${getArmyNumber()}\nMP: ${getMPName()}`.replace(/\n\s*\n/g, '\n').replace(/MP: $/g, '').trim() : 
          '';
        
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
      if (title && title.includes('STATIC SPEED')) {
        // Static Speed Check Report format
        const driverDetails = `Aadhar No. ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nName: ${item.driverDetails?.name || item.name || ''}\nArmy no.: ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nRank: ${item.driverDetails?.rank || item.rank || ''}\nMP Name: ${item.mpName || ''}`;
        const coDriverDetails = `Aadhar No. ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nName: ${item.driverDetails?.name || item.name || ''}\nArmy no.: ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nRank: ${item.driverDetails?.rank || item.rank || ''}\nMP Name: ${item.mpName || ''}`;
        
        wsData.push([
          index + 1, // Sr No.
          item.placeOfOffence || '', // Place of Offence
          driverDetails, // Particulars of Driver/Rider
          item.unit || item.driverDetails?.unit || '', // Unit
          item.fmn || item.driverDetails?.fmn || '', // FMN
          item.reportNo || item.reportNumber || '', // Report Number
          `${item.date || ''} ${item.time || ''}`, // Date & Time
          item.offenceBrief || item.brief || '', // Offence Brief
          item.vehicleNo || '', // Veh. BA No. / Make & Take
          item.authSpeed || '', // Auth. Speed
          item.actualSpeed || '', // Actual Speed
          item.overSpeed || '', // Over Speed
          coDriverDetails, // Particulars of Co-Driver/Rider
          item.actionStatus ? 'Taken' : 'Pending' // Action Status
        ]);
      } else if (title && title.includes('MP OCCURRENCE')) {
        // MP Occurrence Report format - matching the exact headers
        const mpDetails = `Army no.: ${item.assignedMP?.armyNumber || item.reportingMPName || ''}\nRank: ${item.assignedMP?.rank || ''}\nName: ${item.assignedMP?.name || item.reportingMPName || ''}\nUnit: ${item.assignedMP?.unit || item.unit || ''}\nFMN: ${item.assignedMP?.fmn || item.fmn || ''}`;
        const victimDetails = `Army no.: ${item.victimDetails?.armyNumber || item.driverDetails?.armyNumber || ''}\nRank: ${item.victimDetails?.rank || item.driverDetails?.rank || ''}\nName: ${item.victimDetails?.name || item.driverDetails?.name || ''}\nUnit: ${item.victimDetails?.unit || item.driverDetails?.unit || item.unit || ''}`;
        
        wsData.push([
          index + 1, // Sr no.
          `${item.date || ''} ${item.time || ''}`, // Date & Time of Occur.
          item.placeOfOccurrence || item.placeOfOffence || '', // Place of Occurrence
          mpDetails, // Assigned MP Particulars
          victimDetails, // Particulars of Individual/Victim
          item.vehicleNo || '', // Veh. BA No. / Make & Take
          item.offenceType || item.offenceBrief || '', // Offence Type
          item.brief || item.offenceBrief || item.description || '', // Brief of Occurrence
          item.documents?.join(', ') || '', // List of Attached Documents & Statements
          item.reportNumber || item.reportNo || '', // Report no.
          item.remarks || '', // Remark
          item.actionStatus ? 'Taken' : 'Pending' // Action Status
        ]);
      } else if (title && title.includes('GENERAL') && title.includes('TRAFFIC')) {
        if (groupBy) {
          // Grouped format
          const individualDetails = `Aadhar No. ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nName: ${item.driverDetails?.name || item.name || ''}\nArmy no.: ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nRank: ${item.driverDetails?.rank || item.rank || ''}\nMP Name: ${item.mpName || ''}`;
          
          wsData.push([
            index + 1,
            individualDetails,
            item.unit || item.driverDetails?.unit || '',
            item.fmn || item.driverDetails?.fmn || '',
            item.reportNo || item.reportNumber || '',
            `${item.date || ''} ${item.time || ''}`,
            item.offenceBrief || item.brief || item.description || '',
            item.actionStatus ? 'Taken' : 'Pending'
          ]);
        } else {
          // Non-grouped format
          const driverDetails = `Aadhar No. ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nName: ${item.driverDetails?.name || item.name || ''}\nArmy no.: ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nRank: ${item.driverDetails?.rank || item.rank || ''}\nMP Name: ${item.mpName || ''}`;
          const coDriverDetails = `Aadhar No. ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nName: ${item.driverDetails?.name || item.name || ''}\nArmy no.: ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nRank: ${item.driverDetails?.rank || item.rank || ''}\nMP Name: ${item.mpName || ''}`;
          
          wsData.push([
            index + 1,
            driverDetails,
            item.unit || item.driverDetails?.unit || '',
            item.fmn || item.driverDetails?.fmn || '',
            item.reportNo || item.reportNumber || '',
            `${item.date || ''} ${item.time || ''}`,
            item.offenceType || item.offenceBrief || item.brief || '',
            item.vehicleNo || '',
            coDriverDetails,
            item.actionStatus ? 'Taken' : 'Pending'
          ]);
        }
      } else {
        // Default format
        const nameDetails = `${item.driverDetails?.name || item.name || ''}\n${item.driverDetails?.rank || item.rank || ''} ${item.driverDetails?.armyNumber || item.armyNumber || ''}\nMP: ${item.mpName || ''}`.replace(/\n\s*\n/g, '\n').replace(/MP: $/g, '').trim();
        
        wsData.push([
          index + 1,
          nameDetails,
          item.unit || item.driverDetails?.unit || '',
          item.fmn || item.driverDetails?.fmn || '',
          item.reportNo || item.reportNumber || '',
          item.date || '',
          item.time || '',
          item.offenceType || item.offenceBrief || item.brief || '',
          item.offenceBrief || item.brief || item.description || '',
          item.actionStatus ? 'Taken' : 'Pending'
        ]);
      }
    });
  }
  
  // Create worksheet from array
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  
  // Calculate optimal column widths based on content
  const calculateColumnWidths = (data: any[][], headers: string[]) => {
    const widths = headers.map(header => Math.max(header.length, 8)); // Start with header length, minimum 8
    
    data.forEach(row => {
      row.forEach((cell, colIndex) => {
        if (cell && colIndex < widths.length) {
          const cellStr = String(cell);
          // For multi-line content, use the longest line
          const lines = cellStr.split('\n');
          const maxLineLength = Math.max(...lines.map(line => line.length));
          // Cap maximum width at 50 characters for readability
          widths[colIndex] = Math.max(widths[colIndex], Math.min(maxLineLength, 50));
        }
      });
    });
    
    return widths.map(width => ({ width }));
  };
  
  // Set dynamic column widths
  worksheet['!cols'] = calculateColumnWidths(wsData.slice(5), headers); // Skip title, empty, summary, empty, headers
  
  // Set row heights with better spacing for different report types
  worksheet['!rows'] = wsData.map((row, index) => {
    if (index === 0) return { hpt: 40 }; // Title row - larger height
    if (index === 2) return { hpt: 30 }; // Summary row
    if (index === 4) return { hpt: 30 }; // Header row - larger height
    
    // Check for multi-line content in different columns based on report type
    if (title && title.includes('STATIC SPEED')) {
      // Static Speed has multi-line content in columns 2 and 12 (Particulars)
      if (row[2] && typeof row[2] === 'string' && row[2].includes('\n')) {
        return { hpt: 100 }; // Extra space for Static Speed particulars
      }
    } else if (title && title.includes('MP OCCURRENCE')) {
      // MP Occurrence has multi-line content in columns 3 and 4
      if ((row[3] && typeof row[3] === 'string' && row[3].includes('\n')) || 
          (row[4] && typeof row[4] === 'string' && row[4].includes('\n'))) {
        return { hpt: 90 }; // Space for MP and victim details
      }
    } else if (title && title.includes('GENERAL') && title.includes('TRAFFIC')) {
      // General & Traffic has multi-line content in particulars columns
      if (row[1] && typeof row[1] === 'string' && row[1].includes('\n')) {
        return { hpt: 85 }; // Space for individual details
      }
    }
    
    return { hpt: 25 }; // Default row height
  });
  
  // Apply styles
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
  // Style title row (row 0) - centered and underlined
  for (let col = 0; col <= 13; col++) {
    const cell = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true, sz: 18, underline: true },
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
        font: { bold: true, sz: 10 },
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
  for (let col = 0; col <= headers.length - 1; col++) {
    const cell = XLSX.utils.encode_cell({ r: 4, c: col });
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true, sz: 11 },
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
            font: { bold: true, sz: 11 },
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
  
  // Merge cells for title (center it across all columns)
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, // Title centered across all columns
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }  // Summary label
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