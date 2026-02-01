import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  VerticalAlign,
  Header,
  Footer,
  PageNumber,
  NumberFormat
} from "docx";
import { saveAs } from "file-saver";
import { MpOccurrenceReportProps } from "@/components/reports/MpOccurrenceReport";

/* ===============================
   COMMON STYLING & HELPERS
================================ */

const CELL_PADDING = {
  top: 100,      // ~5px
  bottom: 100,   // ~5px
  left: 100,     // ~5px
  right: 100,
};

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

function TableBordersAll() {
  return {
    top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
    left: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
    right: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
    insideVertical: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
  };
}

const spacer = (after = 200) => new Paragraph({ text: "", spacing: { after } });

function sectionHeading(no: string, title: string, subText: string = "") {
  const runs = [
    new TextRun({ text: no, bold: true, size: 28 }),
    new TextRun({ text: "  ", size: 28 }),
    new TextRun({ text: title, bold: true, underline: {}, size: 28 }),
  ];
  if (subText) {
    runs.push(new TextRun({ text: " " + subText, size: 28 }));
  }
  return new Paragraph({
    children: runs,
    spacing: { after: 100 },
  });
}

function labelValueParagraph(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: label, bold: true, size: 28 }),
      new TextRun({ text: " " + value, size: 28 }),
    ],
    spacing: { after: 50 },
  });
}

/* ===============================
   MAIN GENERATOR
================================ */

export const generateMPOccurrenceWordReport = async (data: MpOccurrenceReportProps) => {

  // Helper to check if a person object has meaningful data
  const hasPersonData = (p: any) => {
    if (!p) return false;
    // Check standard fields
    const standardFields = [p.name, p.armyNo, p.rank, p.unitName, p.identityCard, p.remark, p.so, p.address, p.tele];
    if (standardFields.some(v => v && v.trim() !== "" && v !== "Nil" && v !== "--")) return true;
    // Check custom fields
    if (p.customFields) {
      if (Object.values(p.customFields).some((v: any) => v && v.trim() !== "")) return true;
    }
    return false;
  };

  // Filter lists upfront
  const validOccurrenceType = data.occurrence.types && data.occurrence.types.length > 0;
  const validOccurrenceData = validOccurrenceType || data.occurrence.place || data.occurrence.date || data.occurrence.time;

  const validPeople = data.people ? data.people.filter(hasPersonData) : [];
  const validWitnesses = data.witnesses ? data.witnesses.filter(hasPersonData) : [];
  const validDocuments = data.documents && data.documents.length > 0;

  // For Evidence: check if object exists and has at least one non-empty field, OR keep it if user wants "Nil" displayed for existing object.
  // User said "if data is not coming then remove it".
  // I will check if at least one field is truthy.
  const validEvidence = data.evidence && (data.evidence.eyeSketch || data.evidence.photos || data.evidence.videos);

  const validDetailed = data.detailedReport.statement && data.detailedReport.statement.trim() !== "";
  const validFindings = data.detailedReport.findings && data.detailedReport.findings.length > 0;
  const validOpinion = data.detailedReport.opinion && data.detailedReport.opinion.trim() !== "";
  const validRemarks = (data.remarks.analysis && data.remarks.analysis.trim() !== "") || (data.remarks.recommendation && data.remarks.recommendation.trim() !== "");

  const doc = new Document({
    creator: "Army App",
    title: "MP Occurrence Report",
    description: "Generated MP Occurrence & Investigation Report",
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 28, // 14pt requested
            characterSpacing: 10,
            color: "0A0A0A",
          },
        },
      },
    },
    sections: [
      // ==================== SECTION 1: PAGE 1 ====================
      {
        properties: {
          page: {
            margin: {
              top: 800,
              right: 700,
              bottom: 800,
              left: 700,
            },
          },
        },
        headers: {
          default: new Header({ // This header will apply to all pages in this section. Since it's only one page, it acts as the first page header.
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
                spacing: { after: 100 },
              }),
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "IAFP-1479 (Revised)", bold: true, underline: {}, size: 24 })],
            spacing: { after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "MP OCCURRENCE & INVESTIGATION REPORT", bold: true, underline: {}, size: 32 })],
            spacing: { after: 300 },
          }),

          // Header Grid (Report No, Command, FIR)
          createReportMetaGrid(data),
          spacer(300),

          // 1. MP DETAILS (Always show)
          createSectionBox("1", [
            { label: "Army no.", value: data.mpDetails?.armyNumber },
            { label: "Rank", value: data.mpDetails?.rank },
            { label: "Name", value: data.mpDetails?.name },
            { label: "Unit", value: data.mpDetails?.unit },
            { label: "FMN", value: data.mpDetails?.fmn },
            { label: "Command", value: data.mpDetails?.command },
          ]),
          new Paragraph({
            children: [new TextRun({ text: "(MP must caution witness and ensure presence of independent witness if possible)", size: 18, color: "666666" })], // reduced size note
            spacing: { after: 200 },
            indent: { left: 100 }
          }),

          // 2. OCCURRENCE DETAILS
          ...(validOccurrenceData ? [
            sectionHeading("2.", "OCCURRENCE DETAILS:"),
            createOccurrenceDetailsTable(data.occurrence),
            spacer(200)
          ] : []),

          // 3. DETAILS OF VICTIMS/OFFENDERS
          ...(validPeople.length > 0 ? [
            sectionHeading("3.", "DETAILS OF VICTIMS/OFFENDERS:", "(MP must verify personal particulars)"),
            ...createPeopleTable(validPeople, "3"),
            new Paragraph({
              children: [new TextRun({
                text: "(To be read out to the Offender(s) by the MP 'above recorded personal particulars have been given by me voluntarily and I certify and sign them as correct. If found otherwise. I am liable for disciplinary action under the Army Act')",
                size: 24, // Keep note smaller
                italics: false
              })],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 300 },
            }),
          ] : []),

          // 4. BRIEF OF OCCURRENCE
          ...(data.briefOfOccurrence && data.briefOfOccurrence.trim() !== "" ? [
            sectionHeading("4.", "BRIEF OF OCCURRENCE", "(Details on Reverse) offence:"),
            new Paragraph({
              children: [new TextRun({ text: data.briefOfOccurrence, size: 28 })],
              alignment: AlignmentType.JUSTIFIED,
              indent: { left: 720 }
            }),
          ] : []),
        ],
      },

      // ==================== SECTION 2: REPORT BODY (Pages 2+) ====================
      {
        properties: {
          page: {
            margin: {
              top: 800,
              right: 700,
              bottom: 800,
              left: 700,
            },
            pageNumbers: {
              start: 2,
              formatType: NumberFormat.DECIMAL,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "-", bold: true, size: 24 }),
                  new TextRun({ children: [PageNumber.CURRENT], bold: true, size: 24 }),
                  new TextRun({ text: "-", bold: true, size: 24 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
                spacing: { after: 300 }
              }),
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
              }),
            ],
          }),
        },
        children: [
          // 5. WITNESS
          ...(validWitnesses.length > 0 ? [
            sectionHeading("5.", "WITNESS:", "(Witness must record statement in own hand where possible)"),
            ...createPeopleTable(validWitnesses, "5"),
            spacer(),
          ] : []),

          // 6. EVIDENCE
          ...(validEvidence ? [
            createEvidenceGrid(data.evidence),
            spacer(),
          ] : []),

          // 7. DOCUMENTS ATTACHED
          ...(validDocuments ? [
            sectionHeading("7.", "DOCUMENTS ATTACHED"),
            ...createDocumentsList(data.documents),
            spacer(),
          ] : []),

          // 8. DETAILED OCCURRENCE REPORT (New Page)
          ...(validDetailed ? [
            new Paragraph({
              children: [
                new TextRun({ text: "8.", bold: true, size: 28 }),
                new TextRun({ text: "  ", size: 28 }),
                new TextRun({ text: "DETAILED OCCURRENCE REPORT", bold: true, underline: {}, size: 28 }),
              ],
              spacing: { after: 100 },
              pageBreakBefore: true,
            }),
            new Paragraph({ text: "Sir,", spacing: { after: 200 }, children: [new TextRun({ text: "Sir,", size: 28 })] }),
            ...createStatementParagraphs(data.detailedReport.statement, "8"),
          ] : []),

          // 9. POINTS FIND OUT DURING THE INVESTIGATION (New Page)
          ...(validFindings ? [
            new Paragraph({
              children: [
                new TextRun({ text: "9.", bold: true, size: 28 }),
                new TextRun({ text: "  ", size: 28 }),
                new TextRun({ text: "POINTS FIND OUT DURING THE INVESTIGATION", bold: true, underline: {}, size: 28 }),
              ],
              spacing: { after: 100 },
              pageBreakBefore: true,
            }),
            ...createPointsList(data.detailedReport.findings, "9"),
          ] : []),

          // 10. OPINION (New Page)
          ...(validOpinion ? [
            new Paragraph({
              children: [
                new TextRun({ text: "10.", bold: true, size: 28 }),
                new TextRun({ text: "  ", size: 28 }),
                new TextRun({ text: "OPINION:", bold: true, underline: {}, size: 28 }),
              ],
              spacing: { after: 100 },
              pageBreakBefore: true,
            }),
            ...createStatementParagraphs(data.detailedReport.opinion, "10"),

            spacer(400),
            // Signature Block (Page 5 usually)
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: TableBordersNone(),
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Dated : ", bold: true, size: 28 }),
                            new TextRun({ text: data.reportDate, size: 28 }),
                          ],
                        }),
                      ],
                      borders: TableBordersNone(),
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: "(Signature of MP JCO/NCO)", size: 28 }),
                          ],
                        }),
                      ],
                      borders: TableBordersNone(),
                    }),
                  ],
                }),
              ],
            }),
          ] : []),

          // 11. REMARKS CO/2IC PROVOST UNIT (New Page)
          ...(validRemarks ? [
            new Paragraph({
              children: [
                new TextRun({ text: "11.", bold: true, size: 24 }),
                new TextRun({ text: "  ", size: 24 }),
                new TextRun({ text: "REMARKS CO/2IC PROVOST UNIT", bold: true, underline: {}, size: 24 }),
              ],
              spacing: { after: 100 },
              pageBreakBefore: true,
            }),
            new Paragraph({
              children: [new TextRun({ text: "Check evidence gives analysis and recommendation and fill IAFD-901 if required", size: 24 })],
              spacing: { after: 300 },
              indent: { left: 720 }, // Indent
            }),

            // 11.1 ANALYSIS
            new Paragraph({
              children: [
                new TextRun({ text: "11.1", bold: true, size: 24 }),
                new TextRun({ text: "  ", size: 24 }),
                new TextRun({ text: "ANALYSIS-", bold: true, underline: {}, size: 24 }),
              ],
              spacing: { after: 100 },
            }),
            ...createStatementParagraphs(data.remarks.analysis, "11.1", 24),

            spacer(),

            // 11.2 RECOMMENDATION
            new Paragraph({
              children: [
                new TextRun({ text: "11.2", bold: true, size: 24 }),
                new TextRun({ text: "  ", size: 24 }),
                new TextRun({ text: "RECOMMENDATION-", bold: true, underline: {}, size: 24 }),
              ],
              spacing: { after: 100 },
            }),
            ...createStatementParagraphs(data.remarks.recommendation, "11.2", 24),

            spacer(400),

            // Final Signature Block (Size 24)
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: TableBordersNone(),
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Station : ", bold: true, size: 24 }),
                            new TextRun({ text: data.station, size: 24 }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Dated : ", bold: true, size: 24 }),
                            new TextRun({ text: data.reportDate, size: 24 }),
                          ],
                        }),
                      ],
                      borders: TableBordersNone(),
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: "(Signature of CO/2IC with unit seal)", size: 24 }),
                          ],
                        }),
                      ],
                      borders: TableBordersNone(),
                    }),
                  ],
                }),
              ],
            }),
          ] : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const docBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  saveAs(docBlob, `MP_Occurrence_Report_${data.reportNo || "Draft"}.docx`);
};

function createSignatureTable(date: string, title: string, station?: string) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TableBordersNone(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              ...(station ? [new Paragraph({
                children: [
                  new TextRun({ text: "Station : ", bold: true, size: 28 }),
                  new TextRun({ text: station, size: 28 }),
                ],
              })] : []),
              new Paragraph({
                children: [
                  new TextRun({ text: "Dated : ", bold: true, size: 28 }),
                  new TextRun({ text: date, size: 28 }),
                ],
              }),
            ],
            borders: TableBordersNone(),
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: title, size: 28 }),
                ],
              }),
            ],
            borders: TableBordersNone(),
          }),
        ],
      }),
    ],
  });
}


/* ===============================
   COMPONENT HELPERS
================================ */

function createReportMetaGrid(data: any) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TableBordersNone(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: TableBordersNone(),
            margins: CELL_PADDING,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Report No- ", bold: true, size: 28 }),
                  new TextRun({ text: data.reportNo, size: 28 }),
                ]
              }),
              new Paragraph({ children: [new TextRun({ text: "(Fill in Desk Room)", size: 24, color: "666666" })] }),
            ]
          }),
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: TableBordersNone(),
            margins: CELL_PADDING,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Command- ", bold: true, size: 28 }),
                  new TextRun({ text: data.command, size: 28 }),
                ]
              }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Origin)", size: 24, color: "666666" })] }),
            ]
          }),
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: TableBordersNone(),
            margins: CELL_PADDING,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "FIR No.- ", bold: true, size: 28 }),
                  new TextRun({ text: data.firNo, size: 28 }),
                ]
              }),
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "(Att Copy Filed)", size: 24, color: "666666" })] }),
            ]
          }),
        ]
      })
    ]
  });
}

/* ===============================
   DYNAMIC GRID HELPER
================================ */

function hasValue(str?: string) {
  return str && str.trim() !== "" && str !== "N/A";
}


// Special variant for the "Boxed" look with index (3.1, 3.2 etc)



function createSectionBox(index: string, fields: { label: string; value: any }[]) {
  const validFields = fields.filter(f => hasValue(f.value));
  // If totally empty, maybe skip? User said "content will cover empty space", implies skipping.
  if (validFields.length === 0) return null;

  const gridRows = [];
  for (let i = 0; i < validFields.length; i += 2) {
    const field1 = validFields[i];
    const field2 = validFields[i + 1];

    const children = [];

    // Col 1
    children.push(new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      margins: CELL_PADDING,
      borders: TableBordersNone(),
      children: [new Paragraph({
        children: [
          new TextRun({ text: field1.label, bold: true, size: 28 }),
          new TextRun({ text: "  " + field1.value, size: 28 })
        ]
      })]
    }));

    // Col 2
    if (field2) {
      children.push(new TableCell({
        width: { size: 50, type: WidthType.PERCENTAGE },
        margins: CELL_PADDING,
        borders: TableBordersNone(),
        children: [new Paragraph({
          children: [
            new TextRun({ text: field2.label, bold: true, size: 28 }),
            new TextRun({ text: "  " + field2.value, size: 28 })
          ]
        })]
      }));
    } else {
      children.push(new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: TableBordersNone(), children: [] }));
    }

    gridRows.push(new TableRow({ children }));
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "EEEEEE" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            margins: CELL_PADDING,
            borders: TableBordersNone(),
            children: [new Paragraph({ children: [new TextRun({ text: `(${index})`, size: 28 })] })]
          }),
          new TableCell({
            width: { size: 92, type: WidthType.PERCENTAGE },
            margins: CELL_PADDING,
            borders: TableBordersNone(),
            children: [
              new Table({ // Nested table for grid
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: TableBordersNone(),
                rows: gridRows
              })
            ]
          })
        ]
      })
    ]
  });
}


function createPeopleTable(people: any[], prefix: string) {
  // If no people, return message? Or empty?
  if (!people || people.length === 0) return [new Paragraph({ children: [new TextRun({ text: "No details available.", italics: true, size: 28 })] })];

  const boxes: any[] = [];

  people.forEach((p, i) => {
    // Helper to extract values
    const getVal = (keys: string[], directValue?: string): string | undefined => {
      if (directValue) return directValue;
      if (!p.customFields) return undefined;

      // Normalize keys for search
      for (const key of keys) {
        const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
        for (const fieldKey in p.customFields) {
          const normalizedFieldKey = fieldKey.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (normalizedFieldKey === normalizedKey) {
            return p.customFields[fieldKey];
          }
        }
      }
      return undefined;
    };

    const potentialFields = [
      { label: "Army No.", value: getVal(["armyNo", "armyNumber", "serviceNumber"], p.armyNo) },
      { label: "Rank", value: getVal(["rank"], p.rank) },
      { label: "Name", value: getVal(["name", "personName", "witnessName"], p.name) },
      { label: "Unit", value: getVal(["unit", "unitName"], p.unitName) },
      { label: "FMN", value: getVal(["fmn", "fmnName"], p.fmn) },
      { label: "Command", value: getVal(["command"], p.command) },
      { label: "Aadhar Card No.", value: getVal(["aadhar", "aadharCard", "aadharCardNo", "adhar"]) },
      { label: "S/O", value: getVal(["so", "s/o", "fatherName", "father"]) },
      { label: "Name the Relation", value: getVal(["relation", "relationship", "nametheRelation"]) },
      { label: "I Card No.", value: getVal(["identityCard", "idCard", "icard", "passNo"], p.identityCard) },
      { label: "Address", value: getVal(["address"], p.address) },
      { label: "Tele No.", value: getVal(["tele", "mobile", "contact", "phone"]) },
    ];

    const box = createSectionBox(`${prefix}.${i + 1}`, potentialFields);
    if (box) {
      boxes.push(box);
      boxes.push(spacer(100)); // Space between boxes
    }
  });

  return boxes;
}

function createMpDetailsBox(mp: any) {
  // We want specifically:
  // Army No | Rank
  // Name    | Unit
  // FMN     | Command

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
          fieldCell("Army no.", mp.armyNumber || mp.armyNo),
          fieldCell("Rank", mp.rank)
        ]
      }),
      new TableRow({
        children: [
          fieldCell("Name", mp.name),
          fieldCell("Unit", mp.unit)
        ]
      }),
      new TableRow({
        children: [
          fieldCell("FMN", mp.fmn),
          fieldCell("Command", mp.command)
        ]
      })
    ]
  });
}



function fieldCell(label: string, value: string) {
  // If no value, return empty cell (hiding label)
  if (!value) {
    return new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      margins: CELL_PADDING,
      borders: TableBordersNone(),
      children: []
    });
  }

  return new TableCell({
    width: { size: 50, type: WidthType.PERCENTAGE },
    margins: CELL_PADDING,
    borders: TableBordersNone(),
    children: [new Paragraph({
      children: [
        new TextRun({ text: label, bold: true, size: 28 }),
        new TextRun({ text: "  " + value, size: 28 })
      ]
    })]
  });
}

function createOccurrenceDetailsTable(occ: any) {
  const fields = [
    { id: "2.1", label: "Occurrence Offence Type", value: occ.types && occ.types.length > 0 ? occ.types.join(", ") : (occ.offenceType || "") },
    { id: "2.2", label: "Place of Occurrence", value: occ.place },
    { id: "2.3", label: "Date of Occurrence", value: occ.date },
    { id: "2.4", label: "Time of Occurrence", value: occ.time ? occ.time + " Hrs" : "" }
  ].filter(f => f.value && f.value.trim() !== "" && f.value !== "N/A");

  // Re-index logic if needed? 
  // User asked to remove the field. The indices (2.1, 2.2) might need to be dynamic to keep sequence 
  // OR keep fixed IDs as reference. Usually formatted reports keep fixed IDs (like 2.1 is always Type). 
  // However, removing "Time" 2.4 entirely is requested.
  // Ideally we keep the ID from the source or re-index? 
  // Let's re-index for cleanliness if the user just wants the list flow. 
  // But standard forms usually imply fixed IDs. 
  // Based on "remove the complte fild", I will just not render it.

  // If I filter, 2.3 might be followed by nothing. 

  const rows = fields.map((f, i) => new TableRow({
    children: [
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        margins: CELL_PADDING,
        borders: TableBordersNone(),
        children: [new Paragraph({ children: [new TextRun({ text: f.id, size: 28 })] })]
      }),
      new TableCell({
        width: { size: 92, type: WidthType.PERCENTAGE },
        margins: CELL_PADDING,
        borders: TableBordersNone(),
        children: [new Paragraph({
          children: [
            new TextRun({ text: f.label, bold: true, size: 28 }),
            new TextRun({ text: "  " + f.value, size: 28 })
          ]
        })]
      })
    ]
  }));

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
    rows: rows
  });
}

function createEvidenceGrid(ev: any) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TableBordersNone(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA" } },
            margins: CELL_PADDING,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "6.1 Eye Sketch- ", bold: true, size: 28 }),
                  new TextRun({ text: ev.eyeSketch || "Nil", size: 28 }),
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA" } },
            margins: { left: 100, right: 100, top: 100, bottom: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "6.2 Photos- ", bold: true, size: 28 }),
                  new TextRun({ text: ev.photos || "Nil", size: 28 }),
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA" } },
            margins: CELL_PADDING,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "6.3 Videos- ", bold: true, size: 28 }),
                  new TextRun({ text: ev.videos || "Nil", size: 28 }),
                ]
              })
            ]
          }),
        ]
      })
    ]
  });
}

function createDocumentsList(docs: string[]) {
  if (!docs || docs.length === 0) {
    return [new Paragraph({ children: [new TextRun({ text: "No documents attached.", size: 28, color: "666666" })] })];
  }
  return docs.map((doc, i) => new Paragraph({
    children: [
      new TextRun({ text: `7.${i + 1}  `, size: 28 }),
      new TextRun({ text: doc, size: 28 }),
    ],
    spacing: { after: 100 },
    indent: { left: 360 }
  }));
}

function createStatementParagraphs(text: string, prefix: string, fontSize: number = 28) {
  if (!text) return [new Paragraph({ children: [new TextRun({ text: "No details available.", size: fontSize, color: "666666" })] })];

  return text.split('\n').filter(l => l.trim() !== '').map((line, i) => {
    return new Paragraph({
      children: [
        new TextRun({ text: `${prefix}.${i + 1}  `, size: fontSize }),
        new TextRun({ text: line, size: fontSize }),
      ],
      spacing: { after: 100 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 360 }
    });
  });
}

function createPointsList(points: string[], prefix: string) {
  if (!points || points.length === 0) return [new Paragraph({ children: [new TextRun({ text: "No points recorded.", size: 28, color: "666666" })] })];

  return points.map((p, i) => new Paragraph({
    children: [
      new TextRun({ text: `${prefix}.${i + 1}  `, size: 28 }),
      new TextRun({ text: p, size: 28 }),
    ],
    spacing: { after: 100 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 360 }
  }));
}
