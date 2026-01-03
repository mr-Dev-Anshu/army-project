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
import { MilitaryPoliceReportProps } from "@/components/reports/MilitaryPoliceReport";

/* ===============================
   COMMON CELL PADDING (UI MATCH)
================================ */
const CELL_PADDING = {
    top: 60,      // ~3px
    bottom: 60,   // ~3px
    left: 30,     // ~1.5px
    right: 20,
};

function createInfoTable(
    rows: Array<Array<{ label: string; value: string }>>
) {
    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
        },
        rows: rows.map(
            (row) =>
                new TableRow({
                    children: row.flatMap((item) => [
                        // LABEL CELL
                        new TableCell({
                            width: { size: 25, type: WidthType.PERCENTAGE },
                            margins: CELL_PADDING,
                            borders: {
                                top: { style: BorderStyle.NONE },
                                bottom: { style: BorderStyle.NONE },
                                left: { style: BorderStyle.NONE },
                                right: { style: BorderStyle.NONE },
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: item.label,
                                            bold: true,
                                            size: 24,
                                        }),
                                    ],
                                }),
                            ],
                        }),

                        // VALUE CELL
                        new TableCell({
                            width: { size: 25, type: WidthType.PERCENTAGE },
                            margins: CELL_PADDING,
                            borders: {
                                top: { style: BorderStyle.NONE },
                                bottom: { style: BorderStyle.NONE },
                                left: { style: BorderStyle.NONE },
                                right: { style: BorderStyle.NONE },
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: item.value || "",
                                            size: 24,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ]),
                })
        ),
    });
}


export const generateWordReport = async (data: MilitaryPoliceReportProps) => {
    const doc = new Document({
        creator: "Army App",
        title: "Military Police Report",
        description: "Generated Offence Report",
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 24,
                        characterSpacing: 10,
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
                                    new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24, color: "#0A0A0A" }),
                                ],
                                spacing: { after: 400 },
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
                                    new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24, color: "0A0A0A" }),
                                ],
                            }),
                        ],
                    }),
                    first: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24, color: "0A0A0A" }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [
                    /* TOP RIGHT */
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({ text: "In Lieu Of IAFP-1479", size: 24 }),
                        ],
                        spacing: { after: 200 },
                    }),

                    /* TITLE */
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "MILITARY POLICE REPORT", bold: true, size: 24 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "(GEN AND TRAFFIC OFFENCE)", bold: true, size: 24 })],
                        spacing: { after: 300 },
                    }),

                    /* REPORT META */
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: TableBordersNone(),
                        rows: [
                            new TableRow({
                                children: [
                                    metaCell("Report No- ", data.reportNo),
                                    metaCell("Report Date- ", data.reportDate, AlignmentType.RIGHT),
                                ],
                            }),
                        ],
                    }),

                    spacer(),

                    /* 1. PARTICULARS */
                    sectionHeading("1.", "PARTICULARS:"),

                    createParticularsBox("1.1", data.particulars.primary, "1.1.1", "Driver Name"),

                    ...(data.particulars.secondary
                        ? [spacer(100), createParticularsBox("1.2", data.particulars.secondary, "1.2.1", "Co-Driver Name")]
                        : []),

                    ...(data.particulars.vehicle
                        ? [spacer(100), createVehicleBox(data.particulars.vehicle)]
                        : []),

                    spacer(),

                    /* 2. STATEMENT */
                    sectionHeading("2.", "STATEMENT OF EVIDENCE/OCCURRENCE:"),


                    new Paragraph({
                        text: "     On-Duty Details of Witnessing Official:",
                        spacing: { after: 100 },
                    }),

                    createEvidenceGrid(data.occurrence),

                    spacer(100),

                    new Paragraph({
                        children: [
                            new TextRun({ text: "(2.7)  ", size: 24 }),
                            new TextRun({ text: data.occurrence.statement, size: 24 }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                    }),

                    spacer(),

                    /* 3. OFFENCE */
                    sectionHeading("3.", "OFFENCE COMMITTED/ORDERS CONTRAVENED:"),

                    offenceParagraph("(3.1)", "Offence Type", data.offence.type),
                    offenceRef("(i.)", data.offence.ref1),
                    offenceRef("(ii.)", data.offence.ref2),
                    offenceDescription(data.offence.description),

                    spacer(),

                    /* SIGNATURES */
                    createSignatureSection(data.witnessSig, data.mpSig),

                    spacer(),

                    /* REMARKS */
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "REMARKS OF CO/2IC PROVOST UNIT",
                                bold: true,
                                underline: {},
                                size: 24,
                            }),
                        ],
                    }),

                    spacer(150),

                    new Paragraph({
                        children: [new TextRun({ text: data.remarks.text, size: 24 })],
                        alignment: AlignmentType.JUSTIFIED,
                    }),

                    spacer(100),

                    footerLine("Station :", data.remarks.station),
                    footerLine("Dated :", data.remarks.dated),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const docBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    saveAs(docBlob, `Report_${data.reportNo || "Draft"}.docx`);
};

/* ===============================
   HELPERS (UI MATCHED)
================================ */

function TableBordersNone() {
    return {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
    };
}

const spacer = (after = 200) => new Paragraph({ text: "", spacing: { after } });

function sectionHeading(no: string, title: string) {
    return new Paragraph({
        children: [
            new TextRun({ text: no, bold: true, size: 24 }),
            new TextRun({ text: "     ", size: 24 }), // Spaces not underlined
            new TextRun({ text: title, bold: true, underline: {}, size: 24 }),
        ],
        spacing: { after: 200 },
    });
}

function metaCell(label: string, value: string, align: any = AlignmentType.LEFT) {
    return new TableCell({
        margins: CELL_PADDING,
        children: [
            new Paragraph({
                alignment: align,
                children: [
                    new TextRun({ text: label, size: 24 }),
                    new TextRun({ text: value, size: 24 }),
                ],
            }),
        ],
        borders: TableBordersNone(),
    });
}

function footerLine(label: string, value: string) {
    return new Paragraph({
        children: [
            new TextRun({ text: label, bold: true, size: 24 }),
            new TextRun({ text: `  ${value}`, size: 24 }),
        ],
    });
}

/* ===============================
   PARTICULARS BOX (PADDED)
================================ */

function createParticularsBox(title1: string, p: any, title2?: string, mainNameLabel = "Name") {
    const rows: TableRow[] = [];

    rows.push(
        new TableRow({
            children: [
                boxIndexCell(title1),
                boxContentCell(
                    createInfoTable([
                        [{ label: "Aadhar Card No.", value: p.aadharCardNo }, { label: "S/O", value: p.so }],
                        [{ label: mainNameLabel, value: p.name }, { label: "Name the Relation", value: p.relation }],
                    ])
                ),
            ],
        })
    );

    if (title2) {
        rows.push(
            new TableRow({
                children: [
                    boxIndexCell(title2),
                    boxContentCell(
                        createInfoTable([
                            [{ label: "Army No.", value: p.armyNo }, { label: "Rank", value: p.rank }],
                            [{ label: "Name", value: p.name }, { label: "Unit", value: p.unit }],
                            [{ label: "FMN", value: p.fmn }, { label: "Command", value: p.command }],
                            [{ label: "Address", value: p.address }, { label: "I Card No.", value: p.iCardNo }],
                        ])
                    ),
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
            insideVertical: { style: BorderStyle.NONE },
        },
        rows,
    });
}


function boxIndexCell(text: string) {
    return new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
        margins: CELL_PADDING,
        children: [new Paragraph({ children: [new TextRun({ text: `(${text})`, size: 24 })] })],
    });
}

function boxContentCell(content: any) {
    return new TableCell({
        width: { size: 92, type: WidthType.PERCENTAGE },
        margins: CELL_PADDING,
        children: [content],
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
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
            new TableRow({
                children: [
                    boxIndexCell("1.3"),
                    boxContentCell(
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            borders: TableBordersNone(),
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            width: { size: 50, type: WidthType.PERCENTAGE },
                                            borders: TableBordersNone(),
                                            children: [
                                                new Paragraph({
                                                    children: [
                                                        new TextRun({ text: "DD Veh. BA No.  ", bold: true, size: 24 }),
                                                        new TextRun({ text: vehicle.baNo, size: 24 }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            width: { size: 50, type: WidthType.PERCENTAGE },
                                            borders: TableBordersNone(),
                                            children: [
                                                new Paragraph({
                                                    children: [
                                                        new TextRun({ text: "Make & Take  ", bold: true, size: 24 }),
                                                        new TextRun({ text: vehicle.makeAndTake, size: 24 }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        })
                    ),
                ],
            }),
        ],
    });
}

function createEvidenceGrid(occurrence: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            left: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            insideVertical: { style: BorderStyle.NONE }, // Explicitly NONE to match image (no column dividers)
        },
        rows: [
            createEvidenceRow("(2.1)", "Date of Duty", occurrence.dateOfDuty, "(2.2)", "Duty Time", occurrence.dutyTime),
            createEvidenceRow("(2.3)", "Duty Location", occurrence.dutyLocation, "(2.4.1)", "Name of Witnessing Official", occurrence.nameOfWitnessingOfficial1),
            createEvidenceRow("(2.4.2)", "Name of Witnessing Official", occurrence.nameOfWitnessingOfficial2, "(2.4.3)", "Name of Official", occurrence.nameOfWitnessingOfficial3 || ""),
            createEvidenceRow("(2.5)", "Time of Offence", occurrence.timeOfOffence, "(2.6)", "Location of Offence", occurrence.locationOfOffence),
        ],
    });
}

function createEvidenceRow(num1: string, label1: string, value1: string, num2: string, label2: string, value2: string) {
    return new TableRow({
        children: [
            evidenceCell(num1, 8),
            evidenceLabelCell(label1, 17),
            evidenceValueCell(value1, 17),
            evidenceCell(num2, 8),
            evidenceLabelCell(label2, 25),
            evidenceValueCell(value2, 25),
        ],
    });
}

function evidenceCell(text: string, widthPercent: number) {
    return new TableCell({
        width: { size: widthPercent, type: WidthType.PERCENTAGE },
        margins: CELL_PADDING,
        children: [new Paragraph({ children: [new TextRun({ text: text ?? "", size: 24 })] })],
    });
}

function evidenceLabelCell(text: string, widthPercent: number) {
    return new TableCell({
        width: { size: widthPercent, type: WidthType.PERCENTAGE },
        margins: CELL_PADDING,
        children: [new Paragraph({ children: [new TextRun({ text: text ?? "", bold: true, size: 24 })] })],
    });
}

function evidenceValueCell(text: string, widthPercent: number) {
    return new TableCell({
        width: { size: widthPercent, type: WidthType.PERCENTAGE },
        margins: CELL_PADDING,
        children: [new Paragraph({ children: [new TextRun({ text: text ?? "", size: 24 })] })],
    });
}

function offenceParagraph(prefix: string, label: string, value: string) {
    return new Paragraph({
        children: [
            new TextRun({ text: `${prefix} `, size: 24 }),
            new TextRun({ text: `${label}  `, bold: true, size: 24 }),
            new TextRun({ text: value || "", size: 24 }),
        ],
        spacing: { after: 100 },
    });
}

function offenceRef(prefix: string, text: string) {
    return new Paragraph({
        children: [
            new TextRun({ text: `       ${prefix}  `, size: 24 }),
            new TextRun({ text: text || "", size: 24 }),
        ],
        spacing: { after: 50 },
    });
}

function offenceDescription(text: string) {
    return new Paragraph({
        children: [new TextRun({ text: `     ${text || ""}`, size: 24 })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 300 },
    });
}

function createSignatureSection(witnessSig: any, mpSig: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: TableBordersNone(),
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: TableBordersNone(),
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "Sig of Witness   ________________", bold: true, size: 24 })],
                                spacing: { after: 200 },
                            }),
                            createSignatureBlock(witnessSig),
                        ],
                    }),
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: TableBordersNone(),
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: "Sig of MP JCO/NCO", bold: true, size: 24 })],
                                spacing: { after: 200 },
                                alignment: AlignmentType.LEFT,
                            }),
                            createSignatureBlock(mpSig),
                        ],
                    }),
                ],
            }),
        ],
    });
}

function createSignatureBlock(sig: any) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: TableBordersNone(),
        rows: [
            signatureRow("Army No.", sig.armyNo),
            signatureRow("Rank", sig.rank),
            signatureRow("Name", sig.name),
            signatureRow("Unit", sig.unit),
        ],
    });
}

function signatureRow(label: string, value: string) {
    return new TableRow({
        children: [
            new TableCell({
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: label, bold: true, size: 24 })],
                        spacing: { before: 50, after: 50 },
                    }),
                ],
                width: { size: 30, type: WidthType.PERCENTAGE },
                borders: TableBordersNone(),
            }),
            new TableCell({
                children: [
                    new Paragraph({
                        text: value || "",
                        spacing: { before: 50, after: 50 },
                    }),
                ],
                width: { size: 70, type: WidthType.PERCENTAGE },
                borders: TableBordersNone(),
            }),
        ],
    });
}

