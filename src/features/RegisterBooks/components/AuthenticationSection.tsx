import React from "react";
import { SuggestionInput } from "@/common/component/SuggestionInput";

interface AuthenticationData {
    initialsMPCPNCO?: string;
    initialsQMSJCO?: string;
    initials2IC?: string;
}

interface AuthenticationSectionProps {
    data: AuthenticationData;
    onChange: (field: keyof AuthenticationData, value: string) => void;
}

export const AuthenticationSection = ({ data, onChange }: AuthenticationSectionProps) => {
    return (
        <section className="space-y-4 pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900">
                Initials / Authentication
            </h3>

            <div className="space-y-1.5">
                <SuggestionInput
                    label="Initials of MPCR NCO"
                    fieldType="initials"
                    placeholder="Signature"
                    value={data.initialsMPCPNCO || ""}
                    onChange={(v) => onChange("initialsMPCPNCO", v)}
                />
            </div>

            <div className="space-y-1.5">
                <SuggestionInput
                    label="Initials of SM/SJCO"
                    fieldType="initials"
                    placeholder="Signature"
                    value={data.initialsQMSJCO || ""}
                    onChange={(v) => onChange("initialsQMSJCO", v)}
                />
            </div>

            <div className="space-y-1.5">
                <SuggestionInput
                    label="Initials of 2IC"
                    fieldType="initials"
                    placeholder="Signature"
                    value={data.initials2IC || ""}
                    onChange={(v) => onChange("initials2IC", v)}
                />
            </div>
        </section>
    );
};
