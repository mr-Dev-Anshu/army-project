
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
import { StaticSpeedReportProps } from "@/components/reports/StaticSpeedReport";

export const generateStaticSpeedWordReport = async (data: StaticSpeedReportProps) => {
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
                            top: 1134, // 20mm in twips (roughly)
                            right: 1134,
                            bottom: 1134,
                            left: 1134,
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
                                bold: true,
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
                                size: 24, // 12pt
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "(STATIC SPEED CHECK)",
                                bold: true,
                                size: 24,
                            }),
                        ],
                        spacing: { after: 300 },
                    }),

                    // HEADER INFO TABLE (Report No, Unit, Date)
                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
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
                                        children: [new Paragraph({
                                            children: [
                                                new TextRun({ text: "Report No- ", size: 18 }),
                                                new TextRun({ text: data.reportNo, size: 18 })
                                            ]
                                        })],
                                        width: { size: 35, type: WidthType.PERCENTAGE },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [
                                                new TextRun({ text: "Unit: ", size: 18 }),
                                                new TextRun({ text: data.unitName, size: 18 })
                                            ],
                                            alignment: AlignmentType.CENTER
                                        })],
                                        width: { size: 30, type: WidthType.PERCENTAGE },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [
                                                new TextRun({ text: "Report Date- ", size: 18 }),
                                                new TextRun({ text: data.reportDate, size: 18 })
                                            ],
                                            alignment: AlignmentType.RIGHT,
                                        })],
                                        width: { size: 35, type: WidthType.PERCENTAGE },
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

                    // 1.1 Box (Rider Details) + 1.2 (Vehicle)
                    createParticularsBox(data.particulars),

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
                        children: [
                            new TextRun({ text: data.occurrence.statement, size: 20 })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 300 }
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

                    createOffenceTable(data.offence),

                    new Paragraph({ text: "", spacing: { after: 300 } }),

                    // 4. WITNESS
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "4.",
                                bold: true,
                                size: 20,
                            }),
                            new TextRun({
                                text: "     WITNESS",
                                bold: true,
                                underline: {},
                                size: 20,
                            }),
                        ],
                        spacing: { after: 200 },
                    }),

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
        saveAs(blob, `Static_Speed_Report_${data.reportNo || "Draft"}.docx`);
    });
};

function createParticularsBox(p: { rider: any, vehicle: any }) {
    // 1.1 Rider
    // 1.2 Vehicle
    // One big table with borders
    const rows: TableRow[] = [];

    // --- (1.1) Rider Section ---
    rows.push(new TableRow({
        children: [
            new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "(1.1)", size: 20 })], spacing: { before: 100 } })],
                width: { size: 8, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.TOP,
                shading: { fill: "F5F5F5" },
            }),
            new TableCell({
                children: [
                    createInfoTable([
                        [{ label: "DD veh rider no.", value: p.rider.armyNo }, { label: "Rank", value: p.rider.rank }],
                        [{ label: "Name", value: p.rider.name }, { label: "Unit", value: p.rider.unit }],
                        [{ label: "FMN", value: p.rider.fmn }, { label: "Command", value: p.rider.command }],
                        [{ label: "Address", value: p.rider.address }, { label: "I Card No.", value: p.rider.iCardNo }],
                    ])
                ],
                width: { size: 92, type: WidthType.PERCENTAGE },
                shading: { fill: "F5F5F5" },
            }),
        ]
    }));

    // --- (1.2) Vehicle Section ---
    rows.push(new TableRow({
        children: [
            new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "(1.2)", size: 20 })], spacing: { before: 100 } })],
                width: { size: 8, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                shading: { fill: "FFFFFF" },
                borders: { top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" } }
            }),
            new TableCell({
                children: [
                    createInfoTable([
                         [{ label: "DD Veh BA no.", value: p.vehicle.baNo }, { label: "Make & Take", value: p.vehicle.makeAndTake }],
                    ])
                ],
                width: { size: 92, type: WidthType.PERCENTAGE },
                shading: { fill: "FFFFFF" },
                borders: { top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" } }
            }),
        ]
    }));

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
        rows: rows,
    });
}

function createOffenceTable(offence: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                         children: [new Paragraph({ children: [new TextRun({ text: "(3.1)", size: 20 })] })],
                         width: { size: 8, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Actual Speed Noted     ", bold: true, size: 20 }),
                                    new TextRun({ text: offence.actualSpeed, size: 20 })
                                ],
                                spacing: { after: 100 }
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Auth Speed                   ", bold: true, size: 20 }),
                                    new TextRun({ text: offence.authSpeed, size: 20 })
                                ],
                                spacing: { after: 100 }
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Over Speed Calculated  ", bold: true, size: 20 }),
                                    new TextRun({ text: offence.overSpeed, size: 20 })
                                ],
                                spacing: { after: 100 }
                            }),
                        ],
                        width: { size: 92, type: WidthType.PERCENTAGE }
                    })
                ]
            })
        ]
    })
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
                }),
                new TableCell({
                    children: [new Paragraph({ 
                        text: item.value,
                        spacing: { before: 50, after: 50 }
                    })],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                })
            ])
        }))
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
            }),
            new TableCell({ 
                children: [new Paragraph({ 
                    text: value,
                    spacing: { before: 50, after: 50 }
                })],
                width: { size: 70, type: WidthType.PERCENTAGE },
            }),
        ]
    });
}
