import React from "react";
import { SuggestionInput } from "@/common/component/SuggestionInput";

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
                <SuggestionInput
                    label="Army No."
                    fieldType="armyNo"
                    placeholder="eg. 11223344F"
                    value={data.armyNo}
                    onChange={(v) => onChange("armyNo", v)}
                />
            </div>

            <div className="space-y-1.5">
                <SuggestionInput
                    label="Rank"
                    fieldType="rank"
                    placeholder="eg."
                    value={data.rank}
                    onChange={(v) => onChange("rank", v)}
                />
            </div>

            <div className="space-y-1.5">
                <SuggestionInput
                    label="Name"
                    fieldType="name"
                    placeholder="eg."
                    value={data.name}
                    onChange={(v) => onChange("name", v)}
                />
            </div>

            <div className="space-y-1.5">
                <SuggestionInput
                    label="Unit"
                    fieldType="unit"
                    placeholder="eg."
                    value={data.unit}
                    onChange={(v) => onChange("unit", v)}
                />
            </div>

            <div className="space-y-1.5">
                <SuggestionInput
                    label="FMN"
                    fieldType="fmn"
                    placeholder="eg."
                    value={data.fmn}
                    onChange={(v) => onChange("fmn", v)}
                />
            </div>

            <div className="space-y-1.5">
                <SuggestionInput
                    label="Command"
                    fieldType="command"
                    placeholder="eg."
                    value={data.command}
                    onChange={(v) => onChange("command", v)}
                />
            </div>
        </div>
    );
};
