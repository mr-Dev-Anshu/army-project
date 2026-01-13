import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface IndividualData {
    armyNo: string;
    rank: string;
    name: string;
    unit: string;
    fmn: string;
    command: string;
}

export interface Individual extends IndividualData {
    id: string;
}

interface IndividualInputFieldsProps {
    data: IndividualData;
    onChange: (field: keyof IndividualData, value: string) => void;
}

export const IndividualInputFields = ({
    data,
    onChange,
}: IndividualInputFieldsProps) => {
    return (
        <div className="space-y-3">
            <div className="space-y-1.5">
                <Label htmlFor="armyNo" className="text-xs font-medium text-neutral-700">
                    Army No.
                </Label>
                <Input
                    id="armyNo"
                    placeholder="eg. 11223344F"
                    value={data.armyNo}
                    onChange={(e) => onChange("armyNo", e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="rank" className="text-xs font-medium text-neutral-700">
                    Rank
                </Label>
                <Input
                    id="rank"
                    placeholder="eg."
                    value={data.rank}
                    onChange={(e) => onChange("rank", e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-neutral-700">
                    Name
                </Label>
                <Input
                    id="name"
                    placeholder="eg."
                    value={data.name}
                    onChange={(e) => onChange("name", e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="unit" className="text-xs font-medium text-neutral-700">
                    Unit
                </Label>
                <Input
                    id="unit"
                    placeholder="eg."
                    value={data.unit}
                    onChange={(e) => onChange("unit", e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="fmn" className="text-xs font-medium text-neutral-700">
                    FMN
                </Label>
                <Input
                    id="fmn"
                    placeholder="eg."
                    value={data.fmn}
                    onChange={(e) => onChange("fmn", e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="command" className="text-xs font-medium text-neutral-700">
                    Command
                </Label>
                <Input
                    id="command"
                    placeholder="eg."
                    value={data.command}
                    onChange={(e) => onChange("command", e.target.value)}
                />
            </div>
        </div>
    );
};
