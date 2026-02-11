"use client";

import { Minus, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Individual } from "./IndividualInputFields";

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
    // console.log("Rendering IndividualsTable with individuals:", individuals);
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
          <div className="max-h-52 overflow-y-auto custom-scrollbar">
            {individuals.map((ind, index) => (
              <div
                key={ind.id}
                className="group grid grid-cols-12 gap-2 border-b border-neutral-200 last:border-0 px-4 py-3 text-xs text-neutral-800 items-center bg-white hover:bg-neutral-50 transition"
              >
                {/* Sr No */}
                <div className="col-span-1 text-neutral-500 font-medium">
                  {index + 1}.
                </div>

                {/* Army No */}
                <div className="col-span-2 font-semibold tracking-wide">
                  {ind.armyNo || "-"}
                </div>

                {/* Rank */}
                <div className="col-span-2 text-neutral-600">
                  {ind.rank || "-"}
                </div>

                {/* Name */}
                <div className="col-span-3 font-medium text-neutral-900">
                  {ind.name || "-"}
                </div>

                {/* Unit */}
                <div className="col-span-2 text-neutral-600 truncate">
                  {ind.unit || "-"}
                </div>

                {/* FMN + Actions */}
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-neutral-600 truncate">
                    {ind.fmn || "-"}
                  </span>

                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={() => onEdit(ind)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onRemove(ind.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition"
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
    </div>
  );
};
