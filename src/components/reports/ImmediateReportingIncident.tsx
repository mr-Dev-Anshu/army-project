
import React from 'react';
import { format } from "date-fns";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";

interface ImmediateReportingIncidentReportProps {
    data: ImmediateReportingIncident;
}

const ImmediateReportingIncidentReport: React.FC<ImmediateReportingIncidentReportProps> = ({ data }) => {
    const individuals = data.individuals || [];

    return (
        <div className="font-[Arial] text-[14px] w-[210mm] min-h-[297mm] mx-auto bg-white p-12 text-black leading-relaxed shadow-lg print:shadow-none print:w-full print:min-h-0 print:p-0">
            <div className="text-right mb-8 font-[Arial]">Appx 'A'</div>

            <div className="font-bold text-center mb-12 uppercase font-[Arial]">
                IMMEDIATE REPORTING OF INCIDENT : <span className="font-normal normal-case">(Type of incident like injury to serving soldier due to RTA etc)</span>
            </div>

            <div className="space-y-4">
                {individuals.map((ind, index) => {
                    const baseIndex = index * 5;
                    return (
                        <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:mb-0 last:border-0">
                            {/* <div className="font-bold mb-2 underline">Individual {index + 1}</div> */}

                            {/* Army No. Rk, Name */}
                            <div className="flex gap-4">
                                <div className="w-8 font-bold">{baseIndex + 1}.</div>
                                <div className="w-64 font-bold">Army No. Rk, Name</div>
                                <div className="w-4">:</div>
                                <div className="flex-1">{ind.armyNo || "-"}, {ind.rank || "-"}, {ind.name || "-"}</div>
                            </div>

                            {/* Age / Service */}
                            <div className="flex gap-4">
                                <div className="w-8 font-bold">{baseIndex + 2}.</div>
                                <div className="w-64 font-bold">Age / Service</div>
                                <div className="w-4">:</div>
                                <div className="flex-1">{ind.age || "-"} Yrs / {ind.totalServiceDuration || "-"} Yrs</div>
                            </div>

                            {/* Unit & Loc of Unit */}
                            <div className="flex gap-4">
                                <div className="w-8 font-bold">{baseIndex + 3}.</div>
                                <div className="w-64 font-bold">Unit & Loc of Unit</div>
                                <div className="w-4">:</div>
                                <div className="flex-1">{ind.unit || "-"}, {ind.unitLocation || "-"}</div>
                            </div>

                            {/* Fmn */}
                            <div className="flex gap-4">
                                <div className="w-8 font-bold">{baseIndex + 4}.</div>
                                <div className="w-64 font-bold">Fmn</div>
                                <div className="w-4">:</div>
                                <div className="flex-1">{ind.fmn || "Fmn of the channel upto Comd HQ to be mentioned"}</div>
                            </div>

                            {/* Whether not on lve/ duty */}
                            <div className="flex gap-4">
                                <div className="w-8 font-bold">{baseIndex + 5}.</div>
                                <div className="w-64 font-bold">Whether not on lve/ duty</div>
                                <div className="w-4">:</div>
                                <div className="flex-1">{ind.individualWorkingStatus || "-"}</div>
                            </div>
                        </div>
                    );
                })}

                {/* Place of incident */}
                <div className="flex gap-4 mt-4">
                    <div className="w-8 font-bold">{individuals.length * 5 + 1}.</div>
                    <div className="w-64 font-bold">Place of incident</div>
                    <div className="w-4">:</div>
                    <div className="flex-1">{data.incidentPlace || "-"}</div>
                </div>

                {/* Dt & Time of incident */}
                <div className="flex gap-4">
                    <div className="w-8 font-bold">{individuals.length * 5 + 2}.</div>
                    <div className="w-64 font-bold">Dt & Time of incident</div>
                    <div className="w-4">:</div>
                    <div className="flex-1">
                        {data.incidentDate ? format(new Date(data.incidentDate), "dd MMM yyyy") : "-"} approx {data.incidentTime ? data.incidentTime : "-"} hrs
                    </div>
                </div>

                {/* Brief of the incident */}
                <div className="flex gap-4">
                    <div className="w-8 font-bold">{individuals.length * 5 + 3}.</div>
                    <div className="w-64 font-bold shrink-0">Brief of the incident</div>
                    <div className="w-4">:</div>
                    <div className="flex-1 text-justify">
                        {data.incidentBrief || "Relevant details leading to the incident, occurrence of incident occurrence of incident and the resultant effect to be mentioned"}
                    </div>
                </div>

                {/* Coord with Police */}
                <div className="flex gap-4">
                    <div className="w-8 font-bold">{individuals.length * 5 + 4}.</div>
                    <div className="w-64 font-bold shrink-0">
                        Coord with Police on civ <br />
                        Adm, FIR & current sit
                    </div>
                    <div className="w-4">:</div>
                    <div className="flex-1 text-justify">
                        {data.coordinationWithPolice || "In case copy of FIR/ complaint/ Post Mortem Report etc are available it should be shared."}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ImmediateReportingIncidentReport;
