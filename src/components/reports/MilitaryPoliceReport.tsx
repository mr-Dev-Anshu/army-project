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
    witnessingMps: { name: string; rank: string }[]; // 2.4 - Dynamic List
    timeOfOffence: string;
    locationOfOffence: string;
    statement: string; // 2.5
  };
  offence: {
    types: string[]; // 3.1 - Dynamic List
    refs: string[]; // Dynamic References
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
  vehicleNumber: string;
}

interface SignatureDetails {
  armyNo: string;
  rank: string;
  name: string;
  unit: string;
}

const DataField = ({ label, value, className = "grid-cols-[110px_1fr]" }: { label: React.ReactNode; value?: string; className?: string }) => {
  if (!value || value === "N/A") return null;
  return (
    <div className={`grid ${className}`}>
      <span className="font-bold text-xs flex items-center">{label}</span>
      <span className="text-xs flex items-center">{value}</span>
    </div>
  );
};

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
    <div id='mp-report' className={`font-[Arial] text-[#0A0A0A] flex flex-col gap-8 items-center print:block print:gap-0 ${className || ''}`}>

      {/* ==================== PAGE 1 ==================== */}
      < div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col justify-between" style={{ pageBreakAfter: 'always' }}>

        {/* Page 1 Content Wrapper */}
        <div>
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
          {
            (Object.values(particulars.primary).some(val => val) || particulars.secondary || particulars.vehicle) && (
              <div className="mb-6">
                <h2 className="font-bold text-xs mb-4">1. &nbsp;&nbsp; <span className="underline">PARTICULARS:</span></h2>

                {/* 1.1 Primary Person */}
                <div className="border border-gray-300 mb-4">
                  <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                    <div className="text-xs">(1.1)</div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                      <DataField label="Aadhar Card No." value={particulars.primary.aadharCardNo} />
                      <DataField label="S/O" value={particulars.primary.so} className="grid-cols-[120px_1fr]" />
                      <DataField label="Driver Name" value={particulars.primary.name} />
                      <DataField label="Name the Relation" value={particulars.primary.relation} className="grid-cols-[120px_1fr]" />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mx-4"></div>

                  <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                    <div className="text-xs">(1.1.1)</div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                      <DataField label="Army No." value={particulars.primary.armyNo} />
                      <DataField label="Rank" value={particulars.primary.rank} className="grid-cols-[120px_1fr]" />
                      <DataField label="Name" value={particulars.primary.name} />
                      <DataField label="Unit" value={particulars.primary.unit} className="grid-cols-[120px_1fr]" />
                      <DataField label="FMN" value={particulars.primary.fmn} />
                      <DataField label="Command" value={particulars.primary.command} className="grid-cols-[120px_1fr]" />
                      <DataField label="Address" value={particulars.primary.address} />
                      <DataField label="I Card No." value={particulars.primary.iCardNo} className="grid-cols-[120px_1fr]" />
                    </div>
                  </div>
                </div>

                {/* 1.2 Secondary Person */}
                {particulars.secondary && (
                  <div className="border border-gray-300 mb-4">
                    <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                      <div className="text-xs">(1.2)</div>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                        <DataField label="Aadhar Card No." value={particulars.secondary.aadharCardNo} />
                        <DataField label="S/O" value={particulars.secondary.so} className="grid-cols-[120px_1fr]" />
                        <DataField label="Co-Driver Name" value={particulars.secondary.name} />
                        <DataField label="Name the Relation" value={particulars.secondary.relation} className="grid-cols-[120px_1fr]" />
                      </div>
                    </div>

                    <div className="border-t border-gray-100 mx-4"></div>

                    <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                      <div className="text-xs">(1.2.1)</div>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                        <DataField label="Army No." value={particulars.secondary.armyNo} />
                        <DataField label="Rank" value={particulars.secondary.rank} className="grid-cols-[120px_1fr]" />
                        <DataField label="Name" value={particulars.secondary.name} />
                        <DataField label="Unit" value={particulars.secondary.unit} className="grid-cols-[120px_1fr]" />
                        <DataField label="FMN" value={particulars.secondary.fmn} />
                        <DataField label="Command" value={particulars.secondary.command} className="grid-cols-[120px_1fr]" />
                        <DataField label="Address" value={particulars.secondary.address} />
                        <DataField label="I Card No." value={particulars.secondary.iCardNo} className="grid-cols-[120px_1fr]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 1.3 Vehicle */}
                {particulars.vehicle && (
                  <div className="border border-gray-300 p-4 mb-4 grid grid-cols-[40px_1fr] gap-4">
                    <div className="text-xs">(1.3)</div>
                    <div className="grid grid-cols-2 gap-x-12">
                      <DataField label={particulars.vehicle.vehicleNumber} value={particulars.vehicle.baNo} />
                      <DataField label="Make & Take" value={particulars.vehicle.makeAndTake} className="grid-cols-[120px_1fr]" />
                    </div>
                  </div>
                )}

              </div>
            )
          }

          {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-4">2. &nbsp;&nbsp; <span className="underline">STATEMENT OF EVIDENCE/OCCURRENCE:</span></h2>

            <div className="border border-gray-300 mb-6">
              {/* Row 2.1 */}
              <div className="grid grid-cols-2">
                <div className="p-2 pl-4 grid grid-cols-[45px_1fr]">
                  <div className="grid grid-cols-[45px_140px_1fr] items-center">
                    <span className="text-xs">(2.1)</span>
                    <div className="col-span-2">
                      <DataField label="Date of Duty" value={occurrence.dateOfDuty} className="grid-cols-[140px_1fr]" />
                    </div>
                  </div>
                </div>
                <div className="p-2 pl-4">
                  <DataField label="Duty Time" value={occurrence.dutyTime} className="grid-cols-[130px_1fr]" />
                </div>
              </div>

              {/* Row Duty Location */}
              <div className={`grid grid-cols-2 border-b border-gray-300 ${(!occurrence.dutyLocation || occurrence.dutyLocation === 'N/A') ? 'hidden' : ''}`}>
                <div className="p-2 pl-4 grid grid-cols-[45px_1fr]">
                  <div className="grid grid-cols-[45px_140px_1fr] items-center">
                    <span className="text-xs"></span>
                    <div className="col-span-2">
                      <DataField label="Duty Location" value={occurrence.dutyLocation} className="grid-cols-[140px_1fr]" />
                    </div>
                  </div>
                </div>
                <div className="p-2 pl-4"></div>
              </div>

              {/* Row 2.2 */}
              {/* Dynamic Witness Rows */}
              {occurrence.witnessingMps && occurrence.witnessingMps.length > 0 ? (
                occurrence.witnessingMps.map((mp, index) => (
                  <div key={index} className="grid grid-cols-2 border-b border-gray-300">
                    <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
                      <span className="text-xs">
                        {index === 0 ? "(2.2)" : `(2.2.${index})`}
                      </span>
                      <span className="text-xs font-bold">Name of MP <br />Witnessing</span>
                      <span className="text-xs">{mp.name}</span>
                    </div>
                    <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
                      <span className="text-xs font-bold">Rank</span>
                      <span className="text-xs">{mp.rank}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-2 border-b border-gray-300">
                  <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
                    <span className="text-xs">(2.2)</span>
                    <span className="text-xs font-bold">Name of MP <br />Witnessing</span>
                    <span className="text-xs">N/A</span>
                  </div>
                  <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
                    <span className="text-xs font-bold">Rank</span>
                    <span className="text-xs">N/A</span>
                  </div>
                </div>
              )}

              {/* Row 2.3 */}
              <div className="grid grid-cols-2">
                <div className="p-2 pl-4 grid grid-cols-[45px_1fr]">
                  <div className="grid grid-cols-[45px_140px_1fr] items-center">
                    <span className="text-xs">(2.3)</span>
                    <div className="col-span-2">
                      <DataField label={<>Time of <br />Offence</>} value={occurrence.timeOfOffence} className="grid-cols-[140px_1fr]" />
                    </div>
                  </div>
                </div>
                <div className="p-2 pl-4">
                  <DataField label={<>Location of <br />Offence</>} value={occurrence.locationOfOffence} className="grid-cols-[130px_1fr]" />
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
        </div >

        {/* Page 1 Footer */}
        < div className="text-center font-bold text-xs mb-8" > RESTRICTED</div >
      </div >


      {/* ==================== PAGE 2 ==================== */}
      < div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col justify-between" style={{ pageBreakBefore: 'always' }}>

        {/* Page 2 Content Wrapper */}
        <div>
          {/* Page 2 Header */}
          <div className="text-center font-bold text-xs mb-1">-2-</div>
          <div className="text-center font-bold text-xs mb-8">RESTRICTED</div>

          {/* 3. OFFENCE COMMITTED */}
          <div className="mb-8 pl-2">
            <h2 className="font-bold text-xs mb-4">3. &nbsp;&nbsp; <span className="underline">OFFENCE COMMITTED/ORDERS CONTRAVENED:</span></h2>

            <div className="grid grid-cols-[40px_1fr] gap-y-2 mb-4">
              {/* 3.1 - Types */}
              <div className="text-xs">(3.1)</div>
              <div className="text-xs">
                <span className="font-bold">Offence Type</span> &nbsp;
                <span className="leading-relaxed">
                  {offence.types ? offence.types.filter(Boolean).join(", ") : "N/A"}
                </span>

                {/* References List */}
                <div className="flex mt-1">
                  <span className="font-bold mr-2 whitespace-nowrap">Ref :-</span>
                  <div className="flex flex-col gap-1 w-full">
                    {offence.refs && offence.refs.length > 0 ? (
                      offence.refs.map((ref, i) => (
                        <div className="flex" key={i}>
                          <span className="mr-2 min-w-[20px]">{`${i + 1}.`}</span>
                          <span className="leading-tight">{ref}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex">
                        <span className="mr-2">(i.)</span>
                        <span>N/A</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3.2 - Description */}
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
            {remarks.text && <p className="text-justify text-xs mb-8 indent-8 leading-relaxed">
              {remarks.text}
            </p>}

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
        </div >

        {/* Page 2 Footer */}
        < div className="text-center font-bold text-xs mb-8" > RESTRICTED</div >
      </div >
    </div >
  );
};

export default MilitaryPoliceReport;
