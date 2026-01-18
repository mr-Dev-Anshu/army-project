import React from "react";
import { Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
                <Label
                    htmlFor="initialsMpcr"
                    className="text-xs font-medium text-neutral-700"
                >
                    Initials of MPCR NCO
                </Label>
                <div className="relative">
                    <Input
                        id="initialsMpcr"
                        placeholder="Signature"
                        className="pr-10"
                        value={data.initialsMPCPNCO || ""}
                        onChange={(e) => onChange("initialsMPCPNCO", e.target.value)}
                    />
                    <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label
                    htmlFor="initialsSm"
                    className="text-xs font-medium text-neutral-700"
                >
                    Initials of SM/SJCO
                </Label>
                <div className="relative">
                    <Input
                        id="initialsSm"
                        placeholder="Signature"
                        className="pr-10"
                        value={data.initialsQMSJCO || ""}
                        onChange={(e) => onChange("initialsQMSJCO", e.target.value)}
                    />
                    <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label
                    htmlFor="initials2ic"
                    className="text-xs font-medium text-neutral-700"
                >
                    Initials of 2IC
                </Label>
                <div className="relative">
                    <Input
                        id="initials2ic"
                        placeholder="Signature"
                        className="pr-10"
                        value={data.initials2IC || ""}
                        onChange={(e) => onChange("initials2IC", e.target.value)}
                    />
                    <Pen className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                </div>
            </div>
        </section>
    );
};
