import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    WidthType,
    Table,
    TableRow,
    TableCell,
    BorderStyle,
    HeightRule,
} from "docx";
import { saveAs } from "file-saver";
import { ImmediateReportingIncident } from '@/apis/immediateReportingIncident/types';
import { format } from 'date-fns';

export const generateImmediateIncidentWordReport = async (data: ImmediateReportingIncident) => {
    const individuals = data.individuals || [];

    const getDetails = (ind: any) => {
        return { ...(ind.individualDetails || {}), ...(ind.offenderDetails || {}) };
    };

    const docSections = [];

    // Header Styles
    const headerStyle = { font: "Arial", size: 24, bold: true };
    const labelStyle = { font: "Arial", size: 20, bold: true }; // 10pt
    const valueStyle = { font: "Arial", size: 20, bold: false }; // 10pt

    // Helper to create a grid row (Label1 : Val1 | Label2 : Val2)
    const createGridRow = (
        l1: string, v1: string | undefined,
        l2?: string, v2?: string | undefined
    ) => {
        const cells = [
            // Pair 1
            new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: l1, ...labelStyle })] })],
                verticalAlign: "center",
                margins: { top: 60, bottom: 60, left: 60, right: 60 },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
            }),
            new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: v1 || "-", ...valueStyle })] })],
                verticalAlign: "center",
                margins: { top: 60, bottom: 60, left: 60, right: 60 },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
            })
        ];

        if (l2) {
            cells.push(
                // Pair 2
                new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: l2, ...labelStyle })] })],
                    verticalAlign: "center",
                    margins: { top: 60, bottom: 60, left: 60, right: 60 },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                }),
                new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: v2 || "-", ...valueStyle })] })],
                    verticalAlign: "center",
                    margins: { top: 60, bottom: 60, left: 60, right: 60 },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                })
            );
        } else {
            // Fill empty cells to maintain structure if needed, or span? 
            // easier to just add empty cells
            cells.push(
                new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })
            );
        }

        return new TableRow({ children: cells });
    };

    const createGridTable = (rows: TableRow[]) => {
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
            },
            rows: rows,
        });
    };

    // --- Building Sub-Items (The boxes) ---
    const createSubItemBox = (number: string, contentRows: TableRow[], nestedBlock?: { number: string, rows: TableRow[] }) => {
        const rows = [
            new TableRow({
                children: [
                    // Col 1: Number (1.1)
                    new TableCell({
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({
                            children: [new TextRun({ text: number, size: 20, color: "666666" })], // Grayish
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 120 }
                        })],
                        verticalAlign: "top",
                        borders: { right: { style: BorderStyle.NONE } }
                    }),
                    // Col 2: Content
                    new TableCell({
                        width: { size: 92, type: WidthType.PERCENTAGE },
                        children: [createGridTable(contentRows)],
                        margins: { top: 0, bottom: 0, left: 100, right: 0 },
                    })
                ]
            })
        ];

        // Add nested block if present (e.g. 1.2.1)
        if (nestedBlock) {
            rows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            children: [], // Empty left
                            width: { size: 8, type: WidthType.PERCENTAGE },
                            borders: { right: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE } }
                        }),
                        new TableCell({
                            width: { size: 92, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ border: { top: { style: BorderStyle.SINGLE, color: "EEEEEE", space: 1 } }, spacing: { after: 100 } }), // Separator line
                                new Table({
                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
                                    rows: [
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    width: { size: 10, type: WidthType.PERCENTAGE },
                                                    children: [new Paragraph({ children: [new TextRun({ text: nestedBlock.number, size: 20, color: "666666" })], alignment: AlignmentType.LEFT })]
                                                }),
                                                new TableCell({
                                                    width: { size: 90, type: WidthType.PERCENTAGE },
                                                    children: [createGridTable(nestedBlock.rows)]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            )
        }

        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                bottom: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                left: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                right: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE } // No vertical line between number and content
            },
            rows: rows,
            margins: { bottom: 200 } // Spacing after box
        });
    };


    const children = [];

    // Header : Appx 'A'
    children.push(new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Appx 'A'", ...headerStyle })],
        spacing: { after: 300 },
    }));

    // Title
    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "IMMEDIATE REPORTING OF INCIDENT", ...headerStyle })],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "(Type of Incident like Injury to serving soldier due to RTA etc)", size: 20 })],
            spacing: { after: 400 },
        })
    );

    // 1. Particulars
    children.push(new Paragraph({
        children: [
            new TextRun({ text: "1.\tParticulars of Offender / Victim & Vehicle Details :", ...headerStyle })
        ],
        tabStops: [{ type: "left", position: 500 }],
        spacing: { after: 200 },
    }));

    let subIndex = 1;

    // 1.1 Vehicle Box
    if (data.vehicleNumber || data.vehicleName || data.vehicleType) {
        const rows = [
            createGridRow("DD Veh. BA No.", data.vehicleNumber, "Make & Take", data.vehicleName)
        ];
        children.push(createSubItemBox(`(1.${subIndex})`, rows));
        children.push(new Paragraph({ spacing: { after: 200 } }));
        subIndex++;
    }

    // 1.x Individuals
    individuals.forEach((ind) => {
        const details = getDetails(ind);
        let type = ind.individualType || "militaryPersonnel";

        // Main Rows
        const rows: TableRow[] = [];
        let nestedBlock: { number: string, rows: TableRow[] } | undefined = undefined;

        if (type === "militaryPersonnel") {
            rows.push(createGridRow("Army No.", details.armyNo || details.militaryPersonnelArmyNo, "Rank", details.rank || details.militaryPersonnelRank));
            rows.push(createGridRow("Name", details.name || details.militaryPersonnelName, "Unit", details.unit || details.militaryPersonnelUnit));
            rows.push(createGridRow("FMN", details.fmn || details.militaryPersonnelFmn, "Command", details.command || details.militaryPersonnelCommand));
            rows.push(createGridRow("Address", details.address || details.militaryPersonnelAddress, "I Card No.", details.iCardNumber || details.militaryPersonnelICardNumber));
        }
        else if (type === "civilian") {
            rows.push(createGridRow("Aadhar Card No.", details.civilianAadharCardNumber, "S/O", details.civilianFathersName));
            rows.push(createGridRow("Name", details.civilianName, "Name the Relation", details.relationName));
            // rows.push(createGridRow("Address", details.civilianAddress, undefined, undefined));

            if (details.relativeDetails && Object.keys(details.relativeDetails).length > 0) {
                const rel = details.relativeDetails;
                const relRows: TableRow[] = [];
                // Check relative type logic if needed, assuming military structure primarily based on image
                relRows.push(createGridRow("Army No.", rel.armyNo || rel.militaryPersonnelArmyNo, "Rank", rel.rank || rel.militaryPersonnelRank));
                relRows.push(createGridRow("Name", rel.name || rel.militaryPersonnelName, "Unit", rel.unit || rel.militaryPersonnelUnit));
                relRows.push(createGridRow("FMN", rel.fmn || rel.militaryPersonnelFmn, "Command", rel.command || rel.militaryPersonnelCommand));
                relRows.push(createGridRow("Address", rel.address || rel.militaryPersonnelAddress, "I Card No.", rel.iCardNumber || rel.militaryPersonnelICardNumber));

                nestedBlock = {
                    number: `(1.${subIndex}.1)`,
                    rows: relRows
                };
            }
        }
        else if (type === "employee") {
            rows.push(createGridRow("Service No.", details.employeeServiceNumber, "Rank", details.employeeRank));
            rows.push(createGridRow("Name", details.employeeName, "Unit", details.employeeUnit));
            rows.push(createGridRow("FMN", details.employeeFmn, "Command", details.employeeCommand));
            rows.push(createGridRow("I-Card No.", details.employeeICardNumber, undefined, undefined));
        }
        // Fallback for others
        else {
            // General mapping
            rows.push(createGridRow("Name", details.name || details.maidName || details.shopOwnerName || details.tempWorkerName, "ID/Pass", details.passNumber || details.maidPassNumber || details.shopPassNo || details.tempWorkerPassNo));
            rows.push(createGridRow("Unit", details.unit || details.officersEnclaveUnit || details.shopUnit, undefined, undefined));
        }

        children.push(createSubItemBox(`(1.${subIndex})`, rows, nestedBlock));
        children.push(new Paragraph({ spacing: { after: 200 } }));
        subIndex++;
    });

    // 2-9 Main Sections
    const createMainSection = (num: string, label: string, value: string) => {
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 5, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ children: [new TextRun({ text: num + ".", ...labelStyle })] })],
                            verticalAlign: "top",
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ children: [new TextRun({ text: label, ...labelStyle })] })],
                            verticalAlign: "top",
                        }),
                        new TableCell({
                            width: { size: 65, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ children: [new TextRun({ text: value || "-", ...valueStyle })] })],
                            verticalAlign: "top",
                        })
                    ]
                })
            ]
        });
    };

    // 2. Age / Service
    children.push(createMainSection("2", "Age / Service", `${data.age || individuals[0]?.age || "-"} Yrs / ${data.totalServiceDuration || individuals[0]?.totalServiceDuration || "-"} Yrs`));
    children.push(new Paragraph({ spacing: { after: 100 } }));

    // 4. FMN (As per image) - Try to get FMN from first individual or null
    // If we strictly follow the image provided, 3 is not there.
    children.push(createMainSection("4", "FMN", individuals[0]?.individualDetails?.fmn || individuals[0]?.individualDetails?.militaryPersonnelFmn || "-"));
    children.push(new Paragraph({ spacing: { after: 100 } }));

    // 5. Leave/Duty
    children.push(createMainSection("5", "Whether Individual On Leave / Duty", data.individualWorkingStatus || individuals[0]?.individualWorkingStatus || "-"));
    children.push(new Paragraph({ spacing: { after: 100 } }));

    // 6. Place
    children.push(createMainSection("6", "Place Of Incident", data.placeOfOccurrence || "-"));
    children.push(new Paragraph({ spacing: { after: 100 } }));

    // 7. Date
    const dateStr = data.dateOfOccurrence ? format(new Date(data.dateOfOccurrence), "dd/MM/yyyy") : "-";
    children.push(createMainSection("7", "Date & Time Of Incident", `${dateStr} & ${data.timeOfOccurrence || "-"}hrs`));
    children.push(new Paragraph({ spacing: { after: 100 } }));

    // 8. Brief
    children.push(createMainSection("8", "Brief Of The Incident", data.description || "-"));
    children.push(new Paragraph({ spacing: { after: 100 } }));

    // 9. Coord
    children.push(createMainSection("9", "Coord With Police On Civil, Adm,\nFIR & Current Sit", data.coordWith || "-"));
    children.push(new Paragraph({ spacing: { after: 400 } }));

    // Footer
    children.push(new Paragraph({
        children: [
            new TextRun({ text: "(Incident being covered by ", size: 20 }),
            new TextRun({ text: `       ${data.incidentCoveredBy || "________________"}       `, underline: {}, size: 20 }),
            new TextRun({ text: " Pro Unit)", size: 20 })
        ],
        alignment: AlignmentType.CENTER, // Image shows center-ish or rightish
        spacing: { before: 800 }
    }));


    const doc = new Document({
        creator: "Army App",
        title: "Immediate Reporting Incident Report",
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 20,
                        color: "000000",
                    },
                },
            },
        },
        sections: [
            {
                children: children as any,
                properties: {
                    page: {
                        margin: {
                            top: 1440, // 1 inch
                            bottom: 1440,
                            left: 1440,
                            right: 1440,
                        }
                    }
                }
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const docBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    saveAs(docBlob, `Incident_Report_${individuals?.[0]?.individualDetails?.name || individuals?.[0]?.individualDetails?.militaryPersonnelName || "Draft"}.docx`);
};
