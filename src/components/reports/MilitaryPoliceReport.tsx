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
    <div className={`font-[Arial] text-[#0A0A0A] bg-gray-500/10 p-8 flex flex-col gap-8 print:block print:p-0 print:gap-0 ${className || ''}`}>

      {/* Print Only: Fixed Global Page Numbering */}
      <div className="hidden print:block fixed top-0 w-full text-center font-bold text-sm page-number mt-4 z-50"></div>

      {/* ==================== PAGE 1 ==================== */}
      <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-[48px]" style={{ pageBreakAfter: 'always' }}>

        {/* Header */}
        <div className="flex flex-col mb-8">
          <div className="text-right font-bold text-xs mb-4 underline">In Lieu Of IAFP-1479</div>
          <h1 className="text-center font-bold text-sm text-[#0A0A0A] mb-1">
            MILITARY POLICE REPORT
          </h1>
          <h1 className="text-center font-bold text-sm text-[#0A0A0A] mb-8">
            (GEN AND TRAFFIC OFFENCE)
          </h1>
          <div className="flex justify-between items-end">
            <div className="text-xs">Report No- {reportNo}</div>
            <div className="text-xs">Report Date- {reportDate}</div>
          </div>
        </div>

        {/* 1. PARTICULARS */}
        {(Object.values(particulars.primary).some(val => val) || particulars.secondary || particulars.vehicle) && (
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-4">1. &nbsp;&nbsp; <span className="underline">PARTICULARS:</span></h2>

            {/* 1.1 Primary Person */}
            <div className="border border-gray-300 mb-4">
              <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                <div className="text-xs">(1.1)</div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-bold text-xs">Aadhar Card No.</span>
                    <span className="text-xs">{particulars.primary.aadharCardNo}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr]">
                    <span className="font-bold text-xs">S/O</span>
                    <span className="text-xs">{particulars.primary.so}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-bold text-xs">Driver Name</span>
                    <span className="text-xs">{particulars.primary.name}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr]">
                    <span className="font-bold text-xs">Name the Relation</span>
                    <span className="text-xs">{particulars.primary.relation}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 mx-4"></div>

              <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                <div className="text-xs">(1.1.1)</div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-bold text-xs">Army No.</span>
                    <span className="text-xs">{particulars.primary.armyNo}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr]">
                    <span className="font-bold text-xs">Rank</span>
                    <span className="text-xs">{particulars.primary.rank}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-bold text-xs">Name</span>
                    <span className="text-xs">{particulars.primary.name}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr]">
                    <span className="font-bold text-xs">Unit</span>
                    <span className="text-xs">{particulars.primary.unit}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-bold text-xs">FMN</span>
                    <span className="text-xs">{particulars.primary.fmn}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr]">
                    <span className="font-bold text-xs">Command</span>
                    <span className="text-xs">{particulars.primary.command}</span>
                  </div>
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-bold text-xs">Address</span>
                    <span className="text-xs">{particulars.primary.address}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr]">
                    <span className="font-bold text-xs">I Card No.</span>
                    <span className="text-xs">{particulars.primary.iCardNo}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1.2 Secondary Person */}
            {particulars.secondary && (
              <div className="border border-gray-300 mb-4">
                <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                  <div className="text-xs">(1.2)</div>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                    <div className="grid grid-cols-[110px_1fr]">
                      <span className="font-bold text-xs">Aadhar Card No.</span>
                      <span className="text-xs">{particulars.secondary.aadharCardNo}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr]">
                      <span className="font-bold text-xs">S/O</span>
                      <span className="text-xs">{particulars.secondary.so}</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr]">
                      <span className="font-bold text-xs">Co-Driver Name</span>
                      <span className="text-xs">{particulars.secondary.name}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr]">
                      <span className="font-bold text-xs">Name the Relation</span>
                      <span className="text-xs">{particulars.secondary.relation}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 mx-4"></div>

                <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                  <div className="text-xs">(1.2.1)</div>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                    <div className="grid grid-cols-[110px_1fr]">
                      <span className="font-bold text-xs">Army No.</span>
                      <span className="text-xs">{particulars.secondary.armyNo}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr]">
                      <span className="font-bold text-xs">Rank</span>
                      <span className="text-xs">{particulars.secondary.rank}</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr]">
                      <span className="font-bold text-xs">Name</span>
                      <span className="text-xs">{particulars.secondary.name}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr]">
                      <span className="font-bold text-xs">Unit</span>
                      <span className="text-xs">{particulars.secondary.unit}</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr]">
                      <span className="font-bold text-xs">FMN</span>
                      <span className="text-xs">{particulars.secondary.fmn}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr]">
                      <span className="font-bold text-xs">Command</span>
                      <span className="text-xs">{particulars.secondary.command}</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr]">
                      <span className="font-bold text-xs">Address</span>
                      <span className="text-xs">{particulars.secondary.address}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr]">
                      <span className="font-bold text-xs">I Card No.</span>
                      <span className="text-xs">{particulars.secondary.iCardNo}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1.3 Vehicle */}
            {particulars.vehicle && (
              <div className="border border-gray-300 p-4 mb-4 grid grid-cols-[40px_1fr] gap-4">
                <div className="text-xs">(1.3)</div>
                <div className="grid grid-cols-2 gap-x-12">
                  <div className="grid grid-cols-[110px_1fr]">
                    <span className="font-bold text-xs">DD Veh. BA No.</span>
                    <span className="text-xs">{particulars.vehicle.baNo}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr]">
                    <span className="font-bold text-xs">Make & Take</span>
                    <span className="text-xs">{particulars.vehicle.makeAndTake}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
        <div className="mb-6">
          <h2 className="font-bold text-xs mb-4">2. &nbsp;&nbsp; <span className="underline">STATEMENT OF EVIDENCE/OCCURRENCE:</span></h2>

          <div className="border border-gray-300 mb-6">
            {/* Row 2.1 */}
            <div className="grid grid-cols-2">
              <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
                <span className="text-xs">(2.1)</span>
                <span className="text-xs font-bold">Date of Duty</span>
                <span className="text-xs">{occurrence.dateOfDuty}</span>
              </div>
              <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
                <span className="text-xs font-bold">Duty Time</span>
                <span className="text-xs">{occurrence.dutyTime}</span>
              </div>
            </div>

            {/* Row Duty Location */}
            <div className="grid grid-cols-2 border-b border-gray-300">
              <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
                <span className="text-xs"></span>
                <span className="text-xs font-bold">Duty Location</span>
                <span className="text-xs">{occurrence.dutyLocation}</span>
              </div>
              <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
                {/* Empty right side */}
              </div>
            </div>

            {/* Row 2.2 */}
            <div className="grid grid-cols-2 border-b border-gray-300">
              <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
                <span className="text-xs">(2.2)</span>
                <span className="text-xs font-bold">Name of MP <br />Witnessing</span>
                <span className="text-xs">{occurrence.nameOfWitnessingOfficial1}</span>
              </div>
              <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
                <span className="text-xs font-bold">Rank</span>
                <span className="text-xs">Hav (MP)</span>
              </div>
            </div>

            {/* Row 2.2.1 */}
            <div className="grid grid-cols-2 border-b border-gray-300">
              <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
                <span className="text-xs">(2.2.1)</span>
                <span className="text-xs font-bold">Name of MP <br />Witnessing</span>
                <span className="text-xs">{occurrence.nameOfWitnessingOfficial2}</span>
              </div>
              <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
                <span className="text-xs font-bold">Rank</span>
                <span className="text-xs">Hav (MP)</span>
              </div>
            </div>

            {/* Row 2.2.2 */}
            <div className="grid grid-cols-2 border-b border-gray-300">
              <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
                <span className="text-xs">(2.2.2)</span>
                <span className="text-xs font-bold">Name of MP <br />Witnessing</span>
                <span className="text-xs">{occurrence.nameOfWitnessingOfficial3}</span>
              </div>
              <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
                <span className="text-xs font-bold">Rank</span>
                <span className="text-xs">Hav (MP)</span>
              </div>
            </div>

            {/* Row 2.3 */}
            <div className="grid grid-cols-2">
              <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
                <span className="text-xs">(2.3)</span>
                <span className="text-xs font-bold">Time of <br />Offence</span>
                <span className="text-xs">{occurrence.timeOfOffence}</span>
              </div>
              <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
                <span className="text-xs font-bold">Location of <br />Offence</span>
                <span className="text-xs">{occurrence.locationOfOffence}</span>
              </div>
            </div>
          </div>


          <div className="flex gap-4 mb-4">
            <div className="text-xs min-w-[30px]">(2.4)</div>
            <div className="text-xs text-justify leading-relaxed">
              {occurrence.statement}
            </div>
          </div>
        </div>

        {/* 3. OFFENCE COMMITTED */}
        <div className="mb-8 pl-2">
          <h2 className="font-bold text-xs mb-4">3. &nbsp;&nbsp; <span className="underline">OFFENCE COMMITTED/ORDERS CONTRAVENED:</span></h2>

          <div className="grid grid-cols-[40px_1fr] gap-y-2 mb-4">
            {/* 3.1 */}
            <div className="text-xs">(3.1)</div>
            <div className="text-xs">
              <span className="font-bold">Offence Type</span> &nbsp; {offence.type}
              <div className="flex mt-1">
                <span className="font-bold mr-2">Ref :-</span>
                <div className="flex flex-col gap-1">
                  <div className="flex">
                    <span className="mr-2">(i.)</span>
                    <span>{offence.ref1}</span>
                  </div>
                  <div className="flex">
                    <span className="mr-2">(ii.)</span>
                    <span>{offence.ref2}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3.2 */}
            <div className="text-xs">(3.2)</div>
            <div className="text-xs text-justify leading-relaxed">
              {offence.description}
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-start mb-8 gap-4">
          {/* Witness Signature */}
          <div className=""> { }
            <div className="flex items-end mb-2">
              <span className="font-bold text-xs mr-2">Sig of Witness</span>
              <div className="border-b border-black w-32"></div>
            </div>
            <div className="space-y-1">
              <div className="flex">
                <span className="font-bold text-xs w-[60px]">Army No.</span>
                <span className="text-xs">{witnessSig.armyNo}</span>
              </div>
              <div className="flex">
                <span className="font-bold text-xs w-[60px]">Rank</span>
                <span className="text-xs">{witnessSig.rank}</span>
              </div>
              <div className="flex">
                <span className="font-bold text-xs w-[60px]">Name</span>
                <span className="text-xs">{witnessSig.name}</span>
              </div>
              <div className="flex">
                <span className="font-bold text-xs w-[60px]">Unit</span>
                <span className="text-xs">{witnessSig.unit}</span>
              </div>
            </div>
          </div>

          {/* MP Signature */}
          <div className="">
            <div className="mb-2">
              <span className="font-bold text-xs">Sig of MP JCO/NCO</span>
            </div>
            <div className="space-y-1">
              <div className="flex">
                <span className="font-bold text-xs w-[60px]">Army No.</span>
                <span className="text-xs">{mpSig.armyNo}</span>
              </div>
              <div className="flex">
                <span className="font-bold text-xs w-[60px]">Rank</span>
                <span className="text-xs">{mpSig.rank}</span>
              </div>
              <div className="flex">
                <span className="font-bold text-xs w-[60px]">Name</span>
                <span className="text-xs">{mpSig.name}</span>
              </div>
              <div className="flex">
                <span className="font-bold text-xs w-[60px]">Unit</span>
                <span className="text-xs">{mpSig.unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Footer */}
        <div className="mt-8">
          <h3 className="text-center font-bold underline mb-4 text-xs">REMARKS OF CO/2IC PROVOST UNIT</h3>
          <p className="text-justify text-xs mb-8 indent-8 leading-relaxed">
            {remarks.text}
          </p>

          <div className="flex flex-col gap-1">
            <div className="flex">
              <span className="font-bold text-xs w-[60px]">Station:</span>
              <span className="text-xs">{remarks.station}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-xs w-[60px]">Dated:</span>
              <span className="text-xs">{remarks.dated}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MilitaryPoliceReport;
