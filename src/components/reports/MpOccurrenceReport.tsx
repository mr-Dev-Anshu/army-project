import React from "react";

export interface MpOccurrenceReportProps {
  reportNo: string;
  command: string;
  firNo: string;
  mpDetails: {
    armyNo: string;
    rank: string;
    name: string;
    unit: string;
    fmn: string;
    command: string;
  };
  occurrence: {
    offenceType: string;
    place: string;
    date: string;
    time: string;
  };
  people: {
    sno: number;
    armyNo: string;
    rank: string;
    name: string;
    identityCard: string;
    unitName: string;
    fmn: string;
    address: string;
    remark: string;
    role: "Victim" | "Offender" | "Unknown";
  }[];
  briefOfOccurrence: string;
  witnesses: {
    sno: number;
    armyNo: string;
    rank: string;
    name: string;
    identityCard: string;
    unitName: string;
    fmn: string;
    address: string;
    remark: string;
  }[];
  evidence: {
    eyeSketch: string;
    photos: string;
    videos: string;
  };
  documents: string[];
  detailedReport: {
    statement: string;
    findings: string[];
    opinion: string;
  };
  remarks: {
    analysis: string;
    recommendation: string;
  };
  station: string;
  reportDate: string;
  className?: string;
}

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="max-w-[210mm] mx-auto bg-white p-[48px] min-h-[297mm] print:p-0 print:min-h-0"
    style={{ pageBreakAfter: "always" }}
  >
    {children}
  </div>
);

const MpOccurrenceReport: React.FC<MpOccurrenceReportProps> = ({
  reportNo,
  command,
  firNo,
  mpDetails,
  occurrence,
  people,
  briefOfOccurrence,
  witnesses,
  evidence,
  documents,
  detailedReport,
  remarks,
  station,
  reportDate,
  className,
}) => {
  return (
    <div className={`font-sans text-gray-900 ${className || ""}`}>
      <style type="text/css" media="print">
        {`
          @page { size: A4; margin: 20mm; }
          body { background: white; -webkit-print-color-adjust: exact; }
        `}
      </style>

      {/* ================= PAGE 1 ================= */}
      <Page>
        <h1 className="text-center font-bold underline text-sm mb-6">
          MP OCCURRENCE & INVESTIGATION REPORT
        </h1>

        <div className="grid grid-cols-3 text-xs mb-6">
          <div>
            <b>Report No:</b> {reportNo}
          </div>
          <div className="text-center">
            <b>Command:</b> {command}
          </div>
          <div className="text-right">
            <b>FIR No:</b> {firNo}
          </div>
        </div>

        <div className="border p-4 text-xs mb-6">
          <b>1. MP DETAILS</b>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>Army No: {mpDetails.armyNo}</div>
            <div>Rank: {mpDetails.rank}</div>
            <div>Name: {mpDetails.name}</div>
            <div>Unit: {mpDetails.unit}</div>
            <div>FMN: {mpDetails.fmn}</div>
            <div>Command: {mpDetails.command}</div>
          </div>
        </div>

        <div className="text-xs mb-6">
          <b>2. OCCURRENCE DETAILS</b>
          <div>Type: {occurrence.offenceType}</div>
          <div>Place: {occurrence.place}</div>
          <div>Date: {occurrence.date}</div>
          <div>Time: {occurrence.time} hrs</div>
        </div>

        <div className="text-xs mb-6">
          <b>3. DETAILS OF VICTIMS / OFFENDERS</b>
          <table className="w-full border mt-2">
            <thead>
              <tr>
                <th className="border p-1">S.No</th>
                <th className="border p-1">Army No / Rank / Name</th>
                <th className="border p-1">ID Card</th>
                <th className="border p-1">Unit / FMN / Address</th>
                <th className="border p-1">Remark</th>
              </tr>
            </thead>
            <tbody>
              {people.length > 0 ? (
                people.map((p) => (
                  <tr key={p.sno}>
                    <td className="border p-1 text-center">{p.sno}</td>
                    <td className="border p-1">
                      {p.armyNo} / {p.rank} / {p.name}
                    </td>
                    <td className="border p-1">{p.identityCard}</td>
                    <td className="border p-1">
                      {p.unitName} / {p.fmn} / {p.address}
                    </td>
                    <td className="border p-1">{p.remark || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border p-2 text-center text-gray-400">
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-xs">
          <b>4. BRIEF OF OCCURRENCE</b>
          <p className="mt-2 whitespace-pre-line">{briefOfOccurrence}</p>
        </div>
      </Page>

      {/* ================= PAGE 2 ================= */}
      <Page>
        <b className="text-xs">5. WITNESSES</b>
        <table className="w-full border mt-2 text-xs">
          <thead>
            <tr>
              <th className="border p-1">S.No</th>
              <th className="border p-1">Army No / Rank / Name</th>
              <th className="border p-1">ID Card</th>
              <th className="border p-1">Unit / FMN / Address</th>
              <th className="border p-1">Remark</th>
            </tr>
          </thead>
          <tbody>
            {witnesses.length > 0 ? (
              witnesses.map((w) => (
                <tr key={w.sno}>
                  <td className="border p-1">{w.sno}</td>
                  <td className="border p-1">
                    {w.armyNo} / {w.rank} / {w.name}
                  </td>
                  <td className="border p-1">{w.identityCard}</td>
                  <td className="border p-1">
                    {w.unitName} / {w.fmn} / {w.address}
                  </td>
                  <td className="border p-1">{w.remark || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border p-2 text-center text-gray-400">
                  No witnesses
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Page>

      {/* ================= PAGE 3 ================= */}
      <Page>
        <b className="text-xs">6. EVIDENCE</b>
        <div className="text-xs mt-2">
          Eye Sketch: {evidence.eyeSketch || "Nil"} <br />
          Photos: {evidence.photos || "Nil"} <br />
          Videos: {evidence.videos || "Nil"}
        </div>

        <b className="text-xs mt-6 block">7. DOCUMENTS</b>
        <ul className="list-disc pl-6 text-xs mt-2">
          {documents.length > 0 ? (
            documents.map((d, i) => <li key={i}>{d}</li>)
          ) : (
            <li className="text-gray-400">No documents</li>
          )}
        </ul>
      </Page>

      {/* ================= PAGE 4 ================= */}
      <Page>
        <b className="text-xs">8. DETAILED REPORT</b>
        <p className="text-xs whitespace-pre-line mt-2">
          {detailedReport.statement || "Nil"}
        </p>

        <b className="text-xs mt-6 block">OPINION</b>
        <p className="text-xs whitespace-pre-line">
          {detailedReport.opinion || "Nil"}
        </p>
      </Page>

      {/* ================= PAGE 5 ================= */}
      <Page>
        <b className="text-xs">9. INVESTIGATION POINTS</b>
        <ul className="list-decimal pl-6 text-xs mt-2">
          {detailedReport.findings.length > 0 ? (
            detailedReport.findings.map((f, i) => <li key={i}>{f}</li>)
          ) : (
            <li className="text-gray-400">No points recorded</li>
          )}
        </ul>
      </Page>

      {/* ================= PAGE 6 ================= */}
      <Page>
        <b className="text-xs">10. REMARKS</b>
        <p className="text-xs mt-2 whitespace-pre-line">
          {remarks.analysis}
        </p>

        <p className="text-xs mt-4 whitespace-pre-line">
          {remarks.recommendation}
        </p>

        <div className="mt-12 text-xs flex justify-between">
          <div>
            Station: {station} <br />
            Dated: {reportDate}
          </div>
          <div>(Signature)</div>
        </div>
      </Page>
    </div>
  );
};

export default MpOccurrenceReport;
