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
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
import { format } from "date-fns";

export const generateImmediateIncidentWordReport = async (
    data: ImmediateReportingIncident,
) => {
    const individuals = data.individuals || [];

    let nextSrNo = 2;
    const srNoAge = (data.age || data.totalServiceDuration) ? nextSrNo++ : null;
    const srNoStatus = data.individualWorkingStatus ? nextSrNo++ : null;
    const srNoPlace = data.placeOfOccurrence ? nextSrNo++ : null;
    const srNoTime = data.dateOfOccurrence ? nextSrNo++ : null;
    const srNoBrief = data.description ? nextSrNo++ : null;
    const srNoCoord = data.coordWith ? nextSrNo++ : null;


    const docSections = [];

    // Header Styles
    const headerStyle = { font: "Arial", size: 24, bold: true };
    const labelStyle = { font: "Arial", size: 20, bold: true }; // 10pt
    const valueStyle = { font: "Arial", size: 20, bold: false }; // 10pt

    // Helper to create a grid row (Label1 : Val1 | Label2 : Val2)
    const createGridRow = (
        l1: string,
        v1: string | undefined,
        l2?: string,
        v2?: string | undefined,
    ) => {
        const cells = [
            // Pair 1
            new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: l1, ...labelStyle })],
                    }),
                ],
                verticalAlign: "center",
                margins: { top: 60, bottom: 60, left: 60, right: 60 },
                borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                },
            }),
            new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: v1 || "-", ...valueStyle }),
                        ],
                    }),
                ],
                verticalAlign: "center",
                margins: { top: 60, bottom: 60, left: 60, right: 60 },
                borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                },
            }),
        ];

        if (l2) {
            cells.push(
                // Pair 2
                new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: l2, ...labelStyle }),
                            ],
                        }),
                    ],
                    verticalAlign: "center",
                    margins: { top: 60, bottom: 60, left: 60, right: 60 },
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                    },
                }),
                new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: v2 || "-", ...valueStyle }),
                            ],
                        }),
                    ],
                    verticalAlign: "center",
                    margins: { top: 60, bottom: 60, left: 60, right: 60 },
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                    },
                }),
            );
        } else {
            // Fill empty cells to maintain structure if needed, or span?
            // easier to just add empty cells
            cells.push(
                new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [],
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                    },
                }),
                new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    children: [],
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                    },
                }),
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
    const createSubItemBox = (
        number: string,
        contentRows: TableRow[],
        nestedBlock?: { number: string; rows: TableRow[] },
    ) => {
        const rows = [
            new TableRow({
                children: [
                    // Col 1: Number (1.1)
                    new TableCell({
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: number,
                                        size: 20,
                                        color: "666666",
                                    }),
                                ], // Grayish
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 120 },
                            }),
                        ],
                        verticalAlign: "top",
                        borders: { right: { style: BorderStyle.NONE } },
                    }),
                    // Col 2: Content
                    new TableCell({
                        width: { size: 92, type: WidthType.PERCENTAGE },
                        children: [createGridTable(contentRows)],
                        margins: { top: 0, bottom: 0, left: 100, right: 0 },
                    }),
                ],
            }),
        ];

        // Add nested block if present (e.g. 1.2.1)
        if (nestedBlock) {
            rows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            children: [], // Empty left
                            width: { size: 8, type: WidthType.PERCENTAGE },
                            borders: {
                                right: { style: BorderStyle.NONE },
                                bottom: { style: BorderStyle.NONE },
                            },
                        }),
                        new TableCell({
                            width: { size: 92, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({
                                    border: {
                                        top: {
                                            style: BorderStyle.SINGLE,
                                            color: "EEEEEE",
                                            space: 1,
                                        },
                                    },
                                    spacing: { after: 100 },
                                }), // Separator line
                                new Table({
                                    width: {
                                        size: 100,
                                        type: WidthType.PERCENTAGE,
                                    },
                                    borders: {
                                        top: { style: BorderStyle.NONE },
                                        bottom: { style: BorderStyle.NONE },
                                        left: { style: BorderStyle.NONE },
                                        right: { style: BorderStyle.NONE },
                                        insideHorizontal: {
                                            style: BorderStyle.NONE,
                                        },
                                        insideVertical: {
                                            style: BorderStyle.NONE,
                                        },
                                    },
                                    rows: [
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    width: {
                                                        size: 10,
                                                        type: WidthType.PERCENTAGE,
                                                    },
                                                    children: [
                                                        new Paragraph({
                                                            children: [
                                                                new TextRun({
                                                                    text: nestedBlock.number,
                                                                    size: 20,
                                                                    color: "666666",
                                                                }),
                                                            ],
                                                            alignment:
                                                                AlignmentType.LEFT,
                                                        }),
                                                    ],
                                                }),
                                                new TableCell({
                                                    width: {
                                                        size: 90,
                                                        type: WidthType.PERCENTAGE,
                                                    },
                                                    children: [
                                                        createGridTable(
                                                            nestedBlock.rows,
                                                        ),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            );
        }

        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                bottom: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                left: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                right: { style: BorderStyle.SINGLE, color: "DDDDDD" },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }, // No vertical line between number and content
            },
            rows: rows,
            margins: { bottom: 200 }, // Spacing after box
        });
    };

    const children = [];

    // Header : Appx 'A'
    children.push(
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "Appx 'A'", ...headerStyle })],
            spacing: { after: 300 },
        }),
    );

    // Title
    if (data.reportHeading) {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: data.reportHeading,
                        ...headerStyle,
                    }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: "(Type of Incident like Injury to serving soldier due to RTA etc)",
                        size: 20,
                    }),
                ],
                spacing: { after: 400 },
            }),
        );
    } else {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: "IMMEDIATE REPORTING OF INCIDENT",
                        ...headerStyle,
                    }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: "(Type of Incident like Injury to serving soldier due to RTA etc)",
                        size: 20,
                    }),
                ],
                spacing: { after: 400 },
            }),
        );
    }

    // 1. Particulars
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "1.\tParticulars of Offender / Victim & Vehicle Details :",
                    ...headerStyle,
                }),
            ],
            tabStops: [{ type: "left", position: 500 }],
            spacing: { after: 200 },
        }),
    );

    let subIndex = 1;

    // 1.1 Vehicle Box
    if (data.vehicleNumber || data.vehicleName || data.vehicleType) {
        const rows = [
            createGridRow(
                "DD Veh. BA No.",
                data.vehicleNumber,
                "Make & Take",
                data.vehicleName,
            ),
        ];
        children.push(createSubItemBox(`(1.${subIndex})`, rows));
        children.push(new Paragraph({ spacing: { after: 200 } }));
        subIndex++;
    }

    // 1.x Individuals
    individuals.forEach((ind, idx) => {
        const details = {
            ...(ind.individualDetails || {}),
            ...(ind.offenderDetails || {}),
        };
        let type = ind.individualType;
        if (!type) {
            if (details.employeeServiceNumber) type = "employee";
            else if (details.maidPassNumber) type = "servantMaid";
            else if (details.shopOwnerName) type = "shopKeeper";
            else if (details.tempWorkerName) type = "tempHiredWorker";
            else if (
                details.civilianName ||
                details.civilianAadharCardNumber
            )
                type = "civilian";
            else type = "militaryPersonnel";
        }

        const num = (data.vehicleNumber || data.vehicleName) ? idx + 2 : idx + 1;

        // Collect fields
        const fields: { label: string; value: any }[] = [];

        if (type === "militaryPersonnel") {
            if (details.militaryPersonnelArmyNo) fields.push({ label: "Army No.", value: details.militaryPersonnelArmyNo });
            if (details.militaryPersonnelRank) fields.push({ label: "Rank", value: details.militaryPersonnelRank });
            if (details.militaryPersonnelName) fields.push({ label: "Name", value: details.militaryPersonnelName });
            if (details.militaryPersonnelUnit) fields.push({ label: "Unit", value: details.militaryPersonnelUnit });
            if (details.militaryPersonnelFmn) fields.push({ label: "FMN", value: details.militaryPersonnelFmn });
            if (details.militaryPersonnelCommand) fields.push({ label: "Command", value: details.militaryPersonnelCommand });
            if (details.militaryPersonnelAddress) fields.push({ label: "Address", value: details.militaryPersonnelAddress });
            if (details.militaryPersonnelICardNumber) fields.push({ label: "I Card No.", value: details.militaryPersonnelICardNumber });
        } else if (type === "employee") {
            if (details.employeeServiceNumber) fields.push({ label: "Service No.", value: details.employeeServiceNumber });
            if (details.employeeRank) fields.push({ label: "Rank", value: details.employeeRank });
            if (details.employeeName) fields.push({ label: "Name", value: details.employeeName });
            if (details.employeeUnit) fields.push({ label: "Unit", value: details.employeeUnit });
            if (details.employeeFmn) fields.push({ label: "FMN", value: details.employeeFmn });
            if (details.employeeCommand) fields.push({ label: "Command", value: details.employeeCommand });
            if (details.employeeICardNumber) fields.push({ label: "I Card No.", value: details.employeeICardNumber });
        } else if (type === "servantMaid") {
            if (details.maidPassNumber) fields.push({ label: "Pass No", value: details.maidPassNumber });
            if (details.maidName) fields.push({ label: "Name", value: details.maidName });
            if (details.maidFathersName) fields.push({ label: "S/O", value: details.maidFathersName });
            if (details.maidTrade) fields.push({ label: "Trade", value: details.maidTrade });
            if (details.maidQuarterNumber) fields.push({ label: "Quarter No", value: details.maidQuarterNumber });
            if (details.officersEnclaveRank) fields.push({ label: "C/O Rank", value: details.officersEnclaveRank });
            if (details.officersEnclaveName) fields.push({ label: "C/O Name", value: details.officersEnclaveName });
            if (details.officersEnclaveUnit) fields.push({ label: "C/O Unit", value: details.officersEnclaveUnit });
        } else if (type === "shopKeeper") {
            if (details.shopOwnerName) fields.push({ label: "Shop Owner", value: details.shopOwnerName });
            if (details.shopName) fields.push({ label: "Shop Name", value: details.shopName });
            if (details.shopAddress) fields.push({ label: "Address", value: details.shopAddress });
            if (details.shopUnit) fields.push({ label: "Unit", value: details.shopUnit });
            if (details.shopPassNo) fields.push({ label: "Pass No", value: details.shopPassNo });
        } else if (type === "tempHiredWorker") {
            if (details.tempWorkerName) fields.push({ label: "Name", value: details.tempWorkerName });
            if (details.tempWorkerPassNo) fields.push({ label: "Pass No", value: details.tempWorkerPassNo });
            if (details.tempWorkerPlaceOfStay) fields.push({ label: "Place of Stay", value: details.tempWorkerPlaceOfStay });
            if (details.tempWorkerPlaceOfWork) fields.push({ label: "Place of Work", value: details.tempWorkerPlaceOfWork });
            if (details.tempWorkerTypeOfWork) fields.push({ label: "Type of Work", value: details.tempWorkerTypeOfWork });
        } else if (type === "civilian") {
            if (details.civilianName) fields.push({ label: "Name", value: details.civilianName });
            if (details.civilianAadharCardNumber) fields.push({ label: "Aadhar Card No.", value: details.civilianAadharCardNumber });
            if (details.civilianFathersName) fields.push({ label: "S/O", value: details.civilianFathersName });
            if (details.civilianAddress) fields.push({ label: "Address", value: details.civilianAddress });
            if (details.relationName) fields.push({ label: "Name the Relation", value: details.relationName });
        }

        // Chunk into pairs
        const contentRows: TableRow[] = [];
        for (let i = 0; i < fields.length; i += 2) {
            const f1 = fields[i];
            const f2 = fields[i + 1];
            contentRows.push(createGridRow(f1.label, f1.value, f2?.label, f2?.value));
        }

        // Nested Relative
        let nestedBlock: { number: string; rows: TableRow[] } | undefined = undefined;
        if (type === "civilian" && details.relativeDetails && Object.keys(details.relativeDetails).length > 0) {
            const relFields: { label: string; value: any }[] = [];
            const rel = details.relativeDetails;
            const relCategory = details.relativeCategory;

            if (relCategory === "militaryPersonnel") {
                if (rel.militaryPersonnelArmyNo) relFields.push({ label: "Army No.", value: rel.militaryPersonnelArmyNo });
                if (rel.militaryPersonnelRank) relFields.push({ label: "Rank", value: rel.militaryPersonnelRank });
                if (rel.militaryPersonnelName) relFields.push({ label: "Name", value: rel.militaryPersonnelName });
                if (rel.militaryPersonnelUnit) relFields.push({ label: "Unit", value: rel.militaryPersonnelUnit });
                if (rel.militaryPersonnelFmn) relFields.push({ label: "FMN", value: rel.militaryPersonnelFmn });
                if (rel.militaryPersonnelCommand) relFields.push({ label: "Command", value: rel.militaryPersonnelCommand });
                if (rel.militaryPersonnelAddress) relFields.push({ label: "Address", value: rel.militaryPersonnelAddress });
                if (rel.militaryPersonnelICardNumber) relFields.push({ label: "I Card No.", value: rel.militaryPersonnelICardNumber });
            } else if (relCategory === "employee") {
                if (rel.employeeServiceNo) relFields.push({ label: "Service No.", value: rel.employeeServiceNo });
                if (rel.employeeRank) relFields.push({ label: "Rank", value: rel.employeeRank });
                if (rel.employeeName) relFields.push({ label: "Name", value: rel.employeeName });
                if (rel.employeeUnit) relFields.push({ label: "Unit", value: rel.employeeUnit });
                if (rel.employeeFmn) relFields.push({ label: "FMN", value: rel.employeeFmn });
                if (rel.employeeCommand) relFields.push({ label: "Command", value: rel.employeeCommand });
                if (rel.employeeAddress) relFields.push({ label: "Address", value: rel.employeeAddress });
                if (rel.employeeICardNumber) relFields.push({ label: "I Card No.", value: rel.employeeICardNumber });
            } else if (relCategory === "servantMaid") {
                if (rel.maidPassNumber) relFields.push({ label: "Pass No", value: rel.maidPassNumber });
                if (rel.maidName) relFields.push({ label: "Name", value: rel.maidName });
                if (rel.maidFathersName) relFields.push({ label: "S/O", value: rel.maidFathersName });
                if (rel.maidTrade) relFields.push({ label: "Trade", value: rel.maidTrade });
                if (rel.maidQuarterNumber) relFields.push({ label: "Quarter No", value: rel.maidQuarterNumber });
                if (rel.officersEnclaveRank) relFields.push({ label: "C/O Rank", value: rel.officersEnclaveRank });
                if (rel.officersEnclaveName) relFields.push({ label: "C/O Name", value: rel.officersEnclaveName });
                if (rel.officersEnclaveUnit) relFields.push({ label: "C/O Unit", value: rel.officersEnclaveUnit });
            } else if (relCategory === "tempHiredWorker") {
                if (rel.tempWorkerName) relFields.push({ label: "Name", value: rel.tempWorkerName });
                if (rel.tempWorkerPassNo) relFields.push({ label: "Pass No", value: rel.tempWorkerPassNo });
                if (rel.tempWorkerPlaceOfStay) relFields.push({ label: "Place of Stay", value: rel.tempWorkerPlaceOfStay });
                if (rel.tempWorkerPlaceOfWork) relFields.push({ label: "Place of Work", value: rel.tempWorkerPlaceOfWork });
                if (details.tempWorkerTypeOfWork) relFields.push({ label: "Type of Work", value: details.tempWorkerTypeOfWork });
            } else if (relCategory === "shopKeeper") {
                if (rel.shopOwnerName) relFields.push({ label: "Shop Owner", value: rel.shopOwnerName });
                if (rel.shopName) relFields.push({ label: "Shop Name", value: rel.shopName });
                if (rel.shopAddress) relFields.push({ label: "Address", value: rel.shopAddress });
                if (rel.shopUnit) relFields.push({ label: "Unit", value: rel.shopUnit });
                if (rel.shopPassNo) relFields.push({ label: "Pass No", value: rel.shopPassNo });
            }

            const relRows: TableRow[] = [];
            for (let i = 0; i < relFields.length; i += 2) {
                const f1 = relFields[i];
                const f2 = relFields[i + 1];
                relRows.push(createGridRow(f1.label, f1.value, f2?.label, f2?.value));
            }

            nestedBlock = {
                number: `(1.${num}.1)`,
                rows: relRows,
            };
        }

        children.push(createSubItemBox(`(1.${num})`, contentRows, nestedBlock));
        children.push(new Paragraph({ spacing: { after: 200 } }));
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
                insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 5, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: num + ".",
                                            ...labelStyle,
                                        }),
                                    ],
                                }),
                            ],
                            verticalAlign: "top",
                        }),
                        new TableCell({
                            width: { size: 30, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: label,
                                            ...labelStyle,
                                        }),
                                    ],
                                }),
                            ],
                            verticalAlign: "top",
                        }),
                        new TableCell({
                            width: { size: 65, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: value || "-",
                                            ...valueStyle,
                                        }),
                                    ],
                                }),
                            ],
                            verticalAlign: "top",
                        }),
                    ],
                }),
            ],
        });
    };

    // 2. Age / Service
    if (srNoAge) {
        children.push(
            createMainSection(
                srNoAge.toString(),
                "Age / Service",
                `${data.age || "-"} Yrs / ${data.totalServiceDuration || "-"} Yrs`,
            ),
        );
        children.push(new Paragraph({ spacing: { after: 100 } }));
    }

    // 3. Leave/Duty
    if (srNoStatus) {
        children.push(
            createMainSection(
                srNoStatus.toString(),
                "Whether Individual On Leave / Duty",
                data.individualWorkingStatus || "-",
            ),
        );
        children.push(new Paragraph({ spacing: { after: 100 } }));
    }

    // 4. Place
    if (srNoPlace) {
        children.push(
            createMainSection(
                srNoPlace.toString(),
                "Place Of Incident",
                data.placeOfOccurrence || "-",
            ),
        );
        children.push(new Paragraph({ spacing: { after: 100 } }));
    }

    // 5. Date
    if (srNoTime) {
        const dateStr = data.dateOfOccurrence
            ? format(new Date(data.dateOfOccurrence), "dd/MM/yyyy")
            : "-";
        children.push(
            createMainSection(
                srNoTime.toString(),
                "Date & Time Of Incident",
                `${dateStr} & ${data.timeOfOccurrence || "-"}hrs`,
            ),
        );
        children.push(new Paragraph({ spacing: { after: 100 } }));
    }

    // 6. Brief
    if (srNoBrief) {
        children.push(
            createMainSection(
                srNoBrief.toString(),
                "Brief Of The Incident",
                data.description || "-",
            ),
        );
        children.push(new Paragraph({ spacing: { after: 100 } }));
    }

    // 7. Coord
    if (srNoCoord) {
        children.push(
            createMainSection(
                srNoCoord.toString(),
                "Coord With Police On Civil, Adm,\nFIR & Current Sit",
                data.coordWith || "-",
            ),
        );
        children.push(new Paragraph({ spacing: { after: 400 } }));
    }

    // Footer
    if (data.incidentCoveredBy) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: "(Incident being covered by ", size: 20 }),
                    new TextRun({
                        text: `       ${data.incidentCoveredBy}       `,
                        underline: {},
                        size: 20,
                    }),
                    new TextRun({ text: " Pro Unit)", size: 20 }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 800 },
            }),
        );
    }

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
                        },
                    },
                },
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const docBlob = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(
        docBlob,
        `Incident_Report_${individuals?.[0]?.individualDetails?.name || individuals?.[0]?.individualDetails?.militaryPersonnelName || "Draft"}.docx`,
    );
};
