"use client";

import React from "react";
import { Minus, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Individual } from "./AssignedIndividuals";

interface IndividualsTableProps {
    individuals: Individual[];
    onRemove: (id: string) => void;
    onEdit: (individual: Individual) => void;
}

export const IndividualsTable = ({
    individuals,
    onRemove,
    onEdit,
}: IndividualsTableProps) => {
    if (individuals.length === 0) return null;

    return (
        <div className="space-y-2">
            <Label className="text-xs font-medium text-neutral-700">
                List of Workers:
            </Label>
            <div className="rounded-md border border-neutral-100 bg-neutral-50/50">
                <div className="grid grid-cols-12 gap-2 border-b border-neutral-100 px-4 py-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                    <div className="col-span-1">Sr no.</div>
                    <div className="col-span-2">Army No.</div>
                    <div className="col-span-2">Rank</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Unit</div>
                    <div className="col-span-2">FMN</div>
                </div>
                <div className="max-h-40 overflow-y-auto custom-scrollbar">
                    {individuals.map((ind, index) => (
                        <div
                            key={ind.id}
                            className="group grid grid-cols-12 gap-2 border-b border-neutral-100 last:border-0 px-4 py-2.5 text-xs text-neutral-700 hover:bg-white items-center"
                        >
                            <div className="col-span-1 text-neutral-500">{index + 1}.</div>
                            <div className="col-span-2 font-medium">{ind.armyNo}</div>
                            <div className="col-span-2 text-neutral-500">{ind.rank}</div>
                            <div className="col-span-3 font-medium">{ind.name}</div>
                            <div className="col-span-2 text-neutral-500">{ind.unit}</div>
                            <div className="col-span-2 flex items-center justify-between">
                                <span className="text-neutral-500">{ind.fmn}</span>
                                <div className="hidden group-hover:flex items-center gap-1">
                                    <button
                                        onClick={() => onEdit(ind)}
                                        className="flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
                                        title="Edit"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => onRemove(ind.id)}
                                        className="flex h-6 w-6 items-center justify-center rounded text-red-500 hover:bg-red-50"
                                        title="Remove"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
