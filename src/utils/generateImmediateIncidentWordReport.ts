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
} from "docx";
import { saveAs } from "file-saver";
import { ImmediateReportingIncident } from '@/apis/immediateReportingIncident/types';
import { format } from 'date-fns';

export const generateImmediateIncidentWordReport = async (data: ImmediateReportingIncident) => {
    const doc = new Document({
        creator: "Army App",
        title: "Immediate Reporting Incident Report",
        description: "Generated Incident Report",
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 24, // 12pt
                        color: "000000",
                    },
                },
            },
        },
        sections: [
            {
                children: [
                    /* Header: Appx 'A' */
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({ text: "Appx 'A'", size: 24 }),
                        ],
                        spacing: { after: 300 },
                    }),

                    /* Title */
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "IMMEDIATE REPORTING OF INCIDENT : ", bold: true, size: 24 }),
                            new TextRun({ text: "(Type of incident like injury to serving soldier due to RTA etc)", size: 24 }),
                        ],
                        spacing: { after: 400 },
                    }),

                    /* Individuals Loop */
                    ...(data.individuals || []).flatMap((ind, index) => {
                        const baseIndex = index * 5;
                        return [
                            /* Divider for subsequent individuals */
                            ...(index > 0 ? [
                                new Paragraph({
                                    border: { top: { style: BorderStyle.SINGLE, space: 10, color: "CCCCCC" } },
                                    spacing: { before: 200, after: 200 },
                                    text: "",
                                })
                            ] : []),

                            /* Individual Heading */
                            // new Paragraph({
                            //     children: [
                            //         new TextRun({ text: `Individual ${index + 1}`, bold: true, underline: {}, size: 24 }),
                            //     ],
                            //     spacing: { before: 200, after: 200 },
                            // }),

                            /* Data Rows as Tables */
                            createRowTable(baseIndex + 1, "Army No. Rk, Name", `${ind.armyNo || "-"}, ${ind.rank || "-"}, ${ind.name || "-"}`),
                            createRowTable(baseIndex + 2, "Age / Service", `${ind.age || "-"} Yrs / ${ind.totalServiceDuration || "-"} Yrs`),
                            createRowTable(baseIndex + 3, "Unit & Loc of Unit", `${ind.unit || "-"}, ${ind.unitLocation || "-"}`),
                            createRowTable(baseIndex + 4, "Fmn", ind.fmn),
                            createRowTable(baseIndex + 5, "Whether not on lve/ duty", ind.individualWorkingStatus),
                        ];
                    }),

                    /* Common Details */
                    new Paragraph({ spacing: { before: 200 } }), // Spacer

                    createRowTable((data.individuals?.length || 0) * 5 + 1, "Place of incident", data.incidentPlace || "-"),

                    createRowTable(
                        (data.individuals?.length || 0) * 5 + 2,
                        "Dt & Time of incident",
                        `${data.incidentDate ? format(new Date(data.incidentDate), "dd MMM yyyy") : "-"} approx ${data.incidentTime || "-"} hrs`
                    ),

                    createRowTable(
                        (data.individuals?.length || 0) * 5 + 3,
                        "Brief of the incident",
                        data.incidentBrief || "-",
                    ),

                    createRowTable(
                        (data.individuals?.length || 0) * 5 + 4,
                        "Coord with Police on civ Adm, FIR & current sit",
                        data.coordinationWithPolice || "-",
                    ),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const docBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    saveAs(docBlob, `Incident_Report_${data.individuals?.[0]?.name || "Draft"}.docx`);
};

/* Helper Functions */
function createRowTable(number: number, label: string, value: string) {
    const spacing = { before: 80, after: 80 }; // before/after

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
        rows: [
            new TableRow({
                children: [
                    // Col 1: Number (e.g., "1.")
                    new TableCell({
                        width: { size: 5, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({
                            children: [new TextRun({ text: `${number}.`, bold: true, size: 24 })],
                            spacing
                        })],
                    }),
                    // Col 2: Label
                    new TableCell({
                        width: { size: 30, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({
                            children: [new TextRun({ text: label, bold: true, size: 24 })],
                            spacing
                        })],
                    }),
                    // Col 3: Colon
                    new TableCell({
                        width: { size: 2, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({
                            children: [new TextRun({ text: ":", bold: true, size: 24 })],
                            spacing
                        })],
                    }),
                    // Col 4: Value
                    new TableCell({
                        width: { size: 63, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({
                            children: [new TextRun({ text: value || "-", size: 24 })],
                            spacing
                        })],
                    }),
                ],
            }),
        ],
    });
}
