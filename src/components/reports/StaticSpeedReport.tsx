import React from 'react';

export interface StaticSpeedReportProps {
    reportNo: string;
    reportDate: string;
    unitName: string; // Report Header Unit
    particulars: {
        rider: {
            armyNo: string;
            name: string;
            fmn: string;
            address: string;
            rank: string;
            unit: string;
            command: string;
            iCardNo: string;
        };
        vehicle: {
            baNo: string;
            makeAndTake: string;
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
        <div className={`font-[Arial] text-[#0A0A0A] bg-gray-500/10 p-8 flex flex-col gap-8 print:block print:p-0 print:gap-0 ${className || ''}`}>
            <style type="text/css" media="print">
                {`
                  @page {
                    size: A4;
                    margin: 20mm;
                  }
                  body {
                    background-color: white !important;
                    -webkit-print-color-adjust: exact;
                  }
                `}
            </style>

            {/* Print Only: Fixed Global Page Numbering */}
            <div className="hidden print:block fixed top-0 w-full text-center font-bold text-sm page-number mt-4 z-50"></div>

            {/* ==================== PAGE 1 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-[48px]" style={{ pageBreakAfter: 'always' }}>

                {/* Header */}
                <div className="flex flex-col mb-8">
                    <div className="text-right font-bold text-xs mb-4 underline">In Lieu Of IAFP-1479</div>
                    <div className="text-center mb-6">
                        <h1 className="font-bold text-sm mb-1">
                            MILITARY POLICE REPORT
                        </h1>
                        <h1 className="font-bold text-sm">
                            (STATIC SPEED CHECK)
                        </h1>
                    </div>
                    <div className="flex justify-between items-end text-xs">
                        <div><span className="font-bold">Report No-</span> {reportNo}</div>
                        <div><span className="font-bold">Unit:</span> {unitName}</div>
                        <div><span className="font-bold">Report Date-</span> {reportDate}</div>
                    </div>
                </div>

                {/* 1. PARTICULARS */}
                <div className="mb-6">
                    <h2 className="font-bold text-xs mb-4">1. &nbsp;&nbsp; <span className="underline">PARTICULARS:</span></h2>

                    {/* 1.1 Box */}
                    <div className="border border-gray-300 mb-4 text-xs">

                        {/* 1.1 Rider Details */}
                        <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                            <div className="font-semibold">(1.1)</div>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">DD veh rider no.</span>
                                    <span>{particulars.rider.armyNo}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">Rank</span>
                                    <span>{particulars.rider.rank}</span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">Name</span>
                                    <span>{particulars.rider.name}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">Unit</span>
                                    <span>{particulars.rider.unit}</span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">FMN</span>
                                    <span>{particulars.rider.fmn}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">Command</span>
                                    <span>{particulars.rider.command}</span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">Address</span>
                                    <span>{particulars.rider.address}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">I Card No.</span>
                                    <span>{particulars.rider.iCardNo}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mx-4"></div>

                        {/* 1.2 Vehicle Details */}
                        <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
                            <div className="font-semibold">(1.2)</div>
                            <div className="grid grid-cols-2 gap-x-12">
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">DD Veh BA no.</span>
                                    <span>{particulars.vehicle.baNo}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-bold">Make & Take</span>
                                    <span>{particulars.vehicle.makeAndTake}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
                <div className="mb-6">
                    <h2 className="font-bold text-xs mb-4">2. &nbsp;&nbsp; <span className="underline">STATEMENT OF EVIDENCE/OCCURRENCE:</span></h2>

                    <div className="border border-gray-300 mb-6 text-xs">
                        {/* (2.1) Date/Time */}
                        <div className="grid grid-cols-2 border-b border-gray-300">
                            <div className="p-2 pl-4 grid grid-cols-[45px_110px_1fr] items-center">
                                <span>(2.1)</span>
                                <span className="font-bold">Date of Duty</span>
                                <span>{occurrence.dateOfDuty}</span>
                            </div>
                            <div className="p-2 pl-4 grid grid-cols-[110px_1fr] items-center">
                                <span className="font-bold">Duty Time</span>
                                <span>{occurrence.dutyTime}</span>
                            </div>
                        </div>

                        {/* Duty Location */}
                        <div className="grid grid-cols-2 border-b border-gray-300">
                            <div className="p-2 pl-4 grid grid-cols-[45px_110px_1fr] items-center">
                                <span></span>
                                <span className="font-bold">Duty Location</span>
                                <span>{occurrence.dutyLocation}</span>
                            </div>
                            <div className="p-2 pl-4"></div>
                        </div>

                        {/* (2.2) Witness 1 */}
                        <div className="grid grid-cols-2 border-b border-gray-300">
                            <div className="p-2 pl-4 grid grid-cols-[45px_110px_1fr] items-center">
                                <span>(2.2)</span>
                                <span className="font-bold">Name of MP <br />Witnessing</span>
                                <span>{occurrence.nameOfWitnessingOfficial1}</span>
                            </div>
                            <div className="p-2 pl-4 grid grid-cols-[110px_1fr] items-center">
                                <span className="font-bold">Rank</span>
                                <span>{occurrence.rankOfWitnessingOfficial1 || "Hav (MP)"}</span>
                            </div>
                        </div>

                        {/* (2.2.1) Witness 2 */}
                        <div className="grid grid-cols-2">
                            <div className="p-2 pl-4 grid grid-cols-[45px_110px_1fr] items-center">
                                <span>(2.2.1)</span>
                                <span className="font-bold">Name of MP <br />Witnessing</span>
                                <span>{occurrence.nameOfWitnessingOfficial2}</span>
                            </div>
                            <div className="p-2 pl-4 grid grid-cols-[110px_1fr] items-center">
                                <span className="font-bold">Rank</span>
                                <span>{occurrence.rankOfWitnessingOfficial2 || "Hav (MP)"}</span>
                            </div>
                        </div>
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
                    <h2 className="font-bold text-xs mb-4">3. &nbsp;&nbsp; <span className="underline">OFFENCE COMMITTED/ORDERS CONTRAVENED:</span></h2>
                    <div className="ml-4 grid grid-cols-[40px_1fr] gap-y-2 text-xs">
                        <div className="font-semibold">(3.1)</div>
                        <div className="grid grid-cols-[200px_1fr] gap-y-2">
                            <div className="font-bold">Actual Speed Noted</div>
                            <div>{offence.actualSpeed}</div>

                            <div className="font-bold">Auth Speed</div>
                            <div>{offence.authSpeed}</div>

                            <div className="font-bold">Over Speed Calculated</div>
                            <div>{offence.overSpeed}</div>
                        </div>
                    </div>
                </div>

                {/* 4. WITNESS */}
                <div className="mb-12">
                    <h2 className="font-bold text-xs mb-6">4. &nbsp;&nbsp; <span className="underline">WITNESS</span></h2>

                    <div className="flex justify-between items-start text-xs ml-6">
                        <div className="">
                            <div className="flex items-end mb-2">
                                <span className="font-bold mr-2">Sig of Witness</span>
                                <div className="border-b border-black w-32"></div>
                            </div>
                            <div className="grid grid-cols-[70px_1fr] gap-y-1">
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
                        <div className="">
                            <div className="font-bold mb-4 text-left">Sig of MP JCO/NCO</div>
                            <div className="grid grid-cols-[70px_1fr] gap-y-1">
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
                </div>

                {/* Remarks Footer */}
                <div className="pt-4 flex-1 text-xs">
                    <h3 className="text-center font-bold underline mb-4">REMARKS OF CO/2IC PROVOST UNIT</h3>
                    <p className="text-justify mb-8 leading-relaxed">
                        {remarks.text}
                    </p>

                    <div className="grid grid-cols-[80px_1fr] gap-y-2">
                        <div className="font-bold">Station :</div>
                        <div>{remarks.station}</div>
                        <div className="font-bold">Dated :</div>
                        <div>{remarks.dated}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaticSpeedReport;
