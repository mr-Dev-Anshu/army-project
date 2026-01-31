import React from "react";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface AuthenticationData {
    initialsMPCPNCO?: string;
    initialsQMSJCO?: string;
    initials2IC?: string;
    initialsOfMPCRNCO?: boolean;
    initialsOfSMSJCO?: boolean;
    initialsOf2IC?: boolean;
}

interface AuthenticationSectionProps {
    data: AuthenticationData;
    onChange: (field: keyof AuthenticationData, value: any) => void;
    title?: string;
    description?: string;
    variant?: 'default' | 'minimal';
    hiddenFields?: string[];
}

export const AuthenticationSection = ({ data, onChange, title, description, variant = 'default', hiddenFields = [] }: AuthenticationSectionProps) => {
    const isMinimal = variant === 'minimal';
    const Wrapper = isMinimal ? 'div' : 'section';

    return (
        <Wrapper className={`space-y-4 ${isMinimal ? "" : "pt-4 border-t border-neutral-100"}`}>
            {!isMinimal && (
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-neutral-900">
                        {title || "Initials / Authentication"}
                    </h3>
                    {description && (
                        <p className="text-xs text-neutral-500">
                            {description}
                        </p>
                    )}
                </div>
            )}

            <div className="border rounded-lg overflow-hidden border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-2 w-1/3">Authority</th>
                            <th className="px-4 py-2">Signature / Initials</th>
                            <th className="px-4 py-2 w-24 text-center">Auth</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {!hiddenFields.includes("initialsMPCPNCO") && (
                            <tr>
                                <td className="px-4 py-2 text-[#0a0a0a] font-medium">Initials of MPCR NCO</td>
                                <td className="px-4 py-2">
                                    <SuggestionInput
                                        label=""
                                        fieldType="initials"
                                        placeholder="Signature"
                                        value={data.initialsMPCPNCO || ""}
                                        onChange={(v) => onChange("initialsMPCPNCO", v)}
                                        disabled={true}
                                    />
                                </td>
                                <td className="px-4 py-2 text-center align-middle">
                                    <div className="flex justify-center">
                                        <Checkbox
                                            className="border-black"
                                            checked={data.initialsOfMPCRNCO || false}
                                            onCheckedChange={(checked) => onChange("initialsOfMPCRNCO", checked)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!hiddenFields.includes("initialsQMSJCO") && (
                            <tr>
                                <td className="px-4 py-2 text-[#0a0a0a] font-medium">Initials of SM/SJCO</td>
                                <td className="px-4 py-2">
                                    <SuggestionInput
                                        label=""
                                        fieldType="initials"
                                        placeholder="Signature"
                                        value={data.initialsQMSJCO || ""}
                                        onChange={(v) => onChange("initialsQMSJCO", v)}
                                        disabled={true}
                                    />
                                </td>
                                <td className="px-4 py-2 text-center align-middle">
                                    <div className="flex justify-center">
                                        <Checkbox
                                            className="border-black"
                                            checked={data.initialsOfSMSJCO || false}
                                            onCheckedChange={(checked) => onChange("initialsOfSMSJCO", checked)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!hiddenFields.includes("initials2IC") && (
                            <tr>
                                <td className="px-4 py-2 text-[#0a0a0a] font-medium">Initials of 2IC</td>
                                <td className="px-4 py-2">
                                    <SuggestionInput
                                        label=""
                                        fieldType="initials"
                                        placeholder="Signature"
                                        value={data.initials2IC || ""}
                                        onChange={(v) => onChange("initials2IC", v)}
                                        disabled={true}
                                    />
                                </td>
                                <td className="px-4 py-2 text-center align-middle">
                                    <div className="flex justify-center">
                                        <Checkbox
                                            className="border-black"
                                            checked={data.initialsOf2IC || false}
                                            onCheckedChange={(checked) => onChange("initialsOf2IC", checked)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Wrapper>
    );
};
