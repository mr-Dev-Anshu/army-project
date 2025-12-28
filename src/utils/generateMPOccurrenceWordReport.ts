
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    VerticalAlign,
    HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";
import { MpOccurrenceReportProps } from "@/components/reports/MpOccurrenceReport";

export const generateMPOccurrenceWordReport = async (data: MpOccurrenceReportProps) => {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 20, // 10pt
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1134, // 20mm
                            right: 1134,
                            bottom: 1134,
                            left: 1134,
                        },
                    },
                },
                children: [
                    // --- HEADER PAGE 1 ---
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "IAFP-1479 (Revised)", bold: true })],
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "MP OCCURRENCE & INVESTIGATION REPORT", bold: true, underline: {}, size: 24 })], // 12pt
                        spacing: { after: 400 },
                    }),

                    // Report Info Table (No Border)
                    createReportInfoTable(data),

                    new Paragraph({ text: "", spacing: { after: 200 } }),

                    // 1. MP DETAILS
                    createSectionHeader("1.", "MP DETAILS:"),
                    createMPDetailsBox(data.mpDetails),

                    new Paragraph({
                        children: [new TextRun({ text: "(MP must caution witness and ensure presence of independent witness if possible)", size: 16 })],
                        spacing: { after: 200 }
                    }),

                    // 2. OCCURRENCE DETAILS
                    createSectionHeader("2.", "OCCURRENCE DETAILS:"),
                    createOccurrenceDetails(data.occurrence),

                    new Paragraph({ text: "", spacing: { after: 200 } }),

                    // 3. DETAILS OF VICTIMS/OFFENDERS
                    createSectionHeader("3.", "DETAILS OF VICTIMS/OFFENDERS:", "(MP must verify personal particulars)"),
                    createPeopleTable(data.people),
                    new Paragraph({
                        children: [new TextRun({ 
                            text: "(To be read out to the Offender(s) by the MP 'above recorded personal particulars have been given by me voluntarily and I certify and sign them as correct. If found otherwise. I am liable for disciplinary action under the Army Act')",
                            size: 16 
                        })],
                        spacing: { after: 200 }
                    }),

                    // 4. BRIEF OF OCCURRENCE
                     createSectionHeader("4.", "BRIEF OF OCCURRENCE", "(Details on Reverse) offence:"),
                     new Paragraph({
                         children: [new TextRun({ text: data.briefOfOccurrence })],
                         alignment: AlignmentType.JUSTIFIED,
                     }),
                     
                     // Page 1 Footer
                     new Paragraph({
                         children: [new TextRun({ text: "-1-", bold: true })],
                         alignment: AlignmentType.CENTER,
                         spacing: { before: 400 }
                     }),
                     new Paragraph({
                         children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                         alignment: AlignmentType.CENTER,
                         spacing: { before: 100 }
                     }),
                     new Paragraph({
                        children: [],
                        pageBreakBefore: true
                     }),


                    // --- PAGE 2 ---
                     new Paragraph({
                         children: [new TextRun({ text: "-2-", bold: true })],
                         alignment: AlignmentType.CENTER
                     }),
                     new Paragraph({
                         children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                         alignment: AlignmentType.CENTER,
                         spacing: { after: 200 }
                     }),

                    // 5. WITNESS
                    createSectionHeader("5.", "WITNESS:", "(Witness must record statement in own hand where possible)"),
                    createWitnessTable(data.witnesses),

                    new Paragraph({ text: "", spacing: { after: 200 } }),

                    // 6. EVIDENCE
                    createSectionHeader("6.", "EVIDENCE:", "(Collect and record evidence carefully)"),
                    createEvidenceSection(data.evidence),

                    new Paragraph({ text: "", spacing: { after: 200 } }),

                    // 7. DOCUMENTS ATTACHED
                     createSectionHeader("7.", "DOCUMENTS ATTACHED"),
                     ...data.documents.map(d => new Paragraph({
                         bullet: { level: 0 },
                         children: [new TextRun(d)]
                     })),

                    // Page 2 Footer
                     new Paragraph({
                        children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400 }
                    }),
                    new Paragraph({
                        children: [],
                        pageBreakBefore: true
                     }),

                    // --- PAGE 3 (Detailed Report) ---
                     new Paragraph({
                         children: [new TextRun({ text: "-3-", bold: true })],
                         alignment: AlignmentType.CENTER
                     }),
                     new Paragraph({
                         children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                         alignment: AlignmentType.CENTER,
                         spacing: { after: 200 }
                     }),

                     new Paragraph({
                         children: [new TextRun({ text: "DETAILED OCCURRENCE REPORT", bold: true, underline: {} })],
                         alignment: AlignmentType.CENTER,
                         spacing: { after: 400 }
                     }),

                     new Paragraph({
                         children: [new TextRun("Sir,")]
                     }),
                     new Paragraph({
                         children: [new TextRun({ text: data.detailedReport.statement })],
                         alignment: AlignmentType.JUSTIFIED,
                         spacing: { after: 400 }
                     }),

                     new Paragraph({
                         children: [new TextRun({ text: "POINTS FIND OUT DURING THE INVESTIGATION", bold: true, underline: {} })],
                         spacing: { after: 200 }
                     }),

                     ...data.detailedReport.findings.map(f => new Paragraph({
                         bullet: { level: 0 },
                         children: [new TextRun(f)]
                     })),

                     // Page 3 Footer
                     new Paragraph({
                        children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400 }
                    }),
                    new Paragraph({
                        children: [],
                        pageBreakBefore: true
                     }),

                    // --- PAGE 4 (Opinion) ---
                     new Paragraph({
                         children: [new TextRun({ text: "-4-", bold: true })],
                         alignment: AlignmentType.CENTER
                     }),
                     new Paragraph({
                         children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                         alignment: AlignmentType.CENTER,
                         spacing: { after: 200 }
                     }),

                     new Paragraph({
                         children: [new TextRun({ text: "OPINION:", bold: true, underline: {} })],
                         spacing: { after: 200 }
                     }),

                     new Paragraph({
                         children: [new TextRun({ text: data.detailedReport.opinion })],
                         alignment: AlignmentType.JUSTIFIED,
                         spacing: { after: 400 }
                     }),

                     // Signature Block
                     new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: "Dated: " + data.reportDate, bold: true })] })],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: "(Signature of MP JCO/NCO)", bold: true })], alignment: AlignmentType.CENTER })],
                                    })
                                ]
                            })
                        ]
                     }),

                     // Page 4 Footer
                     new Paragraph({
                        children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400 }
                    }),
                    new Paragraph({
                        children: [],
                        pageBreakBefore: true
                     }),

                     // --- PAGE 5 (Remarks) ---
                     new Paragraph({
                         children: [new TextRun({ text: "-5-", bold: true })],
                         alignment: AlignmentType.CENTER
                     }),
                     new Paragraph({
                         children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                         alignment: AlignmentType.CENTER,
                         spacing: { after: 200 }
                     }),

                     new Paragraph({
                         children: [new TextRun({ text: "REMARKS CO/2IC PROVOST UNIT", bold: true, underline: {} })],
                         alignment: AlignmentType.CENTER,
                     }),
                     new Paragraph({
                         children: [new TextRun({ text: "Check evidence gives analysis and recommendation and fill IAFP-901 if required", size: 16 })],
                         alignment: AlignmentType.CENTER,
                         spacing: { after: 400 }
                     }),

                     new Paragraph({
                         children: [new TextRun({ text: "ANALYSIS-", bold: true, underline: {} })],
                         spacing: { after: 200 }
                     }),
                     new Paragraph({
                         children: [new TextRun({ text: data.remarks.analysis })],
                         alignment: AlignmentType.JUSTIFIED,
                         spacing: { after: 400 }
                     }),

                     new Paragraph({
                         children: [new TextRun({ text: "RECOMMENDATION-", bold: true, underline: {} })],
                         spacing: { after: 200 }
                     }),
                     new Paragraph({
                         children: [new TextRun({ text: data.remarks.recommendation })],
                         alignment: AlignmentType.JUSTIFIED,
                         spacing: { after: 400 }
                     }),

                     // Footer Signature
                      new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({ children: [new TextRun({ text: "Station : " + data.station, bold: true })] }),
                                            new Paragraph({ children: [new TextRun({ text: "Dated : " + data.reportDate, bold: true })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: "(Signature of CO/2IC with unit seal)", bold: true })], alignment: AlignmentType.CENTER })],
                                    })
                                ]
                            })
                        ]
                     }),

                      // Page 5 Footer
                     new Paragraph({
                        children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {} })],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400 }
                    }),
                ],
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `MP_Occurrence_Report_${data.reportNo || "Draft"}.docx`);
    });
};

function createSectionHeader(num: string, text: string, sub?: string) {
    return new Paragraph({
        children: [
            new TextRun({ text: num, bold: true }),
            new TextRun({ text: "     " }),
            new TextRun({ text: text, bold: true, underline: {} }),
            ...(sub ? [new TextRun({ text: " " + sub, size: 18 })] : [])
        ],
        spacing: { after: 100 }
    });
}

function createReportInfoTable(data: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                         children: [
                             new Paragraph({ children: [new TextRun({ text: "Report No- ", bold: true }), new TextRun(data.reportNo)] }),
                             new Paragraph({ children: [new TextRun({ text: "(Fill in Desk Room)", size: 16, color: "666666" })] }),
                         ],
                         width: { size: 33, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({ children: [new TextRun({ text: "Command- ", bold: true }), new TextRun(data.command)], alignment: AlignmentType.CENTER }),
                            new Paragraph({ children: [new TextRun({ text: "(Origin)", size: 16, color: "666666" })], alignment: AlignmentType.CENTER }),
                        ],
                        width: { size: 33, type: WidthType.PERCENTAGE }
                   }),
                   new TableCell({
                        children: [
                            new Paragraph({ children: [new TextRun({ text: "FIR No.- ", bold: true }), new TextRun(data.firNo)], alignment: AlignmentType.RIGHT }),
                            new Paragraph({ children: [new TextRun({ text: "(Att Copy Filed)", size: 16, color: "666666" })], alignment: AlignmentType.RIGHT }),
                        ],
                        width: { size: 33, type: WidthType.PERCENTAGE }
                   }),
                ]
            })
        ]
    });
}

function createMPDetailsBox(mp: any) {
    // 2 columns, 3 rows
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    cellWithLabel("Army no.", mp.armyNo),
                    cellWithLabel("Rank", mp.rank),
                ]
            }),
             new TableRow({
                children: [
                    cellWithLabel("Name", mp.name),
                    cellWithLabel("Unit", mp.unit),
                ]
            }),
             new TableRow({
                children: [
                    cellWithLabel("FMN", mp.fmn),
                    cellWithLabel("Command", mp.command),
                ]
            }),
        ]
    });
}

function createPeopleTable(people: any[]) {
    // Header
     const headerRow = new TableRow({
         tableHeader: true,
         children: [
             new TableCell({ children: [new Paragraph({ text: "Sno.", bold: true, alignment: AlignmentType.CENTER })], width: { size: 5, type: WidthType.PERCENTAGE } }),
             new TableCell({ children: [new Paragraph({ text: "Army No., Rank & Name", bold: true })], width: { size: 35, type: WidthType.PERCENTAGE } }),
             new TableCell({ children: [new Paragraph({ text: "Identity Card", bold: true })], width: { size: 15, type: WidthType.PERCENTAGE } }),
             new TableCell({ children: [new Paragraph({ text: "Unit/Tele No.", bold: true })], width: { size: 30, type: WidthType.PERCENTAGE } }),
             new TableCell({ children: [new Paragraph({ text: "Remark", bold: true })], width: { size: 15, type: WidthType.PERCENTAGE } }),
         ]
     });

     const rows = people.map(p => new TableRow({
         children: [
             new TableCell({ children: [new Paragraph({ text: p.sno + ".", alignment: AlignmentType.CENTER })], verticalAlign: VerticalAlign.CENTER }),
             new TableCell({ children: [
                 new Paragraph({ children: [new TextRun({ text: "Army no.: ", bold: true }), new TextRun(p.armyNo)] }),
                 new Paragraph({ children: [new TextRun({ text: "Rank: ", bold: true }), new TextRun(p.rank)] }),
                 new Paragraph({ children: [new TextRun({ text: "Name: ", bold: true }), new TextRun(p.name)] }),
             ] }),
             new TableCell({ children: [new Paragraph(p.identityCard)], verticalAlign: VerticalAlign.CENTER }),
              new TableCell({ children: [
                 new Paragraph({ children: [new TextRun({ text: "Unit: ", bold: true }), new TextRun(p.unitName)] }),
                 new Paragraph({ children: [new TextRun({ text: "FMN: ", bold: true }), new TextRun(p.fmn)] }),
                 new Paragraph({ children: [new TextRun({ text: "Address: ", bold: true }), new TextRun(p.address)] }),
             ] }),
             new TableCell({ children: [new Paragraph(p.remark)], verticalAlign: VerticalAlign.CENTER }),
         ]
     }));

     if (people.length === 0) {
         rows.push(new TableRow({ children: [new TableCell({ children: [new Paragraph("No details available")], columnSpan: 5 })] }));
     }

     return new Table({
         width: { size: 100, type: WidthType.PERCENTAGE },
         rows: [headerRow, ...rows]
     });
}

function createWitnessTable(witnesses: any[]) {
    return createPeopleTable(witnesses);
}

function createOccurrenceDetails(occ: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
        rows: [
            createOccRow("Occurrence Offence Type-", occ.offenceType),
            createOccRow("Place of Occurrence-", occ.place),
            createOccRow("Date of Occurrence-", occ.date),
            createOccRow("Time of Occurrence-", occ.time + " Hrs"),
        ]
    });
}

function createOccRow(label: string, value: string) {
    return new TableRow({
        children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })], width: { size: 40, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph(value)], width: { size: 60, type: WidthType.PERCENTAGE } }),
        ]
    });
}

function createEvidenceSection(evidence: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
         borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
        rows: [
            new TableRow({
                children: [
                     new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "Eye Sketch- ", bold: true }), new TextRun(evidence.eyeSketch)] }), createUnderline()]
                     }),
                     new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "Photos- ", bold: true }), new TextRun(evidence.photos)] }), createUnderline()]
                     }),
                     new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "Videos- ", bold: true }), new TextRun(evidence.videos)] }), createUnderline()]
                     }),
                ]
            })
        ]
    });
}

function cellWithLabel(label: string, value: string) {
    return new TableCell({
        children: [
            new Paragraph({
                children: [
                    new TextRun({ text: label, bold: true }),
                    new TextRun("\t" + value) // Tab for separation or we can use another column
                ],
                tabStops: [{ position: 2000, type: "left" }]
            })
        ],
        // Alternatively use nested table if exact alignment is needed
    });
}

function createUnderline() {
     return new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, space: 1 } }
    });
}
