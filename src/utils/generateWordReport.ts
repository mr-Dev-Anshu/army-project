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
} from "docx";
import { saveAs } from "file-saver";
import { MilitaryPoliceReportProps } from "@/components/reports/MilitaryPoliceReport";

export const generateWordReport = async (data: MilitaryPoliceReportProps) => {
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
                            top: 1000,
                            right: 1000,
                            bottom: 1000,
                            left: 1000,
                        },
                    },
                },
                children: [
                    // TOP RIGHT HEADER
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: "In Lieu Of IAFP-1479",
                                bold: false,
                                size: 20,
                            }),
                        ],
                        spacing: { after: 200 },
                    }),

                    // TITLE
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "MILITARY POLICE REPORT",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "(GEN AND TRAFFIC OFFENCE)",
                                bold: true,
                                size: 24,
                            }),
                        ],
                        spacing: { after: 300 },
                    }),

                    // REPORT NO AND DATE TABLE
                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [
                                                new TextRun({ text: "Report No- ", size: 20 }),
                                                new TextRun({ text: data.reportNo, size: 20 })
                                            ]
                                        })],
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        borders: {
                                            top: { style: BorderStyle.NONE, size: 0 },
                                            bottom: { style: BorderStyle.NONE, size: 0 },
                                            left: { style: BorderStyle.NONE, size: 0 },
                                            right: { style: BorderStyle.NONE, size: 0 },
                                        },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [
                                                new TextRun({ text: "Report Date- ", size: 20 }),
                                                new TextRun({ text: data.reportDate, size: 20 })
                                            ],
                                            alignment: AlignmentType.RIGHT,
                                        })],
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        borders: {
                                            top: { style: BorderStyle.NONE, size: 0 },
                                            bottom: { style: BorderStyle.NONE, size: 0 },
                                            left: { style: BorderStyle.NONE, size: 0 },
                                            right: { style: BorderStyle.NONE, size: 0 },
                                        },
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "", spacing: { after: 200 } }),

                    // 1. PARTICULARS
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1.",
                                bold: true,
                                size: 20,
                            }),
                            new TextRun({
                                text: "     PARTICULARS:",
                                bold: true,
                                underline: {},
                                size: 20,
                            }),
                        ],
                        spacing: { after: 200 },
                    }),

                    // 1.1 Box
                    createParticularsBox("1.1", data.particulars.primary, "1.1.1"),
                    
                    // 1.2 Box (Optional)
                    ...(data.particulars.secondary ? [
                        new Paragraph({ text: "", spacing: { after: 100 } }),
                        createParticularsBox("1.2", data.particulars.secondary, "1.2.1") 
                    ] : []),

                    // 1.3 Vehicle Box (Optional)
                    ...(data.particulars.vehicle ? [
                        new Paragraph({ text: "", spacing: { after: 100 } }),
                        createVehicleBox(data.particulars.vehicle)
                    ] : []),

                    new Paragraph({ text: "", spacing: { after: 200 } }),

                    // 2. STATEMENT OF EVIDENCE
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2.",
                                bold: true,
                                size: 20,
                            }),
                            new TextRun({
                                text: "     STATEMENT OF EVIDENCE/OCCURRENCE:",
                                bold: true,
                                underline: {},
                                size: 20,
                            }),
                        ],
                        spacing: { after: 200 },
                    }),
                    
                    new Paragraph({ 
                        text: "     On-Duty Details of Witnessing Official:",
                        spacing: { after: 100 } 
                    }),
                    
                    // Evidence Grid
                    createEvidenceGrid(data.occurrence),

                    new Paragraph({ text: "", spacing: { after: 100 } }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "(2.5)  ", size: 20 }),
                            new TextRun({ text: data.occurrence.statement, size: 20 })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 }
                    }),

                    // 3. OFFENCE COMMITTED
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3.",
                                bold: true,
                                size: 20,
                            }),
                            new TextRun({
                                text: "     OFFENCE COMMITTED/ORDERS CONTRAVENED:",
                                bold: true,
                                underline: {},
                                size: 20,
                            }),
                        ],
                        spacing: { after: 200 },
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: "(3.1) ", size: 20 }),
                            new TextRun({ text: "Offence Type  ", bold: true, size: 20 }),
                            new TextRun({ text: data.offence.type, size: 20 })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "       ", size: 20 }),
                            new TextRun({ text: "Ref :- ", bold: true, size: 20 }),
                            new TextRun({ text: "(i.)  ", size: 20 }),
                            new TextRun({ text: data.offence.ref1, size: 20 })
                        ],
                        spacing: { after: 50 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "                 (ii.)  ", size: 20 }),
                            new TextRun({ text: data.offence.ref2, size: 20 })
                        ],
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "     " + data.offence.description, size: 20 })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 300 }
                    }),

                    // Signatures
                    createSignatureSection(data.witnessSig, data.mpSig),

                    new Paragraph({ text: "", spacing: { after: 300 } }),

                    // REMARKS
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "REMARKS OF CO/2IC PROVOST UNIT",
                                bold: true,
                                underline: {},
                                size: 20,
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "     " + data.remarks.text, size: 20 })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Station : ", bold: true, size: 20 }),
                            new TextRun({ text: "  " + data.remarks.station, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Dated :", bold: true, size: 20 }),
                            new TextRun({ text: "     " + data.remarks.dated, size: 20 })
                        ]
                    }),
                ],
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `Report_${data.reportNo || "Draft"}.docx`);
    });
};

function createParticularsBox(title1: string, p: any, title2?: string) {
    const rows: TableRow[] = [];

    // First section - civilian details
    rows.push(
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({ 
                        children: [new TextRun({ text: `(${title1})`, size: 20 })],
                        spacing: { before: 100, after: 100 }
                    })],
                    width: { size: 8, type: WidthType.PERCENTAGE },
                    verticalAlign: VerticalAlign.TOP,
                    shading: { fill: "F5F5F5" },
                }),
                new TableCell({
                    children: [
                        createInfoTable([
                            [{ label: "Aadhar Card No.", value: p.aadharCardNo }, { label: "S/O", value: p.so }],
                            [{ label: "Name", value: p.name }, { label: "Name the Relation", value: p.relation }],
                        ])
                    ],
                    width: { size: 92, type: WidthType.PERCENTAGE },
                    shading: { fill: "F5F5F5" },
                }),
            ],
        })
    );

    // Second section - military details
    if (title2) {
        rows.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: `(${title2})`, size: 20 })],
                            spacing: { before: 100, after: 100 }
                        })],
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.TOP,
                        shading: { fill: "FFFFFF" },
                    }),
                    new TableCell({
                        children: [
                            createInfoTable([
                                [{ label: "Army No.", value: p.armyNo }, { label: "Rank", value: p.rank }],
                                [{ label: "Name", value: p.name }, { label: "Unit", value: p.unit }],
                                [{ label: "FMN", value: p.fmn }, { label: "Command", value: p.command }],
                                [{ label: "Address", value: p.address }, { label: "I Card No.", value: p.iCardNo }],
                            ])
                        ],
                        width: { size: 92, type: WidthType.PERCENTAGE },
                        shading: { fill: "FFFFFF" },
                    }),
                ],
            })
        );
    }

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            insideVertical: { style: BorderStyle.NONE, size: 0 },
        },
        rows: rows,
    });
}

function createVehicleBox(vehicle: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0 },
            insideVertical: { style: BorderStyle.NONE, size: 0 },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ 
                            children: [new TextRun({ text: "(1.3)", size: 20 })],
                            spacing: { before: 100, after: 100 }
                        })],
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        shading: { fill: "F5F5F5" },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "DD Veh. BA No.  ", bold: true, size: 20 }),
                                    new TextRun({ text: vehicle.baNo, size: 20 })
                                ],
                                spacing: { before: 100, after: 100 }
                            })
                        ],
                        width: { size: 46, type: WidthType.PERCENTAGE },
                        shading: { fill: "F5F5F5" },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Make & Take  ", bold: true, size: 20 }),
                                    new TextRun({ text: vehicle.makeAndTake, size: 20 })
                                ],
                                spacing: { before: 100, after: 100 }
                            })
                        ],
                        width: { size: 46, type: WidthType.PERCENTAGE },
                        shading: { fill: "F5F5F5" },
                    }),
                ],
            })
        ]
    });
}

function createInfoTable(rows: Array<Array<{label: string, value: string}>>) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
            insideHorizontal: { style: BorderStyle.NONE, size: 0 },
            insideVertical: { style: BorderStyle.NONE, size: 0 },
        },
        rows: rows.map(row => new TableRow({
            children: row.flatMap(item => [
                new TableCell({
                    children: [new Paragraph({ 
                        children: [new TextRun({ text: item.label, bold: true, size: 20 })],
                        spacing: { before: 50, after: 50 }
                    })],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE, size: 0 },
                        bottom: { style: BorderStyle.NONE, size: 0 },
                        left: { style: BorderStyle.NONE, size: 0 },
                        right: { style: BorderStyle.NONE, size: 0 },
                    },
                }),
                new TableCell({
                    children: [new Paragraph({ 
                        text: item.value,
                        spacing: { before: 50, after: 50 }
                    })],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE, size: 0 },
                        bottom: { style: BorderStyle.NONE, size: 0 },
                        left: { style: BorderStyle.NONE, size: 0 },
                        right: { style: BorderStyle.NONE, size: 0 },
                    },
                })
            ])
        }))
    });
}

function createEvidenceGrid(occurrence: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
            insideHorizontal: { style: BorderStyle.NONE, size: 0 },
            insideVertical: { style: BorderStyle.NONE, size: 0 },
        },
        rows: [
            createEvidenceRow("(2.1)", "Date of Duty", occurrence.dateOfDuty, "(2.2)", "Duty Time", occurrence.dutyTime),
            createEvidenceRow("(2.3)", "Duty Location", occurrence.dutyLocation, "(2.4.1)", "Name of Witnessing Official", occurrence.nameOfWitnessingOfficial1),
            createEvidenceRow("(2.4.2)", "Name of Witnessing Official", occurrence.nameOfWitnessingOfficial2, "(2.4.3)", "Name of Witnessing Official", occurrence.nameOfWitnessingOfficial3 || ""),
            createEvidenceRow("(2.5)", "Time of Offence", occurrence.timeOfOffence, "(2.6)", "Location of Offence", occurrence.locationOfOffence),
        ]
    });
}

function createEvidenceRow(num1: string, label1: string, value1: string, num2: string, label2: string, value2: string) {
    return new TableRow({
        children: [
            new TableCell({
                children: [new Paragraph({ 
                    children: [new TextRun({ text: num1, size: 20 })],
                    spacing: { before: 50, after: 50 }
                })],
                width: { size: 8, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
                children: [new Paragraph({ 
                    children: [new TextRun({ text: label1, bold: true, size: 20 })],
                    spacing: { before: 50, after: 50 }
                })],
                width: { size: 17, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
                children: [new Paragraph({ 
                    text: value1,
                    spacing: { before: 50, after: 50 }
                })],
                width: { size: 17, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
                children: [new Paragraph({ 
                    children: [new TextRun({ text: num2, size: 20 })],
                    spacing: { before: 50, after: 50 }
                })],
                width: { size: 8, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
                children: [new Paragraph({ 
                    children: [new TextRun({ text: label2, bold: true, size: 20 })],
                    spacing: { before: 50, after: 50 }
                })],
                width: { size: 25, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
                children: [new Paragraph({ 
                    text: value2,
                    spacing: { before: 50, after: 50 }
                })],
                width: { size: 25, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
        ]
    });
}

function createSignatureSection(witnessSig: any, mpSig: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
            insideHorizontal: { style: BorderStyle.NONE, size: 0 },
            insideVertical: { style: BorderStyle.NONE, size: 0 },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({ 
                                children: [new TextRun({ text: "Sig of Witness   ________________", bold: true, size: 20 })],
                                spacing: { after: 200 }
                            }),
                            createSignatureBlock(witnessSig)
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({ 
                                children: [new TextRun({ text: "Sig of MP JCO/NCO", bold: true, size: 20 })],
                                spacing: { after: 200 },
                                alignment: AlignmentType.LEFT
                            }),
                            createSignatureBlock(mpSig)
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    }),
                ],
            })
        ]
    });
}

function createSignatureBlock(sig: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
            insideHorizontal: { style: BorderStyle.NONE, size: 0 },
            insideVertical: { style: BorderStyle.NONE, size: 0 },
        },
        rows: [
            signatureRow("Army No.", sig.armyNo),
            signatureRow("Rank", sig.rank),
            signatureRow("Name", sig.name),
            signatureRow("Unit", sig.unit),
        ]
    });
}

function signatureRow(label: string, value: string) {
    return new TableRow({
        children: [
            new TableCell({ 
                children: [new Paragraph({ 
                    children: [new TextRun({ text: label, bold: true, size: 20 })],
                    spacing: { before: 50, after: 50 }
                })],
                width: { size: 30, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({ 
                children: [new Paragraph({ 
                    text: value,
                    spacing: { before: 50, after: 50 }
                })],
                width: { size: 70, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
        ]
    });
}