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
      <div className="max-w-[210mm] w-full mx-auto bg-white p-12 min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

        {/* Header */}
        <div className="flex flex-col mb-8">
          <div className="text-right font-bold text-xs mb-4">In Lieu Of IAFP-1479</div>
          <h1 className="text-center font-bold text-xs text-[#0A0A0A] mb-6">
            MILITARY POLICE REPORT<br />(GEN AND TRAFFIC OFFENCE)
          </h1>
          <div className="flex justify-between items-end">
            <div className="font-normal text-xs">Report No- {reportNo}</div>
            <div className="font-normal text-xs">Report Date- {reportDate}</div>
          </div>
        </div>

        {/* 1. PARTICULARS */}
        <div className="mb-6">
          <h2 className="font-bold text-xs mb-4">1. &nbsp;&nbsp; <span className="underline">PARTICULARS:</span></h2>

          {/* 1.1 Primary Person */}
          <div className="border border-gray-300 mb-4 rounded-sm bg-gray-50/30">
            <div className="p-4 pb-2">
              <div className="grid grid-cols-12 gap-x-4">
                <div className="col-span-1 text-xs text-[#0A0A0A]">(1.1)</div>
                <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-1">
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">Aadhar Card No.</span>
                    <span className="text-xs">{particulars.primary.aadharCardNo}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">S/O</span>
                    <span className="text-xs">{particulars.primary.so}</span>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">Name</span>
                    <span className="text-xs">{particulars.primary.name}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">Name the Relation</span>
                    <span className="text-xs">{particulars.primary.relation}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-t border-gray-300 mx-4 opacity-50" />

            {/* Sub-block 1.1.1 */}
            <div className="p-4 pt-2">
              <div className="grid grid-cols-12 gap-x-4">
                <div className="col-span-1 text-xs text-[#0A0A0A]">(1.1.1)</div>
                <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-1">
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">Army No.</span>
                    <span className="text-xs">{particulars.primary.armyNo}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">Rank</span>
                    <span className="text-xs">{particulars.primary.rank}</span>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">Name</span>
                    <span className="text-xs">{particulars.primary.name}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">Unit</span>
                    <span className="text-xs">{particulars.primary.unit}</span>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">FMN</span>
                    <span className="text-xs">{particulars.primary.fmn}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">Command</span>
                    <span className="text-xs">{particulars.primary.command}</span>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">Address</span>
                    <span className="text-xs">{particulars.primary.address}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-xs text-[#0A0A0A]">I Card No.</span>
                    <span className="text-xs">{particulars.primary.iCardNo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1.2 Secondary Person (Optional) */}
          {particulars.secondary && (
            <div className="border border-gray-300 mb-4 rounded-sm bg-gray-50/30">
              <div className="p-4 pb-2">
                <div className="grid grid-cols-12 gap-x-4">
                  <div className="col-span-1 text-[#0A0A0A] text-xs">(1.2)</div>
                  <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-1">
                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">Aadhar Card No.</span>
                      <span className="text-xs">{particulars.secondary.aadharCardNo}</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">S/O</span>
                      <span className="text-xs">{particulars.secondary.so}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">Name</span>
                      <span className="text-xs">{particulars.secondary.name}</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">Name the Relation</span>
                      <span className="text-xs">{particulars.secondary.relation}</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-t border-gray-300 mx-4 opacity-50" />

              <div className="p-4 pt-2">
                <div className="grid grid-cols-12 gap-x-4">
                  <div className="col-span-1 text-[#0A0A0A] text-xs">(1.2.1)</div>
                  <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-1">
                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">Army No.</span>
                      <span className="text-xs">{particulars.secondary.armyNo}</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">Rank</span>
                      <span className="text-xs">{particulars.secondary.rank}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">Name</span>
                      <span className="text-xs">{particulars.secondary.name}</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">Unit</span>
                      <span className="text-xs">{particulars.secondary.unit}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">FMN</span>
                      <span className="text-xs">{particulars.secondary.fmn}</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">Command</span>
                      <span className="text-xs">{particulars.secondary.command}</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">Address</span>
                      <span className="text-xs">{particulars.secondary.address}</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-baseline">
                      <span className="font-bold text-[#0A0A0A] text-xs">I Card No.</span>
                      <span className="text-xs">{particulars.secondary.iCardNo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1.3 Vehicle Details (Optional) */}
          {particulars.vehicle && (
            <div className="border border-gray-300 mb-4 rounded-sm bg-gray-50/30 p-4">
              <div className="grid grid-cols-12 gap-x-4 items-center">
                <div className="col-span-1 text-[#0A0A0A] text-xs">(1.3)</div>
                <div className="col-span-11 grid grid-cols-2 gap-x-8">
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-[#0A0A0A] text-xs">DD Veh. BA No.</span>
                    <span className="text-xs">{particulars.vehicle.baNo}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-baseline">
                    <span className="font-bold text-[#0A0A0A] text-xs">Make & Take</span>
                    <span className="text-xs">{particulars.vehicle.makeAndTake}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
        <div className="mb-6">
          <h2 className="font-bold text-xs mb-4">2. &nbsp;&nbsp; <span className="text-[#0A0A0A] underline">STATEMENT OF EVIDENCE/OCCURRENCE:</span></h2>

          <div className="mb-4">
            <p className="mb-3 font-normal text-xs">On-Duty Details of Witnessing Official:</p>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 ml-4">
              <div className="grid grid-cols-[150px_1fr]">
                <span className="text-xs">(2.1) &nbsp; <span className="font-bold ">Date of Duty</span></span>

                <span className="text-xs">{occurrence.dateOfDuty}</span>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <span className="text-xs">(2.2) &nbsp; <span className="font-bold">Duty Time</span></span>
                <span className="text-xs">{occurrence.dutyTime}</span>
              </div>

              <div className="grid grid-cols-[150px_1fr]">
                <span className="text-xs">(2.3) &nbsp; <span className="font-bold">Duty Location</span></span>
                <span className="text-xs">{occurrence.dutyLocation}</span>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <span className="text-xs">(2.4.1) &nbsp; <span className="font-bold">Name of Witnessing Official</span></span>
                <span className="text-xs">{occurrence.nameOfWitnessingOfficial1}</span>
              </div>

              <div className="grid grid-cols-[150px_1fr]">
                <span className="text-xs">(2.4.2) &nbsp; <span className="font-bold">Name of Witnessing Official</span></span>
                <span className="text-xs">{occurrence.nameOfWitnessingOfficial2}</span>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <span className="text-xs">(2.4.3) &nbsp; <span className="font-bold">Name of Witnessing Official</span></span>
                <span className="text-xs">{occurrence.nameOfWitnessingOfficial3}</span>
              </div>

              <div className="grid grid-cols-[150px_1fr]">
                <span className="text-xs">(2.5) &nbsp; <span className="font-bold">Time of Offence</span></span>
                <span className="text-xs">{occurrence.timeOfOffence}</span>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <span className="text-xs">(2.6) &nbsp; <span className="font-bold">Location of Offence</span></span>
                <span className="text-xs">{occurrence.locationOfOffence}</span>
              </div>
            </div>
          </div>

          <div className="text-justify ml-4 text-[#0A0A0A] text-xs leading-relaxed">
            <span className="mr-2 text-xs">(2.7)</span>
            {occurrence.statement}
          </div>
        </div>

        {/* 3. OFFENCE COMMITTED */}
        <div className="mb-8">
          <h2 className="font-bold  mb-4 text-xs">3. &nbsp;&nbsp; <span className="text-[#0A0A0A] underline">OFFENCE COMMITTED/ORDERS CONTRAVENED:</span></h2>
          <div className="ml-4">
            <div className="flex mb-2">
              <span className=" mr-2 text-xs">(3.1)  <span className='font-bold'>Offence Type</span></span>
              <span className="text-xs">{offence.type}</span>
            </div>
            <div className="ml-8 mb-2">
              <span className="font-bold mr-2 text-xs">Ref :-</span>
              <span className="mr-2 text-xs">(i.)</span>
              <span className="text-xs">{offence.ref1}</span>
            </div>
            <div className="ml-[70px] mb-4">
              <span className="mr-2 text-xs">(ii.)</span>
              <span className="text-xs">{offence.ref2}</span>
            </div>
            <div className="flex mb-2">
              <span className=" mr-2 text-xs">(3.2)  <span className="text-justify leading-relaxed text-xs ml-4">
                {offence.description}
              </span>
              </span>
            </div>


          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-start mb-5">
          <div className="w-64">
            <div className="font-bold text-xs mb-4">Sig of Witness &nbsp;&nbsp;&nbsp; _______________</div>
            <div className="grid grid-cols-[60px_1fr] gap-y-1">
              <span className="font-bold text-xs">Army No.</span>
              <span className="text-xs">{witnessSig.armyNo}</span>
              <span className="font-bold text-xs">Rank</span>
              <span className="text-xs">{witnessSig.rank}</span>
              <span className="font-bold text-xs">Name</span>
              <span className="text-xs">{witnessSig.name}</span>
              <span className="font-bold text-xs">Unit</span>
              <span className="text-xs">{witnessSig.unit}</span>
            </div>
          </div>
          <div className="w-64">
            <div className="font-bold mb-4 text-left text-xs">Sig of MP JCO/NCO</div>
            <div className="grid grid-cols-[60px_1fr] gap-y-1">
              <span className="font-bold text-xs">Army No.</span>
              <span className="text-xs">{mpSig.armyNo}</span>
              <span className="font-bold text-xs">Rank</span>
              <span className="text-xs">{mpSig.rank}</span>
              <span className="font-bold text-xs">Name</span>
              <span className="text-xs">{mpSig.name}</span>
              <span className="font-bold text-xs">Unit</span>
              <span className="text-xs" >{mpSig.unit}</span>
            </div>
          </div>
        </div>

        {/* Remarks Footer */}
        <div className="mt-2 border-t-0 pt-4 flex-1">
          <h3 className="text-center font-bold underline mb-4 text-xs">REMARKS OF CO/2IC PROVOST UNIT</h3>
          <p className="text-justify mb-8 ml-8 text-xs">
            {remarks.text}
          </p>

          <div className="grid grid-cols-[80px_1fr] gap-y-2 ml-4">
            <div className="font-bold text-xs">Station :</div>
            <div className="text-xs">{remarks.station}</div>
            <div className="font-bold text-xs">Dated :</div>
            <div className="text-xs">{remarks.dated}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilitaryPoliceReport;
