import React from 'react';

export interface MilitaryPoliceReportProps {
  reportNo: string;
  reportDate: string;
  particulars: {
    primary: PersonDetails;
    secondary?: PersonDetails; // For (1.2) - optional
    vehicle?: VehicleDetails; // For (1.3)
  };
  occurrence: {
    dateOfDuty: string;
    dutyTime: string;
    dutyLocation: string;
    nameOfWitnessingOfficial1: string; // 2.4.1
    nameOfWitnessingOfficial2: string; // 2.4.2
    nameOfWitnessingOfficial3?: string; // 2.4.3
    timeOfOffence: string;
    locationOfOffence: string;
    statement: string; // 2.5
  };
  offence: {
    type: string; // 3.1
    ref1: string;
    ref2: string;
    description: string;
  };
  witnessSig: SignatureDetails;
  mpSig: SignatureDetails;
  remarks: {
    text: string;
    station: string;
    dated: string;
  };
  className?: string;
}

interface PersonDetails {
  aadharCardNo: string;
  name: string;
  so: string;
  relation: string;
  armyNo: string;
  rank: string;
  unit: string;
  command: string;
  fmn: string;
  address: string;
  iCardNo: string;
}

interface VehicleDetails {
  baNo: string;
  makeAndTake: string;
}

interface SignatureDetails {
  armyNo: string;
  rank: string;
  name: string;
  unit: string;
}

const MilitaryPoliceReport: React.FC<MilitaryPoliceReportProps> = ({
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
  return (
    <div className={`font-sans text-gray-900 bg-gray-500/10 p-8 flex flex-col gap-8 print:block print:p-0 print:gap-0 ${className || ''}`}>

      {/* Print Only: Fixed Global Page Numbering */}
      <div className="hidden print:block fixed top-0 w-full text-center font-bold text-sm page-number mt-4 z-50"></div>

      {/* ==================== PAGE 1 ==================== */}
      <div className="max-w-[210mm] w-full mx-auto bg-white p-12 min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

        {/* Header */}
        <div className="flex flex-col mb-8">
          <div className="text-right font-bold text-xs mb-4">In Lieu Of IAFP-1479</div>
          <h1 className="text-center font-bold text-lg underline mb-6">
            MILITARY POLICE REPORT<br />(GEN AND TRAFFIC OFFENCE)
          </h1>
          <div className="flex justify-between items-end">
            <div className="font-semibold">Report No- {reportNo}</div>
            <div className="font-semibold">Report Date- {reportDate}</div>
          </div>
        </div>

        {/* 1. PARTICULARS */}
        <div className="mb-6">
          <h2 className="font-bold underline mb-4">1. &nbsp;&nbsp; PARTICULARS:</h2>

          {/* 1.1 Primary Person */}
          <div className="border border-gray-300 p-4 mb-4 rounded-sm">
            <div className="grid grid-cols-12 gap-y-2 gap-x-4">
              <div className="col-span-1 font-semibold">(1.1)</div>
              <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-2">
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">Aadhar Card No.</span>
                  <span>{particulars.primary.aadharCardNo}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">S/O</span>
                  <span>{particulars.primary.so}</span>
                </div>

                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">Name</span>
                  <span>{particulars.primary.name}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">Name the Relation</span>
                  <span>{particulars.primary.relation}</span>
                </div>
              </div>

              {/* Sub-block 1.1.1 */}
              <div className="col-span-1 font-semibold mt-2">(1.1.1)</div>
              <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">Army No.</span>
                  <span>{particulars.primary.armyNo}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">Rank</span>
                  <span>{particulars.primary.rank}</span>
                </div>

                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">Name</span>
                  <span>{particulars.primary.name}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">Unit</span>
                  <span>{particulars.primary.unit}</span>
                </div>

                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">FMN</span>
                  <span>{particulars.primary.fmn}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">Command</span>
                  <span>{particulars.primary.command}</span>
                </div>

                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">Address</span>
                  <span>{particulars.primary.address}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr]">
                  <span className="font-semibold">I Card No.</span>
                  <span>{particulars.primary.iCardNo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 1.2 Secondary Person (Optional) */}
          {particulars.secondary && (
            <div className="border border-gray-300 p-4 mb-4 rounded-sm">
              <div className="grid grid-cols-12 gap-y-2 gap-x-4">
                <div className="col-span-1 font-semibold">(1.2)</div>
                <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-2">
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Aadhar Card No.</span>
                    <span>{particulars.secondary.aadharCardNo}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">S/O</span>
                    <span>{particulars.secondary.so}</span>
                  </div>

                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Name</span>
                    <span>{particulars.secondary.name}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Name the Relation</span>
                    <span>{particulars.secondary.relation}</span>
                  </div>
                </div>

                <div className="col-span-1 font-semibold mt-2">(1.2.1)</div>
                <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Army No.</span>
                    <span>{particulars.secondary.armyNo}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Rank</span>
                    <span>{particulars.secondary.rank}</span>
                  </div>

                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Name</span>
                    <span>{particulars.secondary.name}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Unit</span>
                    <span>{particulars.secondary.unit}</span>
                  </div>

                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">FMN</span>
                    <span>{particulars.secondary.fmn}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Command</span>
                    <span>{particulars.secondary.command}</span>
                  </div>

                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Address</span>
                    <span>{particulars.secondary.address}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">I Card No.</span>
                    <span>{particulars.secondary.iCardNo}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1.3 Vehicle Details (Optional) */}
          {particulars.vehicle && (
            <div className="border border-gray-300 p-4 mb-4 rounded-sm">
              <div className="grid grid-cols-12 gap-y-2 gap-x-4 items-center">
                <div className="col-span-1 font-semibold">(1.3)</div>
                <div className="col-span-11 grid grid-cols-2 gap-x-8">
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">DD Veh. BA No.</span>
                    <span>{particulars.vehicle.baNo}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-semibold">Make & Take</span>
                    <span>{particulars.vehicle.makeAndTake}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
        <div className="mb-6">
          <h2 className="font-bold underline mb-4">2. &nbsp;&nbsp; STATEMENT OF EVIDENCE/OCCURRENCE:</h2>

          <div className="mb-4">
            <p className="mb-3 font-medium">On-Duty Details of Witnessing Official:</p>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 ml-4">
              <div className="grid grid-cols-[150px_1fr]">
                <span className="font-semibold text-xs">(2.1) &nbsp; Date of Duty</span>
                <span>{occurrence.dateOfDuty}</span>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <span className="font-semibold text-xs">(2.2) &nbsp; Duty Time</span>
                <span>{occurrence.dutyTime}</span>
              </div>

              <div className="grid grid-cols-[150px_1fr]">
                <span className="font-semibold text-xs">(2.3) &nbsp; Duty Location</span>
                <span>{occurrence.dutyLocation}</span>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <span className="font-semibold text-xs">(2.4.1) Name of Witnessing Official</span>
                <span>{occurrence.nameOfWitnessingOfficial1}</span>
              </div>

              <div className="grid grid-cols-[150px_1fr]">
                <span className="font-semibold text-xs">(2.4.2) Name of Witnessing Official</span>
                <span>{occurrence.nameOfWitnessingOfficial2}</span>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <span className="font-semibold text-xs">(2.4.3) Name of Witnessing Official</span>
                <span>{occurrence.nameOfWitnessingOfficial3}</span>
              </div>

              <div className="grid grid-cols-[150px_1fr]">
                <span className="font-semibold text-xs">(2.5) &nbsp; Time of Offence</span>
                <span>{occurrence.timeOfOffence}</span>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <span className="font-semibold text-xs">(2.6) &nbsp; Location of Offence</span>
                <span>{occurrence.locationOfOffence}</span>
              </div>
            </div>
          </div>

          <div className="text-justify ml-8 text-gray-800 leading-relaxed">
            <span className="font-semibold mr-2">(2.5)</span>
            {occurrence.statement}
          </div>
        </div>

        {/* 3. OFFENCE COMMITTED */}
        <div className="mb-8">
          <h2 className="font-bold underline mb-4">3. &nbsp;&nbsp; OFFENCE COMMITTED/ORDERS CONTRAVENED:</h2>
          <div className="ml-4">
            <div className="flex mb-2">
              <span className="font-semibold mr-2">(3.1) Offence Type</span>
              <span>{offence.type}</span>
            </div>
            <div className="ml-8 mb-2">
              <span className="font-bold mr-2">Ref :-</span>
              <span className="mr-2">(i.)</span>
              <span>{offence.ref1}</span>
            </div>
            <div className="ml-[70px] mb-4">
              <span className="mr-2">(ii.)</span>
              <span>{offence.ref2}</span>
            </div>
            <p className="text-justify leading-relaxed">
              {offence.description}
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-start mt-12 mb-12">
          <div className="w-64">
            <div className="font-bold underline mb-4">Sig of Witness &nbsp;&nbsp;&nbsp; _______________</div>
            <div className="grid grid-cols-[60px_1fr] gap-y-1">
              <span className="font-bold">Army No.</span>
              <span>{witnessSig.armyNo}</span>
              <span className="font-bold">Rank</span>
              <span>{witnessSig.rank}</span>
              <span className="font-bold">Name</span>
              <span>{witnessSig.name}</span>
              <span className="font-bold">Unit</span>
              <span>{witnessSig.unit}</span>
            </div>
          </div>
          <div className="w-64">
            <div className="font-bold mb-4 text-left">Sig of MP JCO/NCO</div>
            <div className="grid grid-cols-[60px_1fr] gap-y-1">
              <span className="font-bold">Army No.</span>
              <span>{mpSig.armyNo}</span>
              <span className="font-bold">Rank</span>
              <span>{mpSig.rank}</span>
              <span className="font-bold">Name</span>
              <span>{mpSig.name}</span>
              <span className="font-bold">Unit</span>
              <span>{mpSig.unit}</span>
            </div>
          </div>
        </div>

        {/* Remarks Footer */}
        <div className="mt-8 border-t-0 pt-4 flex-1">
          <h3 className="text-center font-bold underline mb-4">REMARKS OF CO/2IC PROVOST UNIT</h3>
          <p className="text-justify mb-8 ml-8">
            {remarks.text}
          </p>

          <div className="grid grid-cols-[80px_1fr] gap-y-2 ml-4">
            <div className="font-bold">Station :</div>
            <div>{remarks.station}</div>
            <div className="font-bold">Dated :</div>
            <div>{remarks.dated}</div>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="mt-8 text-center font-bold">
          <div className="text-sm print:hidden">-1-</div>
        </div>
      </div>
    </div>
  );
};

export default MilitaryPoliceReport;
