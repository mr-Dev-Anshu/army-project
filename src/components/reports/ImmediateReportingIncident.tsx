import React from "react";
import { format } from "date-fns";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
import { cn } from "@/lib/utils";

interface ImmediateReportingIncidentReportProps {
  data: ImmediateReportingIncident;
}
const FieldRow = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => {
  if (!value) return null;

  return (
    <div className="flex gap-2">
      <span className="font-bold w-32 shrink-0">{label}</span>
      <span className="flex-1">{value}</span>
    </div>
  );
};

const SectionRow = ({
  number,
  label,
  value,
}: {
  number: string;
  label: string;
  value?: React.ReactNode;
}) => {
  if (!value) return null;

  return (
    <div className="flex gap-4 items-start">
      <div className="w-6 font-bold shrink-0">{number}.</div>
      <div className="flex justify-between w-full">
        <div className="w-1/2 font-bold">{label}</div>
        <div className="flex-1">{value}</div>
      </div>
    </div>
  );
};

const ImmediateReportingIncidentReport: React.FC<
  ImmediateReportingIncidentReportProps
> = ({ data }) => {
  const individuals = data.individuals || [];

  const getIndividualInfo = (ind: any) => {
    const details = {
      ...(ind.individualDetails || {}),
      ...(ind.offenderDetails || {}),
    };

    // Helper to pick first non-empty value
    const pick = (...args: any[]) =>
      args.find((a) => a !== undefined && a !== null && a !== "");

    // Common Fields map
    let info = {
      armyNo: pick(
        details.militaryPersonnelArmyNo,
        details.employeeServiceNumber,
        details.maidPassNumber,
        details.shopPassNo,
        details.tempWorkerPassNo,
        details.civilianAadharCardNumber,
        details.armyNo,
      ),
      rank: pick(
        details.militaryPersonnelRank,
        details.employeeRank,
        details.officersEnclaveRank,
        details.rank,
      ),
      name: pick(
        details.militaryPersonnelName,
        details.employeeName,
        details.maidName,
        details.officersEnclaveName,
        details.shopOwnerName,
        details.tempWorkerName,
        details.civilianName,
        details.name,
      ),
      unit: pick(
        details.militaryPersonnelUnit,
        details.employeeUnit,
        details.officersEnclaveUnit,
        details.shopUnit,
        details.unit,
      ),
      fmn: pick(
        details.militaryPersonnelFmn,
        details.employeeFmn,
        details.officersEnclaveFmn,
        details.fmn,
      ),
      command: pick(
        details.militaryPersonnelCommand,
        details.employeeCommand,
        details.officersEnclaveCommand,
        details.command,
      ),
      address: pick(
        details.militaryPersonnelAddress,
        details.employeeAddress,
        details.officersEnclaveAddress,
        details.shopAddress,
        details.tempWorkerPlaceOfStay,
        details.civilianAddress,
        details.address,
      ),
      iCard: pick(
        details.militaryPersonnelICardNumber,
        details.employeeICardNumber,
        details.officersEnclaveICardNumber,
        details.iCardNumber,
      ),

      // Special fields
      fatherName: pick(details.civilianFathersName, details.maidFathersName),
      relation: details.relationName,

      // Relative (Nested)
      relative: null as any,
    };

    if (
      details.relativeDetails &&
      Object.keys(details.relativeDetails).length > 0
    ) {
      const rel = details.relativeDetails;
      info.relative = {
        armyNo: pick(rel.armyNo, rel.employeeServiceNumber, rel.maidPassNumber),
        rank: pick(rel.rank, rel.employeeRank, rel.officersEnclaveRank),
        name: pick(
          rel.militaryPersonnelName,
          rel.employeeName,
          rel.maidName,
          rel.officersEnclaveName,
        ),
        unit: pick(
          rel.militaryPersonnelUnit,
          rel.employeeUnit,
          rel.officersEnclaveUnit,
          rel.maidUnit,
        ),
        fmn: pick(
          rel.militaryPersonnelFmn,
          rel.employeeFmn,
          rel.officersEnclaveFmn,
          rel.maidFmn,
        ),
        command: pick(
          rel.militaryPersonnelCommand,
          rel.employeeCommand,
          rel.officersEnclaveCommand,
        ),
        address: pick(rel.militaryPersonnelAddress, rel.employeeAddress),
        iCard: pick(rel.militaryPersonnelICardNumber, rel.employeeICardNumber),
      };
    }

    return info;
  };

  return (
    <div className="font-[Arial] text-[14px] w-[210mm] min-h-[297mm] mx-auto bg-white p-12 text-black leading-relaxed shadow-lg print:shadow-none print:w-full print:min-h-0 print:p-0">
      <div className="text-right mb-6 font-[Arial] font-bold">Appx 'A'</div>

      <div className="text-center mb-8">
        <div className="font-bold uppercase mb-1">
          IMMEDIATE REPORTING OF INCIDENT
        </div>
        <div className="font-normal">
          (Type of Incident like Injury to serving soldier due to RTA etc)
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Particulars */}
        <div className="space-y-2">
          <div className="font-bold">
            1. &nbsp;&nbsp; Particulars of Offender / Victim & Vehicle Details :
          </div>

          {/* 1.1 Vehicle */}
          {(data.vehicleNumber || data.vehicleName) && (
            <div className="flex border border-gray-300 mb-3">
              <div className="w-16 flex items-center justify-center text-gray-600 border-r">
                (1.1)
              </div>
              <div className="flex-1 p-2 grid grid-cols-2 gap-y-1">
                <FieldRow label="DD Veh. BA No." value={data.vehicleNumber} />
                <FieldRow label="Make & Take" value={data.vehicleName} />
              </div>
            </div>
          )}

          {individuals.map((ind, idx) => {
            // Determine Type
            const details = {
              ...(ind.individualDetails || {}),
              ...(ind.offenderDetails || {}),
            };
            let type = ind.individualType;
            if (!type) {
              if (details.employeeServiceNumber) type = "employee";
              else if (details.maidPassNumber) type = "servantMaid";
              else if (details.shopOwnerName) type = "shopKeeper";
              else if (details.tempWorkerName) type = "tempHiredWorker";
              else if (details.civilianName || details.civilianAadharCardNumber)
                type = "civilian";
              else type = "militaryPersonnel";
            }

            const num = data.vehicleNumber ? idx + 2 : idx + 1;

            const renderRow = (label: string, value: any) => (
              <div className="flex gap-2">
                <span className="font-bold w-32 shrink-0">{label}</span>
                <span>{value || "-"}</span>
              </div>
            );

            return (
              <React.Fragment key={idx}>
                <div className="flex border border-gray-300 last:border-0 mb-3">
                  <div className="p-2 w-16 font-normal text-gray-700 border-r border-gray-300 shrink-0 text-center flex items-start justify-center pt-3">
                    (1.{num})
                  </div>
                  <div className="flex-1 p-2 space-y-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {/* Military Personnel */}
                      {type === "militaryPersonnel" && (
                        <>
                          <FieldRow
                            label="Army No."
                            value={details.militaryPersonnelArmyNo}
                          />
                          <FieldRow
                            label="Rank"
                            value={details.militaryPersonnelRank}
                          />
                          <FieldRow
                            label="Name"
                            value={details.militaryPersonnelName}
                          />
                          <FieldRow
                            label="Unit"
                            value={details.militaryPersonnelUnit}
                          />
                          <FieldRow
                            label="FMN"
                            value={details.militaryPersonnelFmn}
                          />
                          <FieldRow
                            label="Command"
                            value={details.militaryPersonnelCommand}
                          />
                          <FieldRow
                            label="Address"
                            value={details.militaryPersonnelAddress}
                          />
                          <FieldRow
                            label="I Card No."
                            value={details.militaryPersonnelICardNumber}
                          />
                        </>
                      )}

                      {/* Employee */}
                      {type === "employee" && (
                        <>
                          {renderRow(
                            "Service No.",
                            details.employeeServiceNumber,
                          )}
                          {renderRow("Rank", details.employeeRank)}
                          {renderRow("Name", details.employeeName)}
                          {renderRow("Unit", details.employeeUnit)}
                          {renderRow("FMN", details.employeeFmn)}
                          {renderRow("Command", details.employeeCommand)}
                          {renderRow("I-Card No.", details.employeeICardNumber)}
                        </>
                      )}

                      {/* Servant / Maid */}
                      {type === "servantMaid" && (
                        <>
                          {renderRow("Pass No", details.maidPassNumber)}
                          {renderRow("Name", details.maidName)}
                          {renderRow("Father's Name", details.maidFathersName)}
                          {renderRow("Trade", details.maidTrade)}
                          {renderRow("Quarter No", details.maidQuarterNumber)}
                          {renderRow(
                            "C/O",
                            `${details.officersEnclaveRank || ""} ${details.officersEnclaveName || ""}`,
                          )}
                          {renderRow("Unit", details.officersEnclaveUnit)}
                        </>
                      )}

                      {/* Shop Keeper */}
                      {type === "shopKeeper" && (
                        <>
                          {renderRow("Shop Owner", details.shopOwnerName)}
                          {renderRow("Shop Name", details.shopName)}
                          {renderRow("Address", details.shopAddress)}
                          {renderRow("Unit", details.shopUnit)}
                          {renderRow("Pass No", details.shopPassNo)}
                        </>
                      )}

                      {/* Temp Hired Worker */}
                      {type === "tempHiredWorker" && (
                        <>
                          {renderRow("Name", details.tempWorkerName)}
                          {renderRow("Pass No", details.tempWorkerPassNo)}
                          {renderRow(
                            "Place of Stay",
                            details.tempWorkerPlaceOfStay,
                          )}
                          {renderRow(
                            "Place of Work",
                            details.tempWorkerPlaceOfWork,
                          )}
                          {renderRow(
                            "Type of Work",
                            details.tempWorkerTypeOfWork,
                          )}
                        </>
                      )}

                      {/* Civilian */}
                      {type === "civilian" && (
                        <>
                          <FieldRow
                            label="Aadhar Card No."
                            value={details.civilianAadharCardNumber}
                          />
                          <FieldRow
                            label="S/O"
                            value={details.civilianFathersName}
                          />
                          <FieldRow
                            label="Driver Name"
                            value={details.civilianName}
                          />
                          <FieldRow
                            label="Name the Relation"
                            value={details.relationName}
                          />
                        </>
                      )}
                    </div>

                    {/* Nested Relative (Civilian Dependent) */}
                    {type === "civilian" && details.relativeDetails && (
                      <div className="mt-2 pt-2 border-t border-gray-200 flex">
                        <div className="w-16 text-center text-xs text-gray-600">
                          (1.{num}.1)
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-y-1">
                          <FieldRow
                            label="Army No."
                            value={
                              details.relativeDetails.militaryPersonnelArmyNo
                            }
                          />
                          <FieldRow
                            label="Rank"
                            value={
                              details.relativeDetails.militaryPersonnelRank
                            }
                          />
                          <FieldRow
                            label="Name"
                            value={
                              details.relativeDetails.militaryPersonnelName
                            }
                          />
                          <FieldRow
                            label="Unit"
                            value={
                              details.relativeDetails.militaryPersonnelUnit
                            }
                          />
                          <FieldRow
                            label="FMN"
                            value={details.relativeDetails.militaryPersonnelFmn}
                          />
                          <FieldRow
                            label="Command"
                            value={
                              details.relativeDetails.militaryPersonnelCommand
                            }
                          />
                          <FieldRow
                            label="Address"
                            value={
                              details.relativeDetails.militaryPersonnelAddress
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* 2. Age / Service */}
        <SectionRow
          number="2"
          label="Age / Service"
          value={
            (data.age || individuals[0]?.age) && (
              <>
                {data.age || individuals[0]?.age} Yrs /{" "}
                {data.totalServiceDuration ||
                  individuals[0]?.totalServiceDuration}{" "}
                Yrs
              </>
            )
          }
        />

        <SectionRow
          number="3"
          label="Whether Individual On Leave / Duty"
          value={data.individualWorkingStatus}
        />

        <SectionRow
          number="4"
          label="Place Of Incident"
          value={data.placeOfOccurrence}
        />

        <SectionRow
          number="5"
          label="Date & Time Of Incident"
          value={
            data.dateOfOccurrence && (
              <>
                {format(new Date(data.dateOfOccurrence), "dd/MM/yyyy")} &{" "}
                {data.timeOfOccurrence} hrs
              </>
            )
          }
        />

        <SectionRow
          number="6"
          label="Brief Of The Incident"
          value={data.description}
        />

        <SectionRow
          number="7"
          label="Coord With Police On Civil, Adm, FIR & Current Sit"
          value={data.coordWith}
        />

        <div className="mt-16 text-center w-full flex justify-center">
          <div>
            (Incident being covered by{" "}
            <span className="inline-block border-b border-black min-w-[200px] text-center">
              {data.incidentCoveredBy || "__________________________"}
            </span>{" "}
            Pro Unit)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmediateReportingIncidentReport;
