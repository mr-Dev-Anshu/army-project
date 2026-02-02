import React from "react";

export interface StaticSpeedReportProps {
  reportNo: string;
  reportDate: string;
  unitName: string; // Report Header Unit
  particulars: {
    rider: {
      [key: string]: any;
    };
    vehicle: {
      [key: string]: any;
    };
  };
  occurrence: {
    dateOfDuty: string;
    dutyTime: string;
    dutyLocation: string;
    nameOfWitnessingOfficial1: string;
    rankOfWitnessingOfficial1: string;
    nameOfWitnessingOfficial2: string;
    rankOfWitnessingOfficial2: string;
    statement: string; // The full text
  };
  offence: {
    actualSpeed: string;
    authSpeed: string;
    overSpeed: string;
  };
  witnessSig: {
    armyNo: string;
    rank: string;
    name: string;
    unit: string;
  };
  mpSig: {
    armyNo: string;
    rank: string;
    name: string;
    unit: string;
  };
  remarks: {
    text: string;
    station: string;
    dated: string;
  };
  className?: string;
}

const DataField = ({
  label,
  value,
  className = "grid-cols-[110px_1fr]",
}: {
  label: React.ReactNode;
  value?: string;
  className?: string;
}) => {
  if (!value || value === "N/A" || value === "") return null;
  return (
    <div className={`grid ${className}`}>
      <span className="font-bold">{label}</span>
      <span>{value}</span>
    </div>
  );
};

const hasContent = (str?: string) => str && str !== "N/A" && str.trim() !== "";
const hasObjectContent = (obj: any) => Object.values(obj).some((val) => hasContent(val as string));

const StaticSpeedReport: React.FC<StaticSpeedReportProps> = ({
  reportNo,
  reportDate,
  unitName,
  particulars,
  occurrence,
  offence,
  witnessSig,
  mpSig,
  remarks,
  className,
}) => {
  return (
    <div
      className={`font-[Arial] text-[#0A0A0A] w-full items-center flex flex-col gap-8 print:block print:gap-0 ${className || ""
        }`}
    >
      <style type="text/css" media="print">
        {`
                  @page {
                    size: A4;
                    margin: 10mm;
                  }
                  body {
                    background-color: white !important;
                    -webkit-print-color-adjust: exact;
                  }
                `}
      </style>

      {/* ==================== PAGE 1 ==================== */}
      <div
        className="max-w-[210mm] w-full mx-auto bg-white p-[48px] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col print:justify-between print:p-[48px]"
        style={{ pageBreakAfter: "always" }}
      >
        {/* Header */}
        <div className="flex flex-col mb-8">
          <div className="text-right font-bold text-xs mb-4 underline">
            In Lieu Of IAFP-1479
          </div>
          <div className="text-center mb-6">
            <h1 className="font-bold text-sm mb-1">MILITARY POLICE REPORT</h1>
            <h1 className="font-bold text-sm">(STATIC SPEED CHECK)</h1>
          </div>
          <div className="flex justify-between items-end text-xs">
            {reportNo && (
              <div>
                <span className="font-bold">Report No-</span> {reportNo}
              </div>
            )}
            {unitName && (
              <div>
                <span className="font-bold">Unit:</span> {unitName}
              </div>
            )}
            {reportDate && (
              <div>
                <span className="font-bold">Report Date-</span> {reportDate}
              </div>
            )}
          </div>
        </div>

        {/* 1. PARTICULARS */}
        {(hasObjectContent(particulars.rider) || hasObjectContent(particulars.vehicle)) && (
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-4">
              1. &nbsp;&nbsp; <span className="underline">PARTICULARS:</span>
            </h2>

            <div className="border border-gray-300 mb-4 text-xs">
              {/* 1.1 Rider Details */}
              {hasObjectContent(particulars.rider) && (
                <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                  <div className="font-semibold">(1.1)</div>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                    {(() => {
                      const details = particulars.rider;
                      // Determine type from various possible fields
                      const rawType = details?.offenderType || details?.individualType || details?.type || details?.customFields?.offenderType;

                      const normalizeType = (t: string) => {
                        if (!t) return "";
                        if (t === "Military Person") return "militaryPersonnel";
                        if (t === "Employee") return "employee";
                        if (t === "Civilian") return "civilian";
                        if (t === "Shop Keeper") return "shopKeeper";
                        if (t === "Servant/Maid") return "servantMaid";
                        if (t === "Temporary Hired Worker") return "tempHiredWorker";
                        return t;
                      };
                      const type = normalizeType(rawType) || 'militaryPersonnel';

                      // Use details directly or nested
                      const d = details?.offenderDetails || details?.individualDetails || details || {};

                      const get = (...keys: string[]) => {
                        for (const k of keys) {
                          if (d[k]) return d[k];
                        }
                        return null;
                      };

                      if (type === 'civilian') {
                        return (
                          <>
                            <DataField label="Name" value={get("name", "civilianName", "Full Name")} />
                            <DataField label="Aadhar No." value={get("aadharCardNo", "civilianAadharCardNumber", "Aadhar Card No.")} />
                            <DataField label="Father/Husband" value={get("so", "civilianFathersName", "Father's / Husband's Name")} />
                            <DataField label="Address" value={get("address", "civilianAddress", "Address")} />
                            <DataField label="ID Card" value={get("iCardNumber", "civilianICardNumber", "ID Card Number")} />
                          </>
                        );
                      }
                      if (type === 'employee') {
                        return (
                          <>
                            <DataField label="Service No" value={get("Employee ID", "employeeServiceNumber")} />
                            <DataField label="Name" value={get("name", "employeeName")} />
                            <DataField label="Rank" value={get("rank", "employeeRank")} />
                            <DataField label="Dept" value={get("Department")} />
                          </>
                        );
                      }
                      if (type === 'shopKeeper') {
                        return (
                          <>
                            <DataField label="Name" value={get("Shop Owner Name", "shopOwnerName")} />
                            <DataField label="Unit" value={get("unit", "shopUnit", "Unit")} />
                            <DataField label="Address" value={get("Shop Address", "shopAddress")} />
                            <DataField label="Pass No" value={get("Pass No.", "shopPassNo", "passNo")} />
                          </>
                        );
                      }
                      if (type === 'servantMaid') {
                        return (
                          <>
                            <DataField label="Name" value={get("name", "maidName")} />
                            <DataField label="Father/Husband" value={get("so", "maidFathersName")} />
                            <DataField label="Pass No" value={get("passNo", "maidPassNumber", "Maid/Servant Pass Number")} />
                            <DataField label="C/O Name" value={get("armyOfficialName", "officersEnclaveName")} />
                            <DataField label="C/O Rank" value={get("Officers Enclave C/O Rank (Army official's details)", "officersEnclaveRank")} />
                            <DataField label="C/O Unit" value={get("unit", "officersEnclaveUnit")} />
                          </>
                        );
                      }
                      if (type === 'tempHiredWorker') {
                        return (
                          <>
                            <DataField label="Name" value={get("name", "tempWorkerName")} />
                            <DataField label="Pass No" value={get("Pass No.", "tempWorkerPassNo")} />
                            <DataField label="Place Of Work" value={get("Place of Work", "tempWorkerPlaceOfWork")} />
                            <DataField label="Type Of Work" value={get("Type of Work", "tempWorkerTypeOfWork")} />
                          </>
                        );
                      }

                      // Default / Military Personnel
                      return (
                        <>
                          <DataField label="DD veh rider no." value={get("armyNo", "armyNumber", "militaryPersonnelArmyNo")} />
                          <DataField label="Rank" value={get("rank", "selectRank", "militaryPersonnelRank")} />
                          <DataField label="Name" value={get("name", "militaryPersonnelName")} />
                          <DataField label="Unit" value={get("unit", "militaryPersonnelUnit")} />
                          <DataField label="FMN" value={get("fmn", "militaryPersonnelFmn")} />
                          <DataField label="Command" value={get("command")} />
                          <DataField label="I-Card No" value={get("iCardNumber", "iCardNo")} />
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Separator if both exist */}
              {(hasObjectContent(particulars.rider) && hasObjectContent(particulars.vehicle)) && (
                <div className="border-t border-gray-200 mx-4"></div>
              )}

              {/* 1.2 Vehicle Details */}
              {hasObjectContent(particulars.vehicle) && (
                <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                  <div className="font-semibold">(1.2)</div>
                  <div className="grid grid-cols-2 gap-x-12">
                    <DataField label="DD Veh BA no." value={particulars.vehicle.baNo} />
                    <DataField label="Make & Take" value={particulars.vehicle.makeAndTake} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
        <div className="mb-6">
          <h2 className="font-bold text-xs mb-4">
            2. &nbsp;&nbsp;{" "}
            <span className="underline">STATEMENT OF EVIDENCE/OCCURRENCE:</span>
          </h2>

          <div className="border border-gray-300 mb-6 text-xs">
            {/* (2.1) Date/Time */}
            {(occurrence.dateOfDuty || occurrence.dutyTime) && (
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-2 pl-4 grid grid-cols-[45px_1fr] items-center">
                  {occurrence.dateOfDuty && (
                    <div className="grid grid-cols-[45px_110px_1fr]">
                      <span>(2.1)</span>
                      <span className="font-bold">Date of Duty</span>
                      <span>{occurrence.dateOfDuty}</span>
                    </div>
                  )}
                </div>
                <div className="p-2 pl-4 grid grid-cols-[110px_1fr] items-center">
                  {occurrence.dutyTime && (
                    <>
                      <span className="font-bold">Duty Time</span>
                      <span>{occurrence.dutyTime}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Duty Location */}
            {occurrence.dutyLocation && (
              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="p-2 pl-4 grid grid-cols-[45px_110px_1fr] items-center">
                  <span></span>
                  <span className="font-bold">Duty Location</span>
                  <span>{occurrence.dutyLocation}</span>
                </div>
                <div className="p-2 pl-4"></div>
              </div>
            )}

            {/* (2.2) Witness 1 */}
            {(occurrence.nameOfWitnessingOfficial1 ||
              occurrence.rankOfWitnessingOfficial1) && (
                <div className="grid grid-cols-2 border-b border-gray-300">
                  <div className="p-2 pl-4 grid grid-cols-[45px_110px_1fr] items-center">
                    <span>(2.2)</span>
                    <span className="font-bold">
                      Name of MP <br />
                      Witnessing
                    </span>
                    <span>{occurrence.nameOfWitnessingOfficial1}</span>
                  </div>
                  <div className="p-2 pl-4 grid grid-cols-[110px_1fr] items-center">
                    {occurrence.rankOfWitnessingOfficial1 && (
                      <>
                        <span className="font-bold">Rank</span>
                        <span>{occurrence.rankOfWitnessingOfficial1}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

            {/* (2.2.1) Witness 2 */}
            {(occurrence.nameOfWitnessingOfficial2 ||
              occurrence.rankOfWitnessingOfficial2) && (
                <div className="grid grid-cols-2">
                  <div className="p-2 pl-4 grid grid-cols-[45px_110px_1fr] items-center">
                    <span>(2.2.1)</span>
                    <span className="font-bold">
                      Name of MP <br />
                      Witnessing
                    </span>
                    <span>{occurrence.nameOfWitnessingOfficial2}</span>
                  </div>
                  <div className="p-2 pl-4 grid grid-cols-[110px_1fr] items-center">
                    {occurrence.rankOfWitnessingOfficial2 && (
                      <>
                        <span className="font-bold">Rank</span>
                        <span>{occurrence.rankOfWitnessingOfficial2}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
          </div>

          <div className="flex gap-4 mb-4 text-xs">
            <div className="min-w-[40px] font-semibold">(2.3)</div>
            <div className="text-justify leading-relaxed whitespace-pre-line">
              {occurrence.statement}
            </div>
          </div>
        </div>

        {/* 3. OFFENCE COMMITTED */}
        <div className="mb-8">
          <h2 className="font-bold text-xs mb-4">
            3. &nbsp;&nbsp;{" "}
            <span className="underline">
              OFFENCE COMMITTED/ORDERS CONTRAVENED:
            </span>
          </h2>
          <div className="ml-4 grid grid-cols-[40px_1fr] gap-y-2 text-xs">
            <div className="font-semibold">(3.1)</div>
            <div className="flex flex-col gap-y-2">
              <DataField
                label="Actual Speed Noted"
                value={offence.actualSpeed}
                className="grid-cols-[200px_1fr]"
              />
              <DataField
                label="Auth Speed"
                value={offence.authSpeed}
                className="grid-cols-[200px_1fr]"
              />
              <DataField
                label="Over Speed Calculated"
                value={offence.overSpeed}
                className="grid-cols-[200px_1fr]"
              />
            </div>
          </div>
        </div>

        {/* 4. WITNESS */}
        <div className="mb-12">
          <h2 className="font-bold text-xs mb-6">
            4. &nbsp;&nbsp; <span className="underline">WITNESS</span>
          </h2>

          <div className="flex justify-between items-start text-xs ml-6">
            <div className="max-w-[45%]">
              <div className="flex items-end mb-4">
                <span className="font-bold mr-2">Sig of Witness</span>
                <div className="border-b border-black w-32"></div>
              </div>
              <div className="flex flex-col gap-y-1">
                <DataField
                  label="Army No."
                  value={witnessSig.armyNo}
                  className="grid-cols-[70px_1fr]"
                />
                <DataField
                  label="Rank"
                  value={witnessSig.rank}
                  className="grid-cols-[70px_1fr]"
                />
                <DataField
                  label="Name"
                  value={witnessSig.name}
                  className="grid-cols-[70px_1fr]"
                />
                <DataField
                  label="Unit"
                  value={witnessSig.unit}
                  className="grid-cols-[70px_1fr]"
                />
              </div>
            </div>
            <div className="max-w-[45%]">
              <div className="font-bold mb-4 text-left">Sig of MP JCO/NCO</div>
              <div className="flex flex-col gap-y-1">
                <DataField
                  label="Army No."
                  value={mpSig.armyNo}
                  className="grid-cols-[70px_1fr]"
                />
                <DataField
                  label="Rank"
                  value={mpSig.rank}
                  className="grid-cols-[70px_1fr]"
                />
                <DataField
                  label="Name"
                  value={mpSig.name}
                  className="grid-cols-[70px_1fr]"
                />
                <DataField
                  label="Unit"
                  value={mpSig.unit}
                  className="grid-cols-[70px_1fr]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Footer */}
        <div className="mt-8">
          <h3 className="text-center font-bold underline mb-4 text-xs">
            REMARKS OF CO/2IC PROVOST UNIT
          </h3>
          {remarks.text && (
            <p className="text-justify text-xs mb-8 indent-8 leading-relaxed">
              {remarks.text}
            </p>
          )}

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

export default StaticSpeedReport;