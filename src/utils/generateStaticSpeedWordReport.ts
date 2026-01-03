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
    Header,
    Footer,
    PageNumber,
} from "docx";
import { saveAs } from "file-saver";
import { StaticSpeedReportProps } from "@/components/reports/StaticSpeedReport";

/* ===============================
   COMMON STYLES & HELPERS
================================ */
const CELL_PADDING = {
    top: 60,
    bottom: 60,
    left: 60,
    right: 60,
};

const NO_BORDERS = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const GRAY_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };

const TABLE_BORDERS_ALL = {
    top: GRAY_BORDER,
    bottom: GRAY_BORDER,
    left: GRAY_BORDER,
    right: GRAY_BORDER,
    insideHorizontal: GRAY_BORDER,
    insideVertical: GRAY_BORDER,
};

const spacer = (size = 200) => new Paragraph({ text: "", spacing: { after: size } });

function sectionHeading(no: string, title: string) {
    return new Paragraph({
        children: [
            new TextRun({ text: no, bold: true, size: 24 }),
            new TextRun({ text: "  ", size: 24 }),
            new TextRun({ text: title, bold: true, underline: {}, size: 24 }),
        ],
        spacing: { after: 200 },
    });
}

export const generateStaticSpeedWordReport = async (data: StaticSpeedReportProps) => {
    const doc = new Document({
        creator: "Army App",
        title: "Static Speed Check Report",
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 24, // 12pt
                        color: "0A0A0A",
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    titlePage: true,
                    page: {
                        margin: {
                            top: 800,
                            right: 800,
                            bottom: 800,
                            left: 800,
                        },
                    },
                },
                headers: {
                    default: new Header({
                        children: [
                            // Fixed Page Numbering: - 1 -
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "-", size: 24 }),
                                    new TextRun({ children: [PageNumber.CURRENT], size: 24 }),
                                    new TextRun({ text: "-", size: 24 }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 }),
                                ],
                                spacing: { after: 300 },
                            }),
                        ],
                    }),
                    first: new Header({
                        children: [],
                    }),
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 }),
                                ],
                            }),
                        ],
                    }),
                    first: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [
                    // --- HEADER START ---
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: "In Lieu Of IAFP-1479",
                                bold: true,
                                underline: {},
                                size: 24,
                            }),
                        ],
                        spacing: { after: 200 },
                    }),

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
                                text: "(STATIC SPEED CHECK)",
                                bold: true,
                                size: 24,
                            }),
                        ],
                        spacing: { after: 400 },
                    }),

                    // Meta Info Table
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDERS,
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: [
                                                    new TextRun({ text: "Report No- ", bold: true, size: 24 }),
                                                    new TextRun({ text: data.reportNo, size: 24 }),
                                                ],
                                            }),
                                        ],
                                        width: { size: 33, type: WidthType.PERCENTAGE },
                                    }),
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "Unit: ", bold: true, size: 24 }),
                                                    new TextRun({ text: data.unitName, size: 24 }),
                                                ],
                                            }),
                                        ],
                                        width: { size: 34, type: WidthType.PERCENTAGE },
                                    }),
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.RIGHT,
                                                children: [
                                                    new TextRun({ text: "Report Date- ", bold: true, size: 24 }),
                                                    new TextRun({ text: data.reportDate, size: 24 }),
                                                ],
                                            }),
                                        ],
                                        width: { size: 33, type: WidthType.PERCENTAGE },
                                    }),
                                ],
                            }),
                        ],
                    }),
                    spacer(),
                    // --- HEADER END ---

                    // --- 1. PARTICULARS ---
                    sectionHeading("1.", "PARTICULARS:"),
                    createParticularsTable(data.particulars),
                    spacer(),

                    // --- 2. STATEMENT ---
                    sectionHeading("2.", "STATEMENT OF EVIDENCE/OCCURRENCE:"),
                    createOccurrenceTable(data.occurrence),
                    spacer(150),
                    // Statement Text (2.3)
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDERS,
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 10, type: WidthType.PERCENTAGE },
                                        verticalAlign: VerticalAlign.TOP,
                                        children: [new Paragraph({ children: [new TextRun({ text: "(2.3)", bold: true, size: 24 })] })],
                                    }),
                                    new TableCell({
                                        width: { size: 90, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                children: [new TextRun({ text: data.occurrence.statement, size: 24 })],
                                                alignment: AlignmentType.JUSTIFIED,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                    spacer(),

                    // --- 3. OFFENCE ---
                    sectionHeading("3.", "OFFENCE COMMITTED/ORDERS CONTRAVENED:"),
                    createOffenceTable(data.offence),
                    spacer(),

                    // --- 4. WITNESS ---
                    sectionHeading("4.", "WITNESS"),
                    createSignatureSection(data.witnessSig, data.mpSig),
                    spacer(),

                    // --- REMARKS ---
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "REMARKS OF CO/2IC PROVOST UNIT", bold: true, underline: {}, size: 24 }),
                        ],
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: data.remarks.text, size: 24 })],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 300 },
                    }),

                    // Station / Dated Footer
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDERS,
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: [
                                                    new TextRun({ text: "Station : ", bold: true, size: 24 }),
                                                    new TextRun({ text: `  ${data.remarks.station}`, size: 24 }),
                                                ]
                                            }),
                                            new Paragraph({
                                                children: [
                                                    new TextRun({ text: "Dated : ", bold: true, size: 24 }),
                                                    new TextRun({ text: `    ${data.remarks.dated}`, size: 24 }),
                                                ],
                                                spacing: { before: 100 }
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `Static_Speed_Report_${data.reportNo || "Draft"}.docx`);
    });
};

/* ============================
   SUB-COMPONENTS (Layout)
============================= */

function createParticularsTable(particulars: StaticSpeedReportProps['particulars']) {
    // 1.1 Rider and 1.2 Vehicle combined in one container box style if desired,
    // but React component creates a border main box.
    const p = particulars.rider;
    const v = particulars.vehicle;

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: TABLE_BORDERS_ALL,
        rows: [
            // (1.1) Rider
            new TableRow({
                children: [
                    // (1.1) Label
                    new TableCell({
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.TOP,
                        margins: CELL_PADDING,
                        borders: { bottom: GRAY_BORDER, right: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE } },
                        children: [new Paragraph({ text: "(1.1)", bold: true })],
                    }),
                    // Details Grid
                    new TableCell({
                        width: { size: 92, type: WidthType.PERCENTAGE },
                        margins: CELL_PADDING,
                        borders: { bottom: GRAY_BORDER, left: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [
                            createDetailGrid([
                                { label: "DD veh rider no.", value: p.armyNo }, { label: "Rank", value: p.rank },
                                { label: "Name", value: p.name }, { label: "Unit", value: p.unit },
                                { label: "FMN", value: p.fmn }, { label: "Command", value: p.command },
                                { label: "Address", value: p.address }, { label: "I Card No.", value: p.iCardNo },
                            ])
                        ],
                    }),
                ],
            }),
            // (1.2) Vehicle
            new TableRow({
                children: [
                    // (1.2) Label
                    new TableCell({
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.TOP,
                        margins: CELL_PADDING,
                        borders: { top: GRAY_BORDER, right: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE } },
                        children: [new Paragraph({ text: "(1.2)", bold: true })],
                    }),
                    // Details Grid
                    new TableCell({
                        width: { size: 92, type: WidthType.PERCENTAGE },
                        margins: CELL_PADDING,
                        borders: { top: GRAY_BORDER, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [
                            createDetailGrid([
                                { label: "DD Veh BA no.", value: v.baNo }, { label: "Make & Take", value: v.makeAndTake },
                            ])
                        ],
                    }),
                ]
            })
        ],
    });
}

function createDetailGrid(items: { label: string, value: string }[]) {
    // Mimic grid layout with nested table (2 columns: Label/Value, Label/Value)
    // Actually items is flat list. We want pairs.
    const pairs = [];
    for (let i = 0; i < items.length; i += 2) {
        pairs.push(items.slice(i, i + 2));
    }

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDERS,
        rows: pairs.map(pair =>
            new TableRow({
                children: pair.flatMap(item => [
                    new TableCell({
                        width: { size: 15, type: WidthType.PERCENTAGE },
                        margins: { top: 30, bottom: 30, right: 30, left: 0 },
                        children: [new Paragraph({ children: [new TextRun({ text: item.label, bold: true })] })]
                    }),
                    new TableCell({
                        width: { size: 35, type: WidthType.PERCENTAGE },
                        margins: { top: 30, bottom: 30, right: 30, left: 0 },
                        children: [new Paragraph({ text: item.value })]
                    })
                ])
            })
        )
    });
}


function createOccurrenceTable(occ: StaticSpeedReportProps['occurrence']) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: TABLE_BORDERS_ALL,
        rows: [
            // Row 1: (2.1) Date, Duty Time
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: CELL_PADDING,
                        borders: { bottom: GRAY_BORDER, right: GRAY_BORDER, top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE } },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "(2.1)   ", size: 24 }),
                                    new TextRun({ text: "Date of Duty   ", bold: true, size: 24 }),
                                    new TextRun({ text: occ.dateOfDuty, size: 24 }),
                                ]
                            })
                        ],
                    }),
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: CELL_PADDING,
                        borders: { bottom: GRAY_BORDER, left: GRAY_BORDER, top: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Duty Time   ", bold: true, size: 24 }),
                                    new TextRun({ text: occ.dutyTime, size: 24 }),
                                ]
                            })
                        ],
                    }),
                ],
            }),
            // Row 2: Location
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        columnSpan: 2,
                        margins: CELL_PADDING,
                        borders: { bottom: GRAY_BORDER, top: GRAY_BORDER, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "          ", size: 24 }), // Indent for numbering alignment
                                    new TextRun({ text: "Duty Location   ", bold: true, size: 24 }),
                                    new TextRun({ text: occ.dutyLocation, size: 24 }),
                                ]
                            })
                        ]
                    })
                ]
            }),
            // Row 3: Witness 1
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: CELL_PADDING,
                        borders: { bottom: GRAY_BORDER, right: GRAY_BORDER, top: GRAY_BORDER, left: { style: BorderStyle.NONE } },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "(2.2)   ", size: 24 }),
                                    new TextRun({ text: "Name of MP Witnessing   ", bold: true, size: 24 }),
                                    new TextRun({ text: occ.nameOfWitnessingOfficial1, size: 24 }),
                                ]
                            })
                        ],
                    }),
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: CELL_PADDING,
                        borders: { bottom: GRAY_BORDER, left: GRAY_BORDER, top: GRAY_BORDER, right: { style: BorderStyle.NONE } },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Rank   ", bold: true, size: 24 }),
                                    new TextRun({ text: occ.rankOfWitnessingOfficial1 || "Hav (MP)", size: 24 }),
                                ]
                            })
                        ],
                    }),
                ],
            }),
            // Row 4: Witness 2
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: CELL_PADDING,
                        borders: { top: GRAY_BORDER, right: GRAY_BORDER, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE } },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "(2.2.1)   ", size: 24 }),
                                    new TextRun({ text: "Name of MP Witnessing   ", bold: true, size: 24 }),
                                    new TextRun({ text: occ.nameOfWitnessingOfficial2, size: 24 }),
                                ]
                            })
                        ],
                    }),
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: CELL_PADDING,
                        borders: { top: GRAY_BORDER, left: GRAY_BORDER, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Rank   ", bold: true, size: 24 }),
                                    new TextRun({ text: occ.rankOfWitnessingOfficial2 || "Hav (MP)", size: 24 }),
                                ]
                            })
                        ],
                    }),
                ],
            }),
        ],
    });
}

function createOffenceTable(offence: StaticSpeedReportProps['offence']) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDERS,
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.TOP,
                        children: [new Paragraph({ children: [new TextRun({ text: "(3.1)", bold: true })] })]
                    }),
                    new TableCell({
                        width: { size: 92, type: WidthType.PERCENTAGE },
                        children: [
                            createDetailGrid([
                                { label: "Actual Speed Noted", value: offence.actualSpeed },
                                { label: "Auth Speed", value: offence.authSpeed },
                                { label: "Over Speed Calculated", value: offence.overSpeed },
                            ])
                        ]
                    })
                ]
            })
        ]
    })
}

function createSignatureSection(witnessSig: StaticSpeedReportProps['witnessSig'], mpSig: StaticSpeedReportProps['mpSig']) {
    return new Table({
        width: { size: 90, type: WidthType.PERCENTAGE },
        borders: NO_BORDERS,
        rows: [
            new TableRow({
                children: [
                    // Witness Sig Column
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: { right: 200 },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Sig of Witness", bold: true, size: 24 }),
                                    new TextRun({ text: "      _______________", size: 24 }),
                                ],
                                spacing: { after: 100 }
                            }),
                            createDetailGrid([
                                { label: "Army No.", value: witnessSig.armyNo },
                                { label: "Rank", value: witnessSig.rank },
                                { label: "Name", value: witnessSig.name },
                                { label: "Unit", value: witnessSig.unit },
                            ])
                        ]
                    }),
                    // MP Sig Column
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: { left: 200 },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Sig of MP JCO/NCO", bold: true, size: 24 }),
                                ],
                                spacing: { after: 100 }
                            }),
                            createDetailGrid([
                                { label: "Army No.", value: mpSig.armyNo },
                                { label: "Rank", value: mpSig.rank },
                                { label: "Name", value: mpSig.name },
                                { label: "Unit", value: mpSig.unit },
                            ])
                        ]
                    }),
                ]
            })
        ]
    })
}
