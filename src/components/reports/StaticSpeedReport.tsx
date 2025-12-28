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
        <div className={`font-sans text-gray-900 bg-gray-500/10 p-8 flex flex-col gap-8 print:block print:p-0 print:gap-0 ${className || ''}`}>

            {/* Print Only: Fixed Global Page Numbering */}
            <div className="hidden print:block fixed top-0 w-full text-center font-bold text-sm page-number mt-4 z-50"></div>

            {/* ==================== PAGE 1 ==================== */}
            <div className="max-w-[210mm] w-full mx-auto bg-white p-12 min-h-[297mm] shadow-lg print:shadow-none print:min-h-0 relative flex flex-col print:p-0" style={{ pageBreakAfter: 'always' }}>

                {/* Header */}
                <div className="flex flex-col mb-8">
                    <div className="text-right font-bold text-xs mb-4">In Lieu Of IAFP-1479</div>
                    <h1 className="text-center font-bold text-lg underline mb-6">
                        MILITARY POLICE REPORT<br />(STATIC SPEED CHECK)
                    </h1>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-4">
                        <div className="font-semibold text-left">Report No- {reportNo}</div>
                        <div className="font-semibold text-center">Unit: {unitName}</div>
                        <div className="font-semibold text-right">Report Date- {reportDate}</div>
                    </div>
                </div>

                {/* 1. PARTICULARS */}
                <div className="mb-6">
                    <h2 className="font-bold underline mb-4">1. &nbsp;&nbsp; PARTICULARS:</h2>

                    {/* 1.1 Rider Details */}
                    <div className="border border-gray-300 p-4 mb-4 rounded-sm">
                        <div className="grid grid-cols-12 gap-y-2 gap-x-4">
                            <div className="col-span-1 font-semibold">(1.1)</div>
                            <div className="col-span-11 grid grid-cols-2 gap-x-8 gap-y-2">
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">DD veh rider no.</span>
                                    <span>{particulars.rider.armyNo}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">Rank</span>
                                    <span>{particulars.rider.rank}</span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">Name</span>
                                    <span>{particulars.rider.name}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">Unit</span>
                                    <span>{particulars.rider.unit}</span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">FMN</span>
                                    <span>{particulars.rider.fmn}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">Command</span>
                                    <span>{particulars.rider.command}</span>
                                </div>

                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">Address</span>
                                    <span>{particulars.rider.address}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">I Card No.</span>
                                    <span>{particulars.rider.iCardNo}</span>
                                </div>
                            </div>

                            {/* 1.2 Vehicle Details */}
                            <div className="col-span-1 border-t border-gray-200 mt-2 pt-2 font-semibold">(1.2)</div>
                            <div className="col-span-11 border-t border-gray-200 mt-2 pt-2 grid grid-cols-2 gap-x-8">
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">DD Veh BA no.</span>
                                    <span>{particulars.vehicle.baNo}</span>
                                </div>
                                <div className="grid grid-cols-[110px_1fr]">
                                    <span className="font-semibold">Make & Take</span>
                                    <span>{particulars.vehicle.makeAndTake}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
                <div className="mb-6">
                    <h2 className="font-bold underline mb-4">2. &nbsp;&nbsp; STATEMENT OF EVIDENCE/OCCURRENCE:</h2>
                    <div className="text-justify text-gray-800 leading-relaxed whitespace-pre-line">
                        {occurrence.statement}
                    </div>
                </div>

                {/* 3. OFFENCE COMMITTED */}
                <div className="mb-8">
                    <h2 className="font-bold underline mb-4">3. &nbsp;&nbsp; OFFENCE COMMITTED/ORDERS CONTRAVENED:</h2>
                    <div className="ml-4 grid grid-cols-[40px_1fr] gap-y-2">
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
                    <h2 className="font-bold underline mb-8">4. &nbsp;&nbsp; WITNESS</h2>

                    <div className="flex justify-between items-start">
                        <div className="w-64">
                            <div className="font-bold underline mb-4">Sig of Witness &nbsp;&nbsp;&nbsp; _______________</div>
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
                        <div className="w-64">
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
                <div className="mt-8 pt-4 flex-1">
                    <h3 className="text-center font-bold underline mb-4">REMARKS OF CO/2IC PROVOST UNIT</h3>
                    <p className="text-justify mb-8 text-gray-800">
                        {remarks.text}
                    </p>

                    <div className="grid grid-cols-[80px_1fr] gap-y-2">
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

export default StaticSpeedReport;
