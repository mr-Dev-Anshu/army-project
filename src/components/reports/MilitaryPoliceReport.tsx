


import React from "react";

export interface MilitaryPoliceReportProps {
  reportNo: string;
  reportDate: string;
  // We allow either the structured legacy data OR a fully dynamic blocks array for specific sections
  particulars: {
    // Legacy structured data (optional if blocks are provided)
    primary?: PersonDetails;
    secondary?: PersonDetails;
    vehicle?: VehicleDetails;

    // New Dynamic Data Driven Approach
    blocks?: ParticularsBlock[];
  };
  occurrence: {
    dateOfDuty: string;
    dutyTime: string;
    dutyLocation: string;
    witnessingMps: { name: string; rank: string }[];
    timeOfOffence: string;
    locationOfOffence: string;
    statement: string; // 2.4
  };
  offence: {
    types: string[]; // 3.1
    refs: string[];
    description: string; // 3.2
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

export interface ParticularsBlock {
  index: string; // e.g. "(1.1)", "(1.1.1)"
  fields: { label: string; value: string; className?: string; labelWidth?: string }[];
  type?: 'person' | 'vehicle' | 'other';
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
  driverType?: string;
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

const DataField = ({ label, value, className = "", labelWidth = "w-[120px]" }: { label: React.ReactNode; value?: string; className?: string; labelWidth?: string }) => {
  const safeValue = value && typeof value === 'string' ? value.trim() : value;
  if (!safeValue || safeValue === "N/A" || safeValue === "") return null;

  return (
    <div className={`flex items-start ${className}`}>
      <span className={`font-bold text-xs ${labelWidth} flex-shrink-0`}>{label}</span>
      <span className="text-xs break-words flex-1">{safeValue}</span>
    </div>
  );
};

const hasContent = (value?: any) => {
  if (value === null || value === undefined) return false;

  const str = String(value); // convert safely to string

  return str !== "N/A" && str.trim() !== "";
};

const hasAnyContent = (obj: any, keys: string[]) => {
  if (!obj) return false;
  return keys.some(key => hasContent(obj[key]));
};
const hasArrayContent = (arr?: string[]) => arr && arr.length > 0 && arr.some(item => hasContent(item));

// Helper to normalize legacy props into dynamic blocks
export const normalizeParticulars = (particulars: MilitaryPoliceReportProps['particulars']): ParticularsBlock[] => {
  if (particulars.blocks && particulars.blocks.length > 0) {
    return particulars.blocks;
  }

  const blocks: ParticularsBlock[] = [];
  const p = particulars.primary;
  const s = particulars.secondary;
  const v = particulars.vehicle;
  const gridItemClass = "w-[calc(50%-1rem)]";

  let sectionCounter = 1;

  const processPerson = (person: any, isPrimary: boolean) => {
    if (!person) return;

    const hasAadhar = hasContent(person.aadharCardNo);
    const hasArmyNo = hasContent(person.armyNo);
    const isDependent = hasAadhar && hasArmyNo;

    // Determine effective type
    let type = person.driverType;
    if (!type) {
      if (hasArmyNo && !hasAadhar) type = 'Military Person';
      else type = 'Civilian';
    }

    const currentIndex = `(1.${sectionCounter})`;

    // --- LOGIC BY TYPE ---

    if (type === 'Shop Keeper') {
      // Shop Keeper: Address primarily
      const fields = [{ label: "Address", value: person.address }];
      if (hasAnyContent(person, ['address'])) {
        blocks.push({
          index: currentIndex,
          fields: fields.map(f => ({ ...f, className: gridItemClass, labelWidth: "w-[100px]" }))
        });
      }
      sectionCounter++;

    } else if (type === 'Military Person') {
      // Military Person
      const armyLabel = isPrimary ? "DD veh rider no." : "Army No.";
      const fields = [
        { label: armyLabel, value: person.armyNo },
        { label: "Rank", value: person.rank },
        { label: "Name", value: person.name },
        { label: "Unit", value: person.unit },
        { label: "FMN", value: person.fmn },
        { label: "Command", value: person.command },
        { label: "Address", value: person.address },
        { label: "I Card No.", value: person.iCardNo }
      ];

      if (hasAnyContent(person, ['armyNo'])) {
        blocks.push({
          index: currentIndex,
          fields: fields.map(f => ({ ...f, className: gridItemClass, labelWidth: "w-[130px]" })) // labelWidth slightly larger for "DD veh rider no."
        });
      }
      sectionCounter++;

    } else if (['Employee', 'Servant/Maid', 'Temporary Hired Worker'].includes(type)) {
      // Other Workers: Name, Address, Aadhar (Civ Subset)
      const fields = [
        { label: "Name", value: person.name },
        { label: "Address", value: person.address },
        { label: "Aadhar No.", value: person.aadharCardNo },
        // Include other stats if available
        { label: "S/O", value: person.so }
      ];

      if (hasAnyContent(person, ['name', 'address', 'aadharCardNo'])) {
        blocks.push({
          index: currentIndex,
          fields: fields.map(f => ({ ...f, className: gridItemClass, labelWidth: "w-[100px]" }))
        });
      }
      sectionCounter++;

    } else {
      // Civilian / Dependent (Default Fallback)
      if (isDependent) {
        // Dependent: Split 1.X (Civ) and 1.X.1 (Army)
        const civFields = [
          { label: "Aadhar No.", value: person.aadharCardNo },
          { label: "S/O", value: person.so },
          { label: isPrimary ? "Driver Name" : "Name", value: person.name },
          { label: "Name the Relation", value: person.relation }
        ];

        if (hasAnyContent(person, ['aadharCardNo', 'so', 'name', 'relation'])) {
          blocks.push({
            index: currentIndex,
            fields: civFields.map(f => ({ ...f, className: gridItemClass, labelWidth: "w-[100px]" }))
          });
        }

        const armyFields = [
          { label: "Army No.", value: person.armyNo },
          { label: "Rank", value: person.rank },
          { label: "Name", value: person.name },
          { label: "Unit", value: person.unit },
          { label: "FMN", value: person.fmn },
          { label: "Command", value: person.command },
          { label: "Address", value: person.address },
          { label: "I Card No.", value: person.iCardNo }
        ];

        if (hasAnyContent(person, ['armyNo'])) {
          blocks.push({
            index: `(1.${sectionCounter}.1)`,
            fields: armyFields.map(f => ({ ...f, className: gridItemClass, labelWidth: "w-[100px]" }))
          });
        }
        sectionCounter++;

      } else {
        // Pure Civilian
        const fields = [
          { label: "Aadhar No.", value: person.aadharCardNo },
          { label: "S/O", value: person.so },
          { label: isPrimary ? "Driver Name" : "Name", value: person.name },
          { label: "Name the Relation", value: person.relation },
          { label: "Address", value: person.address }
        ];
        if (hasAnyContent(person, ['aadharCardNo', 'so', 'name', 'relation', 'address'])) {
          blocks.push({
            index: currentIndex,
            fields: fields.map(f => ({ ...f, className: gridItemClass, labelWidth: "w-[100px]" }))
          });
        }
        sectionCounter++;
      }
    }
  };

  processPerson(p, true);
  processPerson(s, false);

  // --- Vehicle ---
  if (v) {
    const currentIndex = `(1.${sectionCounter})`;
    const vehFields = [
      { label: "DD Veh. BA No.", value: v.baNo },
      { label: "Make & Take", value: v.makeAndTake }
    ];
    if (hasAnyContent(v, ['baNo', 'makeAndTake'])) {
      blocks.push({
        index: currentIndex,
        fields: vehFields.map(f => ({ ...f, className: gridItemClass, labelWidth: "w-[100px]" }))
      });
    }
    sectionCounter++;
  }

  return blocks;
}

const MilitaryPoliceReport: React.FC<MilitaryPoliceReportProps> = (props) => {
  const {
    reportNo,
    reportDate,
    particulars, // Now processed via normalizeParticulars
    occurrence,
    offence,
    witnessSig,
    mpSig,
    remarks,
    className,
  } = props;

  const gridItemClass = "w-[calc(50%-1rem)]";

  // Calculate Blocks
  const particularBlocks = normalizeParticulars(particulars);
  const showSection1 = particularBlocks.length > 0;

  // 2. Occurrence Logic
  const show2_1 = hasAnyContent(occurrence, ['dateOfDuty', 'dutyTime', 'dutyLocation']);
  const show2_2 = occurrence.witnessingMps && occurrence.witnessingMps.length > 0;
  const show2_3 = hasAnyContent(occurrence, ['timeOfOffence', 'locationOfOffence']);
  const show2_4 = hasContent(occurrence.statement);
  const showSection2 = show2_1 || show2_2 || show2_3 || show2_4;

  // 3. Offence Logic
  const show3_1 = hasArrayContent(offence.types) || hasArrayContent(offence.refs);
  const show3_2 = hasContent(offence.description);
  const showSection3 = show3_1 || show3_2;

  return (
    <div id='mp-report' className={`font-[Arial] text-[#0A0A0A] flex flex-col items-center print:block ${className || ''}`}>

      {/* ==================== SINGLE CONTINUOUS PAGE ==================== */}
      <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] shadow-lg print:shadow-none relative flex flex-col print:p-[48px]">

        {/* Header */}
        <div className="flex flex-col mb-8 relative">
          <div className="absolute top-0 right-0 font-bold text-xs underline">In Lieu Of IAFP-1479</div>

          <div className="mt-6 mb-6 text-center">
            <h1 className="font-bold text-sm text-[#0A0A0A] uppercase">
              MILITARY POLICE REPORT
            </h1>
            <h1 className="font-bold text-sm text-[#0A0A0A] uppercase">
              (GEN AND TRAFFIC OFFENCE)
            </h1>
          </div>

          <div className="flex justify-between items-end text-xs font-bold">
            <div>Report No- <span className="font-normal">{reportNo}</span></div>
            <div>Report Date- <span className="font-normal">{reportDate}</span></div>
          </div>
        </div>

        {/* 1. PARTICULARS - DYNAMIC RENDERING */}
        {showSection1 && (
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-4">1. &nbsp;&nbsp; <span className="underline">PARTICULARS:</span></h2>

            <div className="border border-gray-300 p-4">
              {particularBlocks.map((block, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <div className="border-t border-gray-300 my-4"></div>}
                  <div className="flex gap-4">
                    <div className="text-xs font-bold w-[30px] flex-shrink-0">{block.index}</div>
                    <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2 content-start">
                      {block.fields.map((field, fIndex) => (
                        <DataField
                          key={fIndex}
                          label={field.label}
                          value={field.value}
                          labelWidth={field.labelWidth || "w-[100px]"}
                          className={field.className || gridItemClass}
                        />
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
        {showSection2 && (
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-4">2. &nbsp;&nbsp; <span className="underline">STATEMENT OF EVIDENCE/OCCURRENCE:</span></h2>

            <div className="border border-gray-300 p-4 mb-6">
              {/* 2.1 */}
              {show2_1 && (
                <div className="flex gap-4 mb-3 border-b border-gray-100 pb-2">
                  <div className="text-xs font-bold w-[30px] flex-shrink-0">(2.1)</div>
                  <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2 content-start">
                    <DataField label="Date of Duty" value={occurrence.dateOfDuty} labelWidth="w-[90px]" className={gridItemClass} />
                    <DataField label="Duty Time" value={occurrence.dutyTime} labelWidth="w-[70px]" className={gridItemClass} />
                    <DataField label="Duty Location" value={occurrence.dutyLocation} labelWidth="w-[90px]" className={gridItemClass} />
                  </div>
                </div>
              )}

              {/* 2.2 - Witnesses */}
              {show2_2 && occurrence.witnessingMps.map((mp, index) => (
                <div key={index} className="flex gap-4 mb-3 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <div className="text-xs font-bold w-[30px] flex-shrink-0">
                    {index === 0 ? "(2.2)" : `(2.2.${index})`}
                  </div>
                  <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2 content-start items-center">
                    <DataField label="Name of MP Witnessing" value={mp.name} labelWidth="w-[130px]" className="flex-grow min-w-[50%]" />
                    <DataField label="Rank" value={mp.rank} labelWidth="w-[50px]" className="w-[150px]" />
                  </div>
                </div>
              ))}

              {/* 2.3 - Time/Location of Offence */}
              {show2_3 && (
                <div className="border-t border-gray-100 pt-2 flex gap-4">
                  <div className="text-xs font-bold w-[30px] flex-shrink-0">(2.3)</div>
                  <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2 content-start">
                    <DataField label="Time of Offence" value={occurrence.timeOfOffence} labelWidth="w-[90px]" className={gridItemClass} />
                    <DataField label="Location of Offence" value={occurrence.locationOfOffence} labelWidth="w-[110px]" className={gridItemClass} />
                  </div>
                </div>
              )}
            </div>

            {/* 2.4 Statement/Narrative */}
            {show2_4 && (
              <div className="flex gap-4 mb-4">
                <div className="text-xs min-w-[30px] font-bold">(2.4)</div>
                <div className="text-xs text-justify leading-relaxed whitespace-pre-line">
                  {occurrence.statement}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. OFFENCE COMMITTED */}
        {showSection3 && (
          <div className="mb-0 pl-0">
            <h2 className="font-bold text-xs mb-4">3. &nbsp;&nbsp; <span className="underline">OFFENCE COMMITTED/ORDERS CONTRAVENED:</span></h2>

            <div className="grid grid-cols-[40px_1fr] gap-y-2 mb-4">

              {/* 3.1 - Types & Refs */}
              {show3_1 && (
                <>
                  <div className="text-xs">(3.1)</div>
                  <div className="text-xs">
                    {hasArrayContent(offence.types) && (
                      <DataField label="Offence Type" value={offence.types.filter(Boolean).join(", ")} labelWidth="w-[80px]" className="mb-2" />
                    )}

                    {/* References List */}
                    {hasArrayContent(offence.refs) && (
                      <div className="flex mt-1">
                        <span className="font-bold mr-2 whitespace-nowrap">Ref :-</span>
                        <div className="flex flex-col gap-1 w-full">
                          {offence.refs.map((ref, i) => (
                            <div className="flex" key={i}>
                              <span className="mr-2 min-w-[20px]">{`(${["i", "ii", "iii", "iv", "v"][i] || i + 1}.)`}</span>
                              <span className="leading-tight">{ref}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 3.2 - Description */}
              {show3_2 && (
                <>
                  <div className="text-xs">(3.2)</div>
                  <div className="text-xs text-justify leading-relaxed">
                    {offence.description}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 4. WITNESS / Signatures */}
        <div className="mb-0 text-sm mt-8">
          <div className="flex justify-between items-start px-0">
            {/* Witness Signature */}
            <div className="w-fit">
              <div className="flex items-end mb-4">
                <span className="font-bold text-xs mr-2 whitespace-nowrap">Sig of Witness</span>
                <div className="border-b border-black w-32"></div>
              </div>
              <div className="space-y-1">
                <DataField label="Army No." value={witnessSig.armyNo} labelWidth="w-[60px]" />
                <DataField label="Rank" value={witnessSig.rank} labelWidth="w-[60px]" />
                <DataField label="Name" value={witnessSig.name} labelWidth="w-[60px]" />
                <DataField label="Unit" value={witnessSig.unit} labelWidth="w-[60px]" />
              </div>
            </div>

            {/* MP Signature */}
            <div className="w-fit">
              <div className="mb-4">
                <span className="font-bold text-xs">Sig of MP JCO/NCO</span>
              </div>
              <div className="space-y-1">
                <DataField label="Army No." value={mpSig.armyNo} labelWidth="w-[60px]" />
                <DataField label="Rank" value={mpSig.rank} labelWidth="w-[60px]" />
                <DataField label="Name" value={mpSig.name} labelWidth="w-[60px]" />
                <DataField label="Unit" value={mpSig.unit} labelWidth="w-[60px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Footer */}
        <div className="mt-12 mb-8">
          <h3 className="text-center font-bold underline mb-4 text-xs">REMARKS OF CO/2IC PROVOST UNIT</h3>
          {remarks.text && <p className="text-justify text-xs mb-8 indent-8 leading-relaxed">
            {remarks.text}
          </p>}

          <div className="flex flex-col gap-1">
            <DataField label="Station:" value={remarks.station} labelWidth="w-[60px]" />
            <DataField label="Dated:" value={remarks.dated} labelWidth="w-[60px]" />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center font-bold text-xs mt-8">RESTRICTED</div>

      </div>
    </div>
  );
};

export default MilitaryPoliceReport;
