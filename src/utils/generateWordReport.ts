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

const CELL_PADDING = {
    top: 60,
    bottom: 60,
    left: 30,
    right: 20,
};

const hasContent = (str?: string) => str && str !== "N/A" && str.trim() !== "";
const hasAnyContent = (obj: any, keys: string[]) => {
    if (!obj) return false;
    return keys.some(key => hasContent(obj[key]));
};
const hasArrayContent = (arr?: string[]) => arr && arr.length > 0 && arr.some(item => hasContent(item));

const chunkArray = <T>(arr: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
};

// Interface for normalized blocks (Internal helper)
interface NormalizedBlock {
    index: string;
    fields: { label: string; value: string }[];
}

function normalizeParticulars(particulars: MilitaryPoliceReportProps['particulars']): NormalizedBlock[] {
    if (particulars.blocks && particulars.blocks.length > 0) {
        return particulars.blocks;
    }

    const blocks: NormalizedBlock[] = [];
    const p = particulars.primary;
    const s = particulars.secondary;
    const v = particulars.vehicle;

    let sectionCounter = 1;

    const processPerson = (person: any, isPrimary: boolean) => {
        if (!person) return;

        const hasAadhar = hasContent(person.aadharCardNo);
        const hasArmyNo = hasContent(person.armyNo);
        const isDependent = hasAadhar && hasArmyNo;

        // Determine effective type
        let type = person.driverType;
        if (!type) {
            if (hasArmyNo && !hasAadhar) type = 'Military Person';
            else type = 'Civilian';
        }

        const currentIndex = `(1.${sectionCounter})`;

        // --- LOGIC BY TYPE ---

        if (type === 'Shop Keeper') {
            // Shop Keeper: Address primarily
            const fields = [{ label: "Address", value: person.address }];
            if (hasAnyContent(person, ['address'])) {
                blocks.push({
                    index: currentIndex,
                    fields: fields
                });
            }
            sectionCounter++;

        } else if (type === 'Military Person') {
            // Military Person
            const armyLabel = isPrimary ? "DD veh rider no." : "Army No.";
            const fields = [
                { label: armyLabel, value: person.armyNo },
                { label: "Rank", value: person.rank },
                { label: "Name", value: person.name },
                { label: "Unit", value: person.unit },
                { label: "FMN", value: person.fmn },
                { label: "Command", value: person.command },
                { label: "Address", value: person.address },
                { label: "I Card No.", value: person.iCardNo }
            ];

            if (hasAnyContent(person, ['armyNo'])) {
                blocks.push({
                    index: currentIndex,
                    fields: fields
                });
            }
            sectionCounter++;

        } else if (['Employee', 'Servant/Maid', 'Temporary Hired Worker'].includes(type)) {
            // Other Workers: Name, Address, Aadhar (Civ Subset)
            const fields = [
                { label: "Name", value: person.name },
                { label: "Address", value: person.address },
                { label: "Aadhar No.", value: person.aadharCardNo },
                { label: "S/O", value: person.so }
            ];

            if (hasAnyContent(person, ['name', 'address', 'aadharCardNo'])) {
                blocks.push({
                    index: currentIndex,
                    fields: fields
                });
            }
            sectionCounter++;

        } else {
            // Civilian / Dependent (Default Fallback)
            if (isDependent) {
                // Dependent: Split 1.X (Civ) and 1.X.1 (Army)
                const civFields = [
                    { label: "Aadhar No.", value: person.aadharCardNo },
                    { label: "S/O", value: person.so },
                    { label: isPrimary ? "Driver Name" : "Name", value: person.name },
                    { label: "Name the Relation", value: person.relation }
                ];

                if (hasAnyContent(person, ['aadharCardNo', 'so', 'name', 'relation'])) {
                    blocks.push({
                        index: currentIndex,
                        fields: civFields
                    });
                }

                const armyFields = [
                    { label: "Army No.", value: person.armyNo },
                    { label: "Rank", value: person.rank },
                    { label: "Name", value: person.name },
                    { label: "Unit", value: person.unit },
                    { label: "FMN", value: person.fmn },
                    { label: "Command", value: person.command },
                    { label: "Address", value: person.address },
                    { label: "I Card No.", value: person.iCardNo }
                ];

                if (hasAnyContent(person, ['armyNo'])) {
                    blocks.push({
                        index: `(1.${sectionCounter}.1)`,
                        fields: armyFields
                    });
                }
                sectionCounter++;

            } else {
                // Pure Civilian
                const fields = [
                    { label: "Aadhar No.", value: person.aadharCardNo },
                    { label: "S/O", value: person.so },
                    { label: isPrimary ? "Driver Name" : "Name", value: person.name },
                    { label: "Name the Relation", value: person.relation },
                    { label: "Address", value: person.address }
                ];
                if (hasAnyContent(person, ['aadharCardNo', 'so', 'name', 'relation', 'address'])) {
                    blocks.push({
                        index: currentIndex,
                        fields: fields
                    });
                }
                sectionCounter++;
            }
        }
    };

    processPerson(p, true);
    processPerson(s, false);

    // --- Vehicle ---
    if (v) {
        const currentIndex = `(1.${sectionCounter})`;
        const vehFields = [
            { label: "DD Veh. BA No.", value: v.baNo },
            { label: "Make & Take", value: v.makeAndTake }
        ];
        if (hasAnyContent(v, ['baNo', 'makeAndTake'])) {
            blocks.push({
                index: currentIndex,
                fields: vehFields
            });
        }
        sectionCounter++;
    }

    return blocks;
}

function createDynamicInfoTable(
    allItems: Array<{ label: string; value: string }>
) {
    const validItems = allItems.filter(item => hasContent(item.value));
    const rowsOfItems = chunkArray(validItems, 2);

    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        borders: TableBordersNone(),
        rows: rowsOfItems.map(
            (rowItems) =>
                new TableRow({
                    children: [
                        ...rowItems.flatMap((item) => [
                            new TableCell({
                                width: { size: 25, type: WidthType.PERCENTAGE },
                                margins: CELL_PADDING,
                                borders: TableBordersNone(),
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
                            new TableCell({
                                width: { size: 25, type: WidthType.PERCENTAGE },
                                margins: CELL_PADDING,
                                borders: TableBordersNone(),
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
                        ...(rowItems.length === 1
                            ? [
                                new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: TableBordersNone(), children: [] }),
                                new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: TableBordersNone(), children: [] }),
                            ]
                            : []),
                    ],
                })
        ),
    });
}


export const generateWordReport = async (data: MilitaryPoliceReportProps) => {

    // Normalize Data Blocks
    const particularBlocks = normalizeParticulars(data.particulars);
    const showSection1 = particularBlocks.length > 0;

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
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({ text: "In Lieu Of IAFP-1479", size: 24 }),
                        ],
                        spacing: { after: 200 },
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "MILITARY POLICE REPORT", bold: true, size: 24 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "(GEN AND TRAFFIC OFFENCE)", bold: true, size: 24 })],
                        spacing: { after: 300 },
                    }),

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

                    // SECTION 1 - Dynamic
                    ...(showSection1 ? [
                        sectionHeading("1.", "PARTICULARS:"),

                        ...particularBlocks.map((block, index) => {
                            const isLast = index === particularBlocks.length - 1;
                            return [
                                createGenericBlockTable(block),
                                !isLast ? spacer(100) : new Paragraph({}) // Spacer between blocks
                            ];
                        }).flat(), // Flatten because map returns arrays of arrays

                        spacer(),
                    ] : []),


                    sectionHeading("2.", "STATEMENT OF EVIDENCE/OCCURRENCE:"),

                    createEvidenceGrid(data.occurrence),

                    spacer(100),

                    ...(hasContent(data.occurrence.statement) ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "(2.4)   ", bold: true, size: 24 }),
                                new TextRun({ text: data.occurrence.statement, size: 24 }),
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 200 }
                        })
                    ] : []),

                    spacer(),

                    ...((hasArrayContent(data.offence.types) || hasArrayContent(data.offence.refs) || hasContent(data.offence.description)) ? [
                        sectionHeading("3.", "OFFENCE COMMITTED/ORDERS CONTRAVENED:"),

                        ...((hasArrayContent(data.offence.types) || hasArrayContent(data.offence.refs)) ? [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "(3.1) ", size: 24 }),
                                    ...(hasArrayContent(data.offence.types) ? [
                                        new TextRun({ text: "Offence Type  ", bold: true, size: 24 }),
                                        new TextRun({ text: (data.offence.types || []).filter(Boolean).join(", "), size: 24 })
                                    ] : [])
                                ],
                                spacing: { after: 50 },
                            }),

                            ...(data.offence.refs && data.offence.refs.length > 0 ?
                                data.offence.refs.map((ref, index) => {
                                    const roman = ["i", "ii", "iii", "iv", "v"][index] || (index + 1).toString();
                                    return new Paragraph({
                                        children: [
                                            // Make sure ref format matches: (i.)
                                            new TextRun({ text: `       Ref :- (${roman}.) `, bold: true, size: 24 }),
                                            new TextRun({ text: ref, size: 24 }),
                                        ],
                                        spacing: { after: 50 },
                                    });
                                })
                                : [])
                        ] : []),

                        ...(hasContent(data.offence.description) ? [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "(3.2) ", size: 24 }),
                                    new TextRun({ text: data.offence.description, size: 24 }),
                                ],
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: { before: 100, after: 200 }
                            })
                        ] : [])

                    ] : []),

                    spacer(),

                    createSignatureSection(data.witnessSig, data.mpSig),

                    spacer(),

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

                    ...(hasContent(data.remarks.text) ? [
                        new Paragraph({
                            children: [new TextRun({ text: data.remarks.text, size: 24 })],
                            alignment: AlignmentType.JUSTIFIED,
                            indent: { firstLine: 720 },
                        })
                    ] : []),

                    spacer(100),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: TableBordersNone(),
                        rows: [
                            new TableRow({ children: [footerCell("Station : " + data.remarks.station)] }),
                            new TableRow({ children: [footerCell("Dated : " + data.remarks.dated)] }),
                        ]
                    }),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const docBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    saveAs(docBlob, `Report_${data.reportNo || "Draft"}.docx`);
};

/* ===============================
   HELPERS
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
            new TextRun({ text: "     ", size: 24 }),
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
function footerCell(text: string) {
    return new TableCell({
        margins: CELL_PADDING,
        children: [new Paragraph({ children: [new TextRun({ text: text, bold: true, size: 24 })] })],
        borders: TableBordersNone(),
    });
}

// Replaced specific helpers with a generic one
function createGenericBlockTable(block: NormalizedBlock) {
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
        rows: [
            new TableRow({
                children: [
                    boxIndexCell(block.index),
                    boxContentCell(
                        createDynamicInfoTable(block.fields)
                    ),
                ],
            })
        ],
    });
}

function boxIndexCell(text: string) {
    return new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
        margins: CELL_PADDING,
        children: [new Paragraph({ children: [new TextRun({ text: text, size: 24 })] })],
    });
}

function boxContentCell(content: any) {
    return new TableCell({
        width: { size: 92, type: WidthType.PERCENTAGE },
        margins: CELL_PADDING,
        children: [content],
    });
}

function createEvidenceGrid(occurrence: any) {
    const rows: TableRow[] = [];

    // Row 1: (2.1) Date, Duty Time, Duty Location
    const fields21 = [
        { label: "Date of Duty", value: occurrence.dateOfDuty },
        { label: "Duty Time", value: occurrence.dutyTime },
        { label: "Duty Location", value: occurrence.dutyLocation },
    ];

    rows.push(
        new TableRow({
            children: [
                boxIndexCell("2.1"),
                boxContentCell(
                    createDynamicInfoTable(fields21)
                )
            ]
        })
    );

    // Row 2: (2.2) Witnesses
    if (occurrence.witnessingMps && occurrence.witnessingMps.length > 0) {
        occurrence.witnessingMps.forEach((mp: any, index: number) => {
            const label = index === 0 ? "2.2" : `2.2.${index}`;

            const witnessTable = new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: TableBordersNone(),
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                margins: CELL_PADDING,
                                borders: TableBordersNone(),
                                children: [new Paragraph({ children: [new TextRun({ text: "Name of MP Witnessing", bold: true, size: 24 })] })]
                            }),
                            new TableCell({
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                margins: CELL_PADDING,
                                borders: TableBordersNone(),
                                children: [new Paragraph({ children: [new TextRun({ text: mp.name || "", size: 24 })] })]
                            }),
                            new TableCell({
                                width: { size: 15, type: WidthType.PERCENTAGE },
                                margins: CELL_PADDING,
                                borders: TableBordersNone(),
                                children: [new Paragraph({ children: [new TextRun({ text: "Rank", bold: true, size: 24 })] })]
                            }),
                            new TableCell({
                                width: { size: 25, type: WidthType.PERCENTAGE },
                                margins: CELL_PADDING,
                                borders: TableBordersNone(),
                                children: [new Paragraph({ children: [new TextRun({ text: mp.rank || "", size: 24 })] })]
                            }),
                        ]
                    })
                ]
            });

            rows.push(
                new TableRow({
                    children: [
                        boxIndexCell(label),
                        boxContentCell(witnessTable)
                    ]
                })
            );
        });
    } else {
        // Optional: Hide if empty or show N/A. React hides. Let's hide here too if requested? 
        // Logic should match React. React hides entirely if array exists but empty? 
        // Current code hides if empty.
    }

    // Row 3: (2.3) Time/Location of Offence
    if (hasContent(occurrence.timeOfOffence) || hasContent(occurrence.locationOfOffence)) {
        const fields23 = [
            { label: "Time of Offence", value: occurrence.timeOfOffence },
            { label: "Location of Offence", value: occurrence.locationOfOffence }
        ];

        rows.push(
            new TableRow({
                children: [
                    boxIndexCell("2.3"),
                    boxContentCell(
                        createDynamicInfoTable(fields23)
                    )
                ]
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
        rows: rows,
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
                                children: [new TextRun({ text: "Sig of Witness", bold: true, size: 24 })],
                                spacing: { after: 0 },
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: "______________________", size: 24 })],
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
                                alignment: AlignmentType.RIGHT,
                                spacing: { after: 300 },
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
            signatureSimpleRow("Army No.", sig.armyNo),
            signatureSimpleRow("Rank", sig.rank),
            signatureSimpleRow("Name", sig.name),
            signatureSimpleRow("Unit", sig.unit),
        ],
    });
}

function signatureSimpleRow(label: string, value: string) {
    return new TableRow({
        children: [
            new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                borders: TableBordersNone(),
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: label, bold: true, size: 24 })],
                    })
                ]
            }),
            new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                borders: TableBordersNone(),
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: value || "", size: 24 })],
                    })
                ]
            })
        ]
    });
}
