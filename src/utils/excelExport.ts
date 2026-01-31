import * as XLSX from 'xlsx-js-style';

export const exportToExcel = (data: any[], filename: string = 'report', groupBy?: string, title?: string) => {
  const workbook = XLSX.utils.book_new();
  
  if (!data || data.length === 0) {
    const wsData = [['No data available to export']];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return;
  }

  // Create worksheet data array
  const wsData: any[][] = [];
  
  // 1. Setup Title and Headers
  const reportTitle = title || 'GENERAL AND TRAFFIC OFFENCE REPORT';
  wsData.push([reportTitle]);
  wsData.push([]); // Row 1: Empty
  
  // Summary Row
  const totalRecords = data.length;
  const pendingTotal = data.filter(item => !item.actionStatus).length;
  const takenTotal = totalRecords - pendingTotal;
  wsData.push(['SUMMARY:', '', '', '', '', '', '', `Total Records: ${totalRecords}`, `Pending: ${pendingTotal}`, `Taken: ${takenTotal}`]);
  wsData.push([]); // Row 3: Empty
  
  // Define Headers based on Report Type
  let headers: string[] = [];
  if (title && title.includes('STATIC SPEED')) {
    headers = ['Sr No.', 'Place of Offence', 'Particulars of Driver/Rider', 'Unit', 'FMN', 'Report Number', 'Date & Time', 'Offence Brief', 'Veh. BA No.', 'Auth. Speed', 'Actual Speed', 'Over Speed', 'Particulars of Co-Driver/Rider', 'Action Status'];
  } else if (title && title.includes('MP OCCURRENCE')) {
    headers = ['Sr no.', 'Particulars of Individual/Victim', 'Unit', 'FMN', 'Report Number', 'Date','Time','Offence Type', 'Brief of Occurrence', 'Action Status'];
  } else if (title && title.includes('GENERAL') && title.includes('TRAFFIC')) {
    if (groupBy) {
      headers = ['Sr no.', 'Particulars of Indls.', 'Unit', 'FMN', 'Report no.', 'Date', 'Time', 'Type of Offence','Offence Description', 'Action Status'];
    } else {
      headers = ['Sr no.', 'Particulars of Driver/Rider', 'Unit', 'FMN', 'Report Number', 'Date & Time', 'Offence Type /Brief', 'Veh. BA No. / Make', 'Particulars of Co-Driver', 'Action Status'];
    }
  } else {
    headers = ['Sr No.', 'Name & Details', 'Unit', 'FMN', 'Report No.', 'Date', 'Time', 'Offence Type', 'Description', 'Status'];
  }
  wsData.push(headers); // Row 4: Headers
  
  // 2. Populate Data Rows
  if (groupBy && data.length > 0) {
     const grouped = data.reduce((acc, item) => {
      let key = item[groupBy] || item.offenceType || item.brief || item.offenceBrief || 'Ungrouped';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    let serialNo = 1;
    Object.entries(grouped).forEach(([groupName, items], groupIndex) => {
      if (groupIndex > 0) wsData.push([]); // Spacing row
      
      const pendingCount = (items as any[]).filter(item => !item.actionStatus).length;
      const takenCount = (items as any[]).length - pendingCount;
      
      // Group Header
      wsData.push([`${groupName.toUpperCase()}`, '', '', '', '', '', '', `Records: ${(items as any[]).length}`, `Pending: ${pendingCount}`, `Taken: ${takenCount}`]);
      
      (items as any[]).forEach((item) => {
         // Data extraction (simplified for brevity, assumes data structure matches)
         const getName = () => item.driverDetails?.name || item.victimDetails?.name || item.assignedMP?.name || item.name || '';
         const getRank = () => item.driverDetails?.rank || item.victimDetails?.rank || item.assignedMP?.rank || item.rank || '';
         const getArmyNo = () => item.driverDetails?.armyNumber || item.victimDetails?.armyNumber || item.assignedMP?.armyNumber || item.armyNumber || '';
         
         const details = `${getName()}\n${getRank()} ${getArmyNo()}`.trim();
         
         wsData.push([
            serialNo++, 
            details, 
            item.unit || '', 
            item.fmn || '', 
            item.reportNo || item.reportNumber || '', 
            item.date || '', 
            item.time || '', 
            groupName, 
            item.brief || item.offenceBrief || '', 
            item.actionStatus ? 'Taken' : 'Pending'
         ]);
      });
    });

  } else {
    // Non-grouped Data Population
    data.forEach((item, index) => {
      if (title && title.includes('STATIC SPEED')) {
        const driverDetails = `Name: ${item.driverDetails?.name || item.name || ''}\nRank: ${item.driverDetails?.rank || item.rank || ''}\nArmy No: ${item.driverDetails?.armyNumber || item.armyNumber || ''}`;
        const coDriverDetails = item.coDriverDetails ? `Name: ${item.coDriverDetails?.name || ''}` : '';
        
        wsData.push([
          index + 1,
          item.placeOfOffence || '',
          driverDetails,
          item.unit || item.driverDetails?.unit || '',
          item.fmn || item.driverDetails?.fmn || '',
          item.reportNo || item.reportNumber || '',
          `${item.date || ''} ${item.time || ''}`,
          item.offenceBrief || '',
          item.vehicleNo || '',
          item.authSpeed || '',
          item.actualSpeed || '',
          item.overSpeed || '',
          coDriverDetails,
          item.actionStatus ? 'Taken' : 'Pending'
        ]);
      } else {
         // Fallback for other reports
         wsData.push([index + 1, item.name || '', item.unit || '', item.fmn || '', item.reportNo || '', item.date || '', item.time || '', item.offenceType || '', item.brief || '', item.actionStatus ? 'Taken' : 'Pending']);
      }
    });
  }
  
  // 3. Create Sheet and Calculate Widths
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  
  const calculateColumnWidths = (data: any[][], headers: string[]) => {
    const widths = headers.map(header => Math.max(header.length, 12));
    data.forEach(row => {
      row.forEach((cell, colIndex) => {
        if (cell && colIndex < widths.length) {
          const lines = String(cell).split('\n');
          const maxLineLength = Math.max(...lines.map(line => line.length));
          widths[colIndex] = Math.max(widths[colIndex], Math.min(maxLineLength, 100));
        }
      });
    });
    return widths.map(width => ({ width: width + 2 }));
  };
  worksheet['!cols'] = calculateColumnWidths(wsData.slice(5), headers);

  // Row Heights
  worksheet['!rows'] = wsData.map((row, index) => {
    if (index === 0) return { hpt: 40 }; 
    if (index === 2) return { hpt: 30 }; 
    if (index === 4) return { hpt: 30 };
    
    // Check if Group Header for Height
    const isGroupHeader = row[0] && typeof row[0] === 'string' && row[0] === row[0].toUpperCase() && row[0].length > 5 && !String(row[0]).match(/^\d/);
    if (isGroupHeader) return { hpt: 35 }; // Increase height for the bigger header
    
    // Auto-height for data rows with newlines
    const hasMultiline = row.some(cell => typeof cell === 'string' && cell.includes('\n'));
    return hasMultiline ? { hpt: 80 } : { hpt: 25 };
  });

  // 4. APPLY BORDERS AND STYLES
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
  const thickBorder = { style: 'thick', color: { auto: 1 } };
  const thinBorder = { style: 'thin', color: { auto: 1 } };
  const mediumBorder = { style: 'medium', color: { auto: 1 } };

  const styleBase = {
    border: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
    alignment: { vertical: 'center', wrapText: true }
  };

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      
      if (!worksheet[cellRef]) {
         worksheet[cellRef] = { t: 's', v: '' };
      }

      const cell = worksheet[cellRef];
      cell.s = { ...styleBase };

      if (R === 0) { // Title
        cell.s = {
          font: { bold: true, sz: 18, underline: true },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: { top: thickBorder, bottom: thickBorder, left: thinBorder, right: thinBorder }
        };
      } else if (R === 2) { // Summary
        cell.s = {
           font: { bold: true, sz: 10 },
           alignment: { horizontal: 'center', vertical: 'center' },
           fill: { fgColor: { rgb: "EFEFEF" } },
           border: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder }
        };
      } else if (R === 4) { // Table Headers
        cell.s = {
          font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4472C4" } },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
          border: { top: mediumBorder, bottom: mediumBorder, left: thinBorder, right: thinBorder }
        };
      } else if (R > 4) { // Data Rows
        // Check for Group Headers (All Caps string in first column)
        const isGroupHeader = C === 0 && typeof cell.v === 'string' && cell.v === cell.v.toUpperCase() && cell.v.length > 5 && !cell.v.match(/^\d/);
        
        if (isGroupHeader) {
           // *** UPDATED: No Fill, Bigger Font ***
           cell.s.font = { bold: true, sz: 14 }; 
           cell.s.alignment = { horizontal: 'left', vertical: 'center' };
           // cell.s.fill = { fgColor: { rgb: "D9E1F2" } }; // Removed Background Color
        } else {
           // Normal Data Rows
           const isEvenRow = (R - 5) % 2 === 0;
           cell.s.fill = { fgColor: { rgb: isEvenRow ? "FFFFFF" : "F9F9F9" } };
           cell.s.alignment.horizontal = (C === 1 || C === 2 || C === 12) ? 'left' : 'center';
        }
      }
    }
  }

  // Merges
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, // Title
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }  // Summary Label
  ];
  
  // Add group header merges (so the big text spans across)
  let rowIndex = 5;
  if (groupBy && data.length > 0) {
      // Re-calculate group positions for merges
      // (This assumes the same grouping logic as above)
      const grouped = data.reduce((acc, item) => {
        let key = item[groupBy] || item.offenceType || item.brief || item.offenceBrief || 'Ungrouped';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, any[]>);
      
      Object.entries(grouped).forEach(([groupName, items], groupIndex) => {
        if (groupIndex > 0) rowIndex++; // Gap row
        
        // Merge Group Header
        if (!worksheet['!merges']) worksheet['!merges'] = [];
        worksheet['!merges'].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 6 } });
        
        rowIndex += (items as any[]).length + 1; // +1 for the header itself
      });
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};