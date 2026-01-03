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
    new TextRun({ text: no, bold: true, size: 24 }),
    new TextRun({ text: "  ", size: 24 }),
    new TextRun({ text: title, bold: true, underline: {}, size: 24 }),
  ];
  if (subText) {
    runs.push(new TextRun({ text: " " + subText, size: 24 }));
  }
  return new Paragraph({
    children: runs,
    spacing: { after: 100 },
  });
}

function labelValueParagraph(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: label, bold: true, size: 24 }),
      new TextRun({ text: " " + value, size: 24 }),
    ],
    spacing: { after: 50 },
  });
}

/* ===============================
   MAIN GENERATOR
================================ */

export const generateMPOccurrenceWordReport = async (data: MpOccurrenceReportProps) => {
  const doc = new Document({
    creator: "Army App",
    title: "MP Occurrence Report",
    description: "Generated MP Occurrence & Investigation Report",
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 24, // 12pt
            characterSpacing: 10,
            color: "0A0A0A",
          },
        },
      },
    },
    sections: [
      // ==================== PAGE 1 ====================
      {
        properties: {
          page: {
            margin: {
              top: 800, // 20mm
              right: 700,
              bottom: 800,
              left: 700,
            },
          },
        },
        children: [
          // Header Page 1
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "IAFP-1479 (Revised)", bold: true, underline: {}, size: 24 })],
            spacing: { after: 300, before: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "MP OCCURRENCE & INVESTIGATION REPORT", bold: true, underline: {}, size: 32 })], // 16px ~ 32 half-points
            spacing: { after: 300 },
          }),

          // Report Meta Grid
          createReportMetaGrid(data),
          spacer(),

          // 1. MP DETAILS
          sectionHeading("1.", "MP DETAILS:"),
          createMpDetailsBox(data.mpDetails),
          new Paragraph({
            children: [new TextRun({ text: "(MP must caution witness and ensure presence of independent witness if possible)", size: 24, color: "666666" })],
            spacing: { after: 300 },
          }),

          // 2. OCCURRENCE DETAILS
          sectionHeading("2.", "OCCURRENCE DETAILS:"),
          createOccurrenceDetailsTable(data.occurrence),
          spacer(),

          // 3. DETAILS OF VICTIMS/OFFENDERS
          sectionHeading("3.", "DETAILS OF VICTIMS/OFFENDERS:", "(MP must verify personal particulars)"),
          createPeopleTable(data.people, "3"),
          new Paragraph({
            children: [new TextRun({
              text: "(To be read out to the Offender(s) by the MP 'above recorded personal particulars have been given by me voluntarily and I certify and sign them as correct. If found otherwise. I am liable for disciplinary action under the Army Act')",
              size: 24,
              italics: false
            })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 300 },
          }),

          // 4. BRIEF OF OCCURRENCE
          sectionHeading("4.", "BRIEF OF OCCURRENCE", "(Details on Reverse) offence:"),
          new Paragraph({
            children: [new TextRun({ text: data.briefOfOccurrence || "", size: 24 })],
            alignment: AlignmentType.JUSTIFIED,
          }),

          // Footer Page 1
          spacer(400),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
          }),
        ],
      },

      // ==================== PAGE 2 ====================
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
        children: [
          // Header Page 2
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "-2-", size: 24, bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
            spacing: { after: 300 },
          }),

          // 5. WITNESS
          sectionHeading("5.", "WITNESS:", "(Witness must record statement in own hand where possible)"),
          createPeopleTable(data.witnesses, "5"),
          spacer(),

          // 6. EVIDENCE
          sectionHeading("6.", "EVIDENCE:", "(Collect and record evidence carefully)"),
          createEvidenceGrid(data.evidence),
          spacer(),

          // 7. DOCUMENTS ATTACHED
          sectionHeading("7.", "DOCUMENTS ATTACHED"),
          ...createDocumentsList(data.documents),

          // Footer Page 2
          spacer(400),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
          }),
        ],
      },

      // ==================== PAGE 3 ====================
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
        children: [
          // Header Page 3
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "-3-", size: 24, bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
            spacing: { after: 300 },
          }),

          // 8. DETAILED OCCURRENCE REPORT
          sectionHeading("8.", "DETAILED OCCURRENCE REPORT"),
          new Paragraph({ text: "Sir,", spacing: { after: 200 } }),
          ...createStatementParagraphs(data.detailedReport.statement, "8"),

          // Footer Page 3
          spacer(400),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
          }),
        ],
      },

      // ==================== PAGE 4 ====================
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
        children: [
          // Header Page 4
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "-4-", size: 24, bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
            spacing: { after: 300 },
          }),

          // 9. POINTS FIND OUT DURING THE INVESTIGATION
          sectionHeading("9.", "POINTS FIND OUT DURING THE INVESTIGATION"),
          ...createPointsList(data.detailedReport.findings, "9"),

          // Footer Page 4
          spacer(400),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
          }),
        ],
      },

      // ==================== PAGE 5 ====================
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
        children: [
          // Header Page 5
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "-5-", size: 24, bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
            spacing: { after: 300 },
          }),

          // 10. OPINION
          sectionHeading("10.", "OPINION:"),
          ...createStatementParagraphs(data.detailedReport.opinion, "10"),

          spacer(400),

          // Signature Block
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
                          new TextRun({ text: "(Signature of MP JCO/NCO)", size: 24 }),
                        ],
                      }),
                    ],
                    borders: TableBordersNone(),
                  }),
                ],
              }),
            ],
          }),

          // Footer Page 5
          spacer(400),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
          }),
        ],
      },

      // ==================== PAGE 6 ====================
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
        children: [
          // Header Page 6
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "-6-", size: 24, bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
            spacing: { after: 300 },
          }),

          // 11. REMARKS CO/2IC PROVOST UNIT
          new Paragraph({
            children: [
              new TextRun({ text: "11.", bold: true, size: 24 }),
              new TextRun({ text: "  ", size: 24 }),
              new TextRun({ text: "REMARKS CO/2IC PROVOST UNIT", bold: true, underline: {}, size: 24 }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Check evidence gives analysis and recommendation and fill IAFD-901 if required", size: 24 })],
            spacing: { after: 300 },
            indent: { left: 720 }, // Indent
          }),

          // 11.1 ANALYSIS
          sectionHeading("11.1", "ANALYSIS-"),
          ...createStatementParagraphs(data.remarks.analysis, "11.1"),
          spacer(),

          // 11.2 RECOMMENDATION
          sectionHeading("11.2", "RECOMMENDATION-"),
          ...createStatementParagraphs(data.remarks.recommendation, "11.2"),
          spacer(400),

          // Final Signature Block
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

          // Footer Page 6
          spacer(400),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "RESTRICTED", bold: true, underline: {}, size: 24 })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const docBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  saveAs(docBlob, `MP_Occurrence_Report_${data.reportNo || "Draft"}.docx`);
};


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
                  new TextRun({ text: "Report No- ", bold: true, size: 24 }),
                  new TextRun({ text: data.reportNo, size: 24 }),
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
                  new TextRun({ text: "Command- ", bold: true, size: 24 }),
                  new TextRun({ text: data.command, size: 24 }),
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
                  new TextRun({ text: "FIR No.- ", bold: true, size: 24 }),
                  new TextRun({ text: data.firNo, size: 24 }),
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

function createMpDetailsBox(mp: any) {
  // 2 columns x 3 rows grid
  const makeRow = (l1: string, v1: string, l2: string, v2: string) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          margins: CELL_PADDING,
          borders: { right: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE } }, // Internal arrangement
          children: [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: TableBordersNone(),
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: TableBordersNone(), children: [new Paragraph({ children: [new TextRun({ text: l1, bold: true, size: 24 })] })] }),
                    new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, borders: TableBordersNone(), children: [new Paragraph({ children: [new TextRun({ text: v1, size: 24 })] })] }),
                  ]
                })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          margins: CELL_PADDING,
          borders: { left: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          children: [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: TableBordersNone(),
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: TableBordersNone(), children: [new Paragraph({ children: [new TextRun({ text: l2, bold: true, size: 24 })] })] }),
                    new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, borders: TableBordersNone(), children: [new Paragraph({ children: [new TextRun({ text: v2, size: 24 })] })] }),
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
  }

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
      makeRow("Army no.", mp.armyNo, "Rank", mp.rank),
      makeRow("Name", mp.name, "Unit", mp.unit),
      makeRow("FMN", mp.fmn, "Command", mp.command),
    ]
  });
}

function createOccurrenceDetailsTable(occ: any) {
  const makeRow = (num: string, label: string, val: string) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          borders: TableBordersNone(),
          margins: CELL_PADDING,
          children: [new Paragraph({ children: [new TextRun({ text: num, size: 24 })] })]
        }),
        new TableCell({
          width: { size: 90, type: WidthType.PERCENTAGE },
          borders: TableBordersNone(),
          margins: CELL_PADDING,
          children: [new Paragraph({
            children: [
              new TextRun({ text: label, bold: true, size: 24 }),
              new TextRun({ text: "  " + val, size: 24 }),
            ]
          })]
        })
      ]
    });
  };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TableBordersNone(),
    rows: [
      makeRow("2.1", "Occurrence Offence Type-", occ.offenceType),
      makeRow("2.2", "Place of Occurrence-", occ.place),
      makeRow("2.3", "Date of Occurrence-", occ.date),
      makeRow("2.4", "Time of Occurrence-", occ.time + " Hrs"),
    ]
  });
}

function createPeopleTable(people: any[], prefix: string) {
  const tableHeader = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, margins: CELL_PADDING, children: [new Paragraph({ children: [new TextRun({ text: "Sr no.", bold: true, size: 24 })], alignment: AlignmentType.CENTER })] }),
      new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, margins: CELL_PADDING, children: [new Paragraph({ children: [new TextRun({ text: "Army No, Rank & Name", bold: true, size: 24 })] })] }),
      new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, margins: CELL_PADDING, children: [new Paragraph({ children: [new TextRun({ text: "Identity Card", bold: true, size: 24 })] })] }),
      new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, margins: CELL_PADDING, children: [new Paragraph({ children: [new TextRun({ text: "Unit/Tele No.", bold: true, size: 24 })] })] }),
      new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, margins: CELL_PADDING, children: [new Paragraph({ children: [new TextRun({ text: "Remark", bold: true, size: 24 })] })] }),
    ]
  });

  const rows = people.map((p) => {
    return new TableRow({
      children: [
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          margins: CELL_PADDING,
          children: [new Paragraph({ children: [new TextRun({ text: prefix + "." + p.sno, size: 24 })], alignment: AlignmentType.CENTER })]
        }),
        new TableCell({
          margins: CELL_PADDING,
          children: [
            new Paragraph({ children: [new TextRun({ text: "Army no.: ", bold: true, size: 24 }), new TextRun({ text: p.armyNo, size: 24 })] }),
            new Paragraph({ children: [new TextRun({ text: "Rank: ", bold: true, size: 24 }), new TextRun({ text: p.rank, size: 24 })] }),
            new Paragraph({ children: [new TextRun({ text: "Name: ", bold: true, size: 24 }), new TextRun({ text: p.name, size: 24 })] }),
          ]
        }),
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          margins: CELL_PADDING,
          children: [new Paragraph({ children: [new TextRun({ text: p.identityCard, size: 24 })], alignment: AlignmentType.CENTER })]
        }),
        new TableCell({
          margins: CELL_PADDING,
          children: [
            new Paragraph({ children: [new TextRun({ text: "Unit: ", bold: true, size: 24 }), new TextRun({ text: p.unitName, size: 24 })] }),
            new Paragraph({ children: [new TextRun({ text: "FMN: ", bold: true, size: 24 }), new TextRun({ text: p.fmn, size: 24 })] }),
            new Paragraph({ children: [new TextRun({ text: "Address: ", bold: true, size: 24 }), new TextRun({ text: p.address, size: 24 })] }),
          ]
        }),
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          margins: CELL_PADDING,
          children: [new Paragraph({ children: [new TextRun({ text: p.remark || "--", size: 24 })], alignment: AlignmentType.CENTER })]
        }),
      ]
    });
  });

  if (rows.length === 0) {
    rows.push(new TableRow({
      children: [new TableCell({ columnSpan: 5, margins: CELL_PADDING, children: [new Paragraph({ children: [new TextRun({ text: "No details available", size: 24, color: "666666" })], alignment: AlignmentType.CENTER })] })]
    }));
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TableBordersAll(),
    rows: [tableHeader, ...rows],
  });
}

function createEvidenceGrid(ev: any) {
  // 3 columns: Eye Sketch, Photos, Videos.
  // UI: Border bottom for each item. Label is bold.
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
                  new TextRun({ text: "6.1 Eye Sketch- ", bold: true, size: 24 }),
                  new TextRun({ text: ev.eyeSketch || "Nil", size: 24 }),
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA" } },
            margins: { left: 100, right: 100, top: 100, bottom: 100 }, // Spacing
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "6.2 Photos- ", bold: true, size: 24 }),
                  new TextRun({ text: ev.photos || "________", size: 24 }),
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
                  new TextRun({ text: "6.3 Videos- ", bold: true, size: 24 }),
                  new TextRun({ text: ev.videos || "________", size: 24 }),
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
    return [new Paragraph({ children: [new TextRun({ text: "No documents attached.", size: 24, color: "666666" })] })];
  }
  return docs.map((doc, i) => new Paragraph({
    children: [
      new TextRun({ text: `7.${i + 1}  `, size: 24 }),
      new TextRun({ text: doc, size: 24 }),
    ],
    spacing: { after: 100 },
    indent: { left: 360 }
  }));
}

function createStatementParagraphs(text: string, prefix: string) {
  if (!text) return [new Paragraph({ children: [new TextRun({ text: "No details available.", size: 24, color: "666666" })] })];

  return text.split('\n').filter(l => l.trim() !== '').map((line, i) => {
    return new Paragraph({
      children: [
        new TextRun({ text: `${prefix}.${i + 1}  `, size: 24 }),
        new TextRun({ text: line, size: 24 }),
      ],
      spacing: { after: 100 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 360 }
    });
  });
}

function createPointsList(points: string[], prefix: string) {
  if (!points || points.length === 0) return [new Paragraph({ children: [new TextRun({ text: "No points recorded.", size: 24, color: "666666" })] })];

  return points.map((p, i) => new Paragraph({
    children: [
      new TextRun({ text: `${prefix}.${i + 1}  `, size: 24 }),
      new TextRun({ text: p, size: 24 }),
    ],
    spacing: { after: 100 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 360 }
  }));
}
