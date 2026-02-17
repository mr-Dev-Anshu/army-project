import React from "react";
import { format } from "date-fns";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";

interface ImmediateReportingIncidentReportProps {
  data: ImmediateReportingIncident;
}

const ImmediateReportingIncidentReport: React.FC<
  ImmediateReportingIncidentReportProps
> = ({ data }) => {
  const individuals = data.individuals || [];

  let nextSrNo = 2;
  const srNoAge = data.age || data.totalServiceDuration ? nextSrNo++ : null;
  const srNoStatus = data.individualWorkingStatus ? nextSrNo++ : null;
  const srNoPlace = data.placeOfOccurrence ? nextSrNo++ : null;
  const srNoTime = data.dateOfOccurrence ? nextSrNo++ : null;
  const srNoBrief = data.description ? nextSrNo++ : null;
  const srNoCoord = data.coordWith ? nextSrNo++ : null;

  return (
    <div className="font-[Arial] text-[14px] w-[210mm] min-h-[297mm] mx-auto bg-white p-12 text-black leading-relaxed shadow-lg print:shadow-none print:w-full print:min-h-0 print:p-0">
      <div className="text-right mb-6 font-[Arial] font-bold">Appx 'A'</div>

      {data.reportHeading && (
        <div className="text-center mb-8">
          <div className="font-bold uppercase mb-1">{data.reportHeading}</div>
          <div className="font-normal">
            (Type of Incident like Injury to serving soldier due to RTA etc)
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Particulars */}
        <div className="space-y-2">
          <div className="font-bold">
            1. &nbsp;&nbsp; Particulars of Offender / Victim & Vehicle Details :
          </div>

          {/* 1.1 Vehicle */}
          {(data.vehicleNumber || data.vehicleName) && (
            <div className="flex border border-gray-300 mb-3">
              <div className="p-2 w-16 font-normal text-gray-700  shrink-0 text-center flex items-center justify-center">
                (1.1)
              </div>
              <div className="flex-1 p-2">
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="flex gap-2">
                    <span className="font-bold w-32 shrink-0">
                      DD Veh. BA No.
                    </span>
                    <span>{data.vehicleNumber || "-"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold w-32 shrink-0">Make & Take</span>
                    <span>{data.vehicleName || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {individuals.map((ind: any, idx: number) => {
            const details = ind.individualDetails || {};

          const num = data.vehicleNumber ? idx + 2 : idx + 1;


            const renderRow = (label: string, value: any) => (
              <div className="flex gap-2">
                <span className="font-bold w-32 shrink-0">{label}</span>
                <span>{value || "-"}</span>
              </div>
            );

            return (
              <div key={idx} className="flex mb-3 border-gray-300 border">
                <div className="p-2 w-16 text-center flex items-start justify-center pt-3">
                  (1.{num})
                </div>

                <div className="flex-1 p-2 space-y-2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {/* COMMON FIELDS — NEW SCHEMA SUPPORT */}
                    {details.armyNo && renderRow("Army No.", details.armyNo)}
                    {details.rank && renderRow("Rank", details.rank)}
                    {details.name && renderRow("Name", details.name)}
                    {details.unit && renderRow("Unit", details.unit)}
                    {details.fmn && renderRow("FMN", details.fmn)}
                    {details.command && renderRow("Command", details.command)}
                    {details.address && renderRow("Address", details.address)}
                    {details.iCard && renderRow("I Card No.", details.iCard)}
                    {details.fatherName && renderRow("S/O", details.fatherName)}
                  </div>

                  {/* ===== CO DRIVER ===== */}
                  {ind.coDriver && (
                    <div className="border-t pt-2 mt-2">
                      <div className="font-semibold mb-1">Co Driver</div>

                      {renderRow("Name", ind.coDriver?.individualDetails?.name)}
                      {renderRow(
                        "Address",
                        ind.coDriver?.individualDetails?.address,
                      )}
                    </div>
                  )}

                  {/* ===== PASSENGERS ===== */}
                  {ind.passengers?.map((p: any, pIndex: number) => (
                    <div key={pIndex} className="border-t pt-2 mt-2">
                      <div className="font-semibold mb-1">
                        Passenger {pIndex + 1}
                      </div>

                      {renderRow("Name", p?.individualDetails?.name)}
                      {renderRow("Address", p?.individualDetails?.address)}
                    </div>
                  ))}

                  {/* ===== MILITARY RELATIVE ===== */}
                  {ind.militaryRelative && (
                    <div className="border-t pt-2 mt-2">
                      <div className="font-semibold mb-1">
                        Relative ({ind.militaryRelative?.relation})
                      </div>

                      {renderRow(
                        "Name",
                        ind.militaryRelative?.individualDetails?.name,
                      )}
                      {renderRow(
                        "Rank",
                        ind.militaryRelative?.individualDetails?.rank,
                      )}
                      {renderRow(
                        "Unit",
                        ind.militaryRelative?.individualDetails?.unit,
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Age / Service */}
        {data.age || data.totalServiceDuration ? (
          <div className="flex gap-4 items-baseline">
            <div className="w-6 font-bold shrink-0">{srNoAge}.</div>
            <div className="w-[40%] font-bold shrink-0 ">Age / Service</div>
            <div className="flex-1 ">
              {data.age || "-"} Yrs / {data.totalServiceDuration || "-"} Yrs
            </div>
          </div>
        ) : (
          ""
        )}

        {/* 3. Leave / Duty */}
        {data.individualWorkingStatus && (
          <div className="flex gap-4 items-baseline">
            <div className="w-6 font-bold shrink-0">{srNoStatus}.</div>
            <div className="w-[40%] font-bold shrink-0">
              Whether Individual On Leave / Duty
            </div>
            <div className="flex-1">{data.individualWorkingStatus}</div>
          </div>
        )}

        {/* 4. Place */}
        {data.placeOfOccurrence && (
          <div className="flex gap-4 items-baseline">
            <div className="w-6 font-bold shrink-0">{srNoPlace}.</div>
            <div className="w-[40%] font-bold shrink-0">Place Of Incident</div>
            <div className="flex-1">{data.placeOfOccurrence}</div>
          </div>
        )}
        {/* 5. Date & Time */}
        {data.dateOfOccurrence && (
          <div className="flex gap-4 items-baseline">
            <div className="w-6 font-bold shrink-0">{srNoTime}.</div>
            <div className="w-[40%] font-bold shrink-0">
              Date & Time Of Incident
            </div>
            <div className="flex-1">
              {data.dateOfOccurrence
                ? format(new Date(data.dateOfOccurrence), "dd/MM/yyyy")
                : "-"}{" "}
              & {data.timeOfOccurrence ? data.timeOfOccurrence : "-"}
              hrs
            </div>
          </div>
        )}

        {/* 6. Brief */}
        {data.description && (
          <div className="flex gap-4 items-baseline">
            <div className="w-6 font-bold shrink-0">{srNoBrief}.</div>
            <div className="w-[40%] font-bold shrink-0">
              Brief Of The Incident
            </div>
            <div className="flex-1 text-justify leading-snug">
              {data.description}
            </div>
          </div>
        )}

        {/* 7. Coord */}
        {data.coordWith && (
          <div className="flex gap-4 items-baseline">
            <div className="w-6 font-bold shrink-0">{srNoCoord}.</div>
            <div className="w-[40%] font-bold shrink-0">
              Coord With Police On Civil, Adm, <br /> FIR & Current Sit
            </div>
            <div className="flex-1 text-justify leading-snug">
              {data.coordWith}
            </div>
          </div>
        )}
        {data.incidentCoveredBy && (
          <div className="mt-16 text-center w-full justify-center flex">
            <div>
              (Incident being covered by{" "}
              <span className="inline-block border-b border-black min-w-[200px] text-center">
                {data.incidentCoveredBy}
              </span>{" "}
              Pro Unit)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImmediateReportingIncidentReport;
