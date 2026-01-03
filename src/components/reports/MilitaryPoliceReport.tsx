import React from "react";

/* ================= TYPES ================= */

export interface MilitaryPoliceReportProps {
  reportNo: string;
  reportDate: string;
  particulars?: {
    primary?: PersonDetails;
    secondary?: PersonDetails;
    vehicle?: VehicleDetails;
  };
  occurrence?: {
    dateOfDuty?: string;
    dutyTime?: string;
    dutyLocation?: string;
    nameOfWitnessingOfficial1?: string;
    nameOfWitnessingOfficial2?: string;
    nameOfWitnessingOfficial3?: string;
    timeOfOffence?: string;
    locationOfOffence?: string;
    statement?: string;
  };
  offence?: {
    type?: string;
    ref1?: string;
    ref2?: string;
    description?: string;
  };
  witnessSig?: SignatureDetails;
  mpSig?: SignatureDetails;
  remarks?: {
    text?: string;
    station?: string;
    dated?: string;
  };
  className?: string;
}

interface PersonDetails {
  aadharCardNo?: string;
  name?: string;
  so?: string;
  relation?: string;
  armyNo?: string;
  rank?: string;
  unit?: string;
  command?: string;
  fmn?: string;
  address?: string;
  iCardNo?: string;
}

interface VehicleDetails {
  baNo?: string;
  makeAndTake?: string;
}

interface SignatureDetails {
  armyNo?: string;
  rank?: string;
  name?: string;
  unit?: string;
}

/* ================= MAIN COMPONENT ================= */

export const MilitaryPoliceReport: React.FC<MilitaryPoliceReportProps> = ({
  reportNo,
  reportDate,
  particulars,
  occurrence,
  offence,
  witnessSig,
  mpSig,
  remarks,
  className,
}) => {
  const primary = particulars?.primary || {};
  const secondary = particulars?.secondary;
  const vehicle = particulars?.vehicle;

  return (
    <div
      id="mp-report"
      className={`font-sans text-gray-900 p-8 flex flex-col gap-8 print:block print:p-0 print:gap-0 ${
        className || ""
      }`}
    >
      {/* ================= PAGE 1 ================= */}
      <div className="max-w-[210mm] mx-auto bg-white p-[48px] shadow-lg print:shadow-none">

        {/* Header */}
        <div className="mb-8">
          <div className="text-right font-bold text-xs mb-4 underline">
            In Lieu Of IAFP-1479
          </div>

          <h1 className="text-center font-bold text-sm mb-1">
            MILITARY POLICE REPORT
          </h1>
          <h2 className="text-center font-bold text-sm mb-8">
            (GEN AND TRAFFIC OFFENCE)
          </h2>

          <div className="flex justify-between text-xs">
            <div>Report No- {reportNo}</div>
            <div>Report Date- {reportDate}</div>
          </div>
        </div>

        {/* ================= 1. PARTICULARS ================= */}
        {(Object.values(primary).some(Boolean) || secondary || vehicle) && (
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-4 underline">
              1. PARTICULARS
            </h2>

            {/* Primary */}
            <InfoBlock title="(1.1) Driver" person={primary} />

            {/* Secondary */}
            {secondary && <InfoBlock title="(1.2) Co-Driver" person={secondary} />}

            {/* Vehicle */}
            {vehicle && (
              <div className="border p-4 text-xs">
                <div>DD Veh. BA No.: {vehicle.baNo}</div>
                <div>Make & Take: {vehicle.makeAndTake}</div>
              </div>
            )}
          </div>
        )}

        {/* ================= 2. OCCURRENCE ================= */}
        <Section title="2. STATEMENT OF EVIDENCE / OCCURRENCE">
          <Info label="Date of Duty" value={occurrence?.dateOfDuty} />
          <Info label="Duty Time" value={occurrence?.dutyTime} />
          <Info label="Duty Location" value={occurrence?.dutyLocation} />
          <Info label="Time of Offence" value={occurrence?.timeOfOffence} />
          <Info label="Location of Offence" value={occurrence?.locationOfOffence} />
          <p className="text-xs mt-2">{occurrence?.statement}</p>
        </Section>

        {/* ================= 3. OFFENCE ================= */}
        <Section title="3. OFFENCE COMMITTED">
          <Info label="Offence Type" value={offence?.type} />
          <Info label="Ref (i)" value={offence?.ref1} />
          <Info label="Ref (ii)" value={offence?.ref2} />
          <p className="text-xs mt-2">{offence?.description}</p>
        </Section>

        {/* ================= SIGNATURES ================= */}
        <div className="flex justify-between mt-8">
          <Signature title="Witness" sig={witnessSig} />
          <Signature title="MP JCO/NCO" sig={mpSig} />
        </div>

        {/* ================= REMARKS ================= */}
        <Section title="REMARKS OF CO/2IC PROVOST UNIT">
          <p className="text-xs">{remarks?.text}</p>
          <Info label="Station" value={remarks?.station} />
          <Info label="Dated" value={remarks?.dated} />
        </Section>
      </div>
    </div>
  );
};

/* ================= HELPERS ================= */

const Section = ({ title, children }: any) => (
  <div className="mb-6">
    <h3 className="font-bold underline text-xs mb-2">{title}</h3>
    {children}
  </div>
);

const InfoBlock = ({ title, person }: any) => (
  <div className="border p-4 mb-4 text-xs">
    <div className="font-bold mb-2">{title}</div>
    <Info label="Name" value={person?.name} />
    <Info label="Army No." value={person?.armyNo} />
    <Info label="Rank" value={person?.rank} />
    <Info label="Unit" value={person?.unit} />
    <Info label="Command" value={person?.command} />
  </div>
);

const Info = ({ label, value }: any) => (
  <div className="grid grid-cols-[150px_1fr] text-xs">
    <span className="font-semibold">{label}</span>
    <span>{value || "N/A"}</span>
  </div>
);

const Signature = ({ title, sig }: any) => (
  <div className="w-64 text-xs">
    <div className="font-bold underline mb-2">{title}</div>
    <Info label="Army No." value={sig?.armyNo} />
    <Info label="Rank" value={sig?.rank} />
    <Info label="Name" value={sig?.name} />
    <Info label="Unit" value={sig?.unit} />
  </div>
);
