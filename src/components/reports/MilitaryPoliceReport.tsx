import React from 'react';

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
      className={`font-sans text-gray-900 bg-gray-500/10 p-8 flex flex-col gap-8 print:block print:p-0 print:gap-0 ${
        className || ''
      }`}
    >
      {/* PRINT HEADER */}
      <div className="hidden print:block fixed top-0 w-full text-center font-bold text-sm page-number mt-4 z-50"></div>

      {/* PAGE */}
      <div
        className="max-w-[210mm] w-full mx-auto bg-white p-12 min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0"
        style={{ pageBreakAfter: 'always' }}
      >
        {/* Header */}
        <div className="flex flex-col mb-8">
          <div className="text-right font-bold text-xs mb-4">
            In Lieu Of IAFP-1479
          </div>

          <h1 className="text-center font-bold text-lg underline mb-6">
            MILITARY POLICE REPORT
            <br />
            (GEN AND TRAFFIC OFFENCE)
          </h1>

          <div className="flex justify-between items-end">
            <div className="font-semibold">Report No- {reportNo || 'N/A'}</div>
            <div className="font-semibold">Report Date- {reportDate || 'N/A'}</div>
          </div>
        </div>

        {/* 1. PARTICULARS */}
        <div className="mb-6">
          <h2 className="font-bold underline mb-4">
            1. &nbsp;&nbsp; PARTICULARS:
          </h2>

          {/* 1.1 PRIMARY */}
          <div className="border border-gray-300 p-4 mb-4 rounded-sm">
            <div className="grid grid-cols-12 gap-y-2 gap-x-4">
              <div className="col-span-1 font-semibold">(1.1)</div>

              <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-2">
                <Info label="Aadhar Card No." value={primary?.aadharCardNo} />
                <Info label="S/O" value={primary?.so} />
                <Info label="Name" value={primary?.name} />
                <Info label="Name the Relation" value={primary?.relation} />
              </div>

              {/* 1.1.1 */}
              <div className="col-span-1 font-semibold mt-2">(1.1.1)</div>

              <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                <Info label="Army No." value={primary?.armyNo} />
                <Info label="Rank" value={primary?.rank} />
                <Info label="Name" value={primary?.name} />
                <Info label="Unit" value={primary?.unit} />
                <Info label="FMN" value={primary?.fmn} />
                <Info label="Command" value={primary?.command} />
                <Info label="Address" value={primary?.address} />
                <Info label="I Card No." value={primary?.iCardNo} />
              </div>
            </div>
          </div>

          {/* 1.2 SECONDARY */}
          {secondary && (
            <div className="border border-gray-300 p-4 mb-4 rounded-sm">
              <div className="grid grid-cols-12 gap-y-2 gap-x-4">
                <div className="col-span-1 font-semibold">(1.2)</div>

                <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-2">
                  <Info label="Aadhar Card No." value={secondary?.aadharCardNo} />
                  <Info label="S/O" value={secondary?.so} />
                  <Info label="Name" value={secondary?.name} />
                  <Info label="Relation" value={secondary?.relation} />
                </div>
              </div>
            </div>
          )}

          {/* 1.3 VEHICLE */}
          {vehicle && (
            <div className="border border-gray-300 p-4 mb-4 rounded-sm">
              <div className="grid grid-cols-12 gap-y-2 gap-x-4 items-center">
                <div className="col-span-1 font-semibold">(1.3)</div>
                <div className="col-span-11 grid grid-cols-2 gap-x-8">
                  <Info label="DD Veh. BA No." value={vehicle?.baNo} />
                  <Info label="Make & Take" value={vehicle?.makeAndTake} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. OCCURRENCE */}
        <div className="mb-6">
          <h2 className="font-bold underline mb-4">
            2. &nbsp;&nbsp; STATEMENT OF EVIDENCE/OCCURRENCE:
          </h2>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 ml-4">
            <Info2 label="Date of Duty" value={occurrence?.dateOfDuty} />
            <Info2 label="Duty Time" value={occurrence?.dutyTime} />
            <Info2 label="Duty Location" value={occurrence?.dutyLocation} />
            <Info2
              label="Witness Official 1"
              value={occurrence?.nameOfWitnessingOfficial1}
            />
            <Info2
              label="Witness Official 2"
              value={occurrence?.nameOfWitnessingOfficial2}
            />
            <Info2
              label="Witness Official 3"
              value={occurrence?.nameOfWitnessingOfficial3}
            />
            <Info2 label="Time of Offence" value={occurrence?.timeOfOffence} />
            <Info2
              label="Location of Offence"
              value={occurrence?.locationOfOffence}
            />
          </div>

          <div className="text-justify ml-8 mt-4 text-gray-800 leading-relaxed">
            {occurrence?.statement || 'N/A'}
          </div>
        </div>

        {/* 3. OFFENCE */}
        <div className="mb-8">
          <h2 className="font-bold underline mb-4">
            3. &nbsp;&nbsp; OFFENCE COMMITTED/ORDERS CONTRAVENED:
          </h2>

          <div className="ml-4">
            <div className="flex mb-2">
              <span className="font-semibold mr-2">(3.1) Offence Type:</span>
              <span>{offence?.type || 'N/A'}</span>
            </div>

            <p className="text-justify leading-relaxed">
              {offence?.description || 'N/A'}
            </p>
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="flex justify-between items-start mt-12 mb-12">
          <Signature title="Sig of Witness" sig={witnessSig} />
          <Signature title="Sig of MP JCO/NCO" sig={mpSig} />
        </div>

        {/* REMARKS */}
        <div className="mt-8">
          <h3 className="text-center font-bold underline mb-4">
            REMARKS OF CO/2IC PROVOST UNIT
          </h3>

          <p className="text-justify mb-8 ml-8">
            {remarks?.text || 'N/A'}
          </p>

          <div className="grid grid-cols-[80px_1fr] gap-y-2 ml-4">
            <div className="font-bold">Station :</div>
            <div>{remarks?.station || 'N/A'}</div>
            <div className="font-bold">Dated :</div>
            <div>{remarks?.dated || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }: any) => (
  <div className="grid grid-cols-[110px_1fr]">
    <span className="font-semibold">{label}</span>
    <span>{value || 'N/A'}</span>
  </div>
);

const Info2 = ({ label, value }: any) => (
  <div className="grid grid-cols-[150px_1fr]">
    <span className="font-semibold text-xs">{label}</span>
    <span>{value || 'N/A'}</span>
  </div>
);

const Signature = ({ title, sig }: any) => (
  <div className="w-64">
    <div className="font-bold underline mb-4">{title}</div>
    <div className="grid grid-cols-[60px_1fr] gap-y-1">
      <span className="font-bold">Army No.</span>
      <span>{sig?.armyNo || 'N/A'}</span>
      <span className="font-bold">Rank</span>
      <span>{sig?.rank || 'N/A'}</span>
      <span className="font-bold">Name</span>
      <span>{sig?.name || 'N/A'}</span>
      <span className="font-bold">Unit</span>
      <span>{sig?.unit || 'N/A'}</span>
    </div>
  </div>
);

export default MilitaryPoliceReport;
