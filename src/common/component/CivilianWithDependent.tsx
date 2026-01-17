"use client";

import { useState, useEffect } from "react";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type OffenderKey = keyof typeof offenderFormsConfig;

/* ================= HELPER: GET VALUE DEEP ================= */
const getValue = (obj: any, path: string) =>
    path.split(".").reduce((o, k) => (o || {})[k], obj);

interface CivilianWithDependentProps {
    id: string | number;
    scope: string;
    path: string;
    showCoDriver?: boolean;
}

const getByPath = (obj: any, path?: string) => {
    if (!obj || !path) return {};
    const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    return keys.reduce((o, k) => (o ? o[k] : undefined), obj) || {};
};

export default function CivilianWithDependent({
    id,
    scope,
    path,
    showCoDriver = false,
}: CivilianWithDependentProps) {
    const { state, dispatch } = useForm();
    const [hasDependent, setHasDependent] = useState(false);
    const [relation, setRelation] = useState("");
    const [relativeType, setRelativeType] = useState<OffenderKey | "">("");

    /* ===== CO-DRIVER STATES ===== */
    const [hasCoDriver, setHasCoDriver] = useState(false);
    const [coDriverType, setCoDriverType] = useState("");
    const [coDriverIndex, setCoDriverIndex] = useState<number | null>(null);

    // Hydrate from state on mount
    useEffect(() => {
        // 1. Hydrate Dependent
        const data = getByPath(state, path);
        if (data?.relation || data?.relativeDetails) {
            setHasDependent(true);
            if (data.relation) setRelation(data.relation);
            if (data.relativeType) setRelativeType(data.relativeType);
        }

        // 2. Hydrate Co-Driver (Only if enabled)
        if (showCoDriver && (scope === "traffic" || scope === "static")) {
            const peoplePath =
                scope === "static"
                    ? "formData.staticSpeed.offenderPeople"
                    : "formData.traffic.offenderPeople";

            const list = getByPath(state, peoplePath);
            if (Array.isArray(list)) {
                const coDriverIdx = list.findIndex((p: any) => p.whoIsIt === "Co-Driver");
                if (coDriverIdx !== -1) {
                    setHasCoDriver(true);
                    setCoDriverType(list[coDriverIdx].type);
                    setCoDriverIndex(coDriverIdx);
                }
            }
        }
    }, [path, state, scope, showCoDriver]);

    /* ===== CO-DRIVER LOGIC ===== */
    const ensureCoDriverSlot = (type: string) => {
        const peoplePath =
            scope === "static"
                ? "formData.staticSpeed.offenderPeople"
                : "formData.traffic.offenderPeople";

        const list = getByPath(state, peoplePath) || [];
        const existingIndex = list.findIndex(
            (p: any) => p.whoIsIt === "Co-Driver"
        );

        let newList = [...list];
        let index = existingIndex;

        if (existingIndex >= 0) {
            newList[existingIndex] = { ...newList[existingIndex], type };
        } else {
            index = list.length;
            newList.push({
                whoIsIt: "Co-Driver",
                type,
                details: {},
            });
        }

        dispatch({
            type: "SET_PATH",
            path: peoplePath,
            value: newList,
        });

        return index;
    };

    const handleRelationChange = (val: string) => {
        setRelation(val);
        dispatch({ type: "SET_PATH", path: `${path}.relation`, value: val });
    };

    const handleRelativeTypeChange = (val: OffenderKey) => {
        setRelativeType(val);
        dispatch({ type: "SET_PATH", path: `${path}.relativeType`, value: val });
    };

    /* ===== FIELD ADAPTATION ===== */
    const getCivilianFields = () => {
        let fields = [...offenderFormsConfig["Civilian"].fields];

        if (showCoDriver) {
            // Vehicle Flow Customizations
            fields = fields
                .map((f) => {
                    if (f.label === "Name") {
                        return { ...f, label: "Civil/DD Vehicle Rider/Driver Name" };
                    }
                    if (f.label === "Address") {
                        return { ...f, placeholder: "Enter Location" };
                    }
                    return f;
                })
                .filter(
                    (f) =>
                        !["Pass No.", "Pass Issue Date", "Pass Expire Date"].includes(
                            f.label
                        )
                );
        }
        return fields;
    };

    const civilianFields = getCivilianFields();

    return (
        <div className="space-y-4">
            {/* 1. Normal Civilian Form */}
            <OffenderDynamicForm
                title="Civilian Details"
                fields={civilianFields}
                scope={scope as any}
                path={path}
                isRoot={false}
            />

            {/* 2. Dependent Checkbox */}
            <div className="flex items-center gap-2 border p-3 rounded-lg bg-gray-50">
                <Checkbox
                    checked={hasDependent}
                    onCheckedChange={(v) => {
                        setHasDependent(Boolean(v));
                        if (!v) {
                            setRelation("");
                            setRelativeType("");
                        }
                    }}
                    id={`dep-${id}`}
                />
                <label
                    htmlFor={`dep-${id}`}
                    className="font-semibold text-sm cursor-pointer select-none"
                >
                    Is this person Dependent / Relative of Military Personnel or Other
                    Registered?
                </label>
            </div>

            {hasDependent && (
                <div className="pl-4 ml-2 border-l-2 border-dashed border-gray-300 space-y-4">
                    {/* Relation Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Name the relation
                        </label>
                        <input
                            className="border rounded-lg px-4 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-black"
                            placeholder="e.g. Brother-in-law"
                            value={relation}
                            onChange={(e) => handleRelationChange(e.target.value)}
                        />
                    </div>

                    {/* Who is it? */}
                    <div>
                        <p className="text-sm font-medium mb-2">Who is it?</p>
                        <RadioGroup
                            value={relativeType}
                            onValueChange={(v) => handleRelativeTypeChange(v as OffenderKey)}
                            className="grid grid-cols-2 gap-3"
                        >
                            {["Military Person", "Servant/Maid", "Shop Keeper", "Temporary Hired Worker"].map((item) => (
                                <label
                                    key={item}
                                    className={cn(
                                        "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer items-center transition bg-white",
                                        relativeType === item ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50" : "border-gray-200"
                                    )}
                                >
                                    <RadioGroupItem value={item} id={`rel-${id}-${item}`} />
                                    <span className="text-sm">{item === "Military Person" ? "Military Personnel" : item === "Servant/Maid" ? "Servant / Maid" : item}</span>
                                </label>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Relative Details Form */}
                    {relativeType && (
                        <div className="mt-4">
                            <div className="mb-4">
                                <p className="font-semibold text-lg">Fill Details</p>
                                <p className="text-sm text-gray-500">
                                    Select who the offender is and fill their details. The form will update based on your selection.
                                </p>
                            </div>
                            <OffenderDynamicForm
                                title=""
                                fields={offenderFormsConfig[relativeType].fields}
                                scope={scope as any}
                                path={`${path}.relativeDetails`}
                                isRoot={false}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* 3. Co-Driver Section (Optional) */}
            {showCoDriver && (
                <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={hasCoDriver}
                            onCheckedChange={(v) => {
                                setHasCoDriver(Boolean(v));
                                if (!v) {
                                    // Optional: remove co-driver from array?
                                    // For now just hide UI state.
                                    setCoDriverType("");
                                    setCoDriverIndex(null);
                                }
                            }}
                            id={`codriver-${id}`}
                        />
                        <label htmlFor={`codriver-${id}`} className="text-sm cursor-pointer select-none">
                            Was there a <b>Co-Driver or Pillion Rider</b> with the driver/rider?
                        </label>
                    </div>

                    {hasCoDriver && (
                        <div className="mt-4 space-y-4 pl-6">
                            <RadioGroup
                                value={coDriverType}
                                onValueChange={(v) => {
                                    setCoDriverType(v);
                                    const idx = ensureCoDriverSlot(v);
                                    setCoDriverIndex(idx);
                                }}
                                className="grid grid-cols-2 gap-3"
                            >
                                {Object.keys(offenderFormsConfig).map((item) => (
                                    <label
                                        key={item}
                                        className={cn(
                                            "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer items-center transition bg-white",
                                            coDriverType === item ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50" : "border-gray-200"
                                        )}
                                    >
                                        <RadioGroupItem value={item} id={`codriver-type-${id}-${item}`} />
                                        <span className="text-sm">{item}</span>
                                    </label>
                                ))}
                            </RadioGroup>

                            {coDriverType && coDriverIndex !== null && (
                                <OffenderDynamicForm
                                    title={`${coDriverType} (Co-Driver) Details`}
                                    fields={offenderFormsConfig[coDriverType].fields}
                                    scope={scope as any}
                                    path={
                                        scope === "static"
                                            ? `formData.staticSpeed.offenderPeople[${coDriverIndex}].details`
                                            : `formData.traffic.offenderPeople[${coDriverIndex}].details`
                                    }
                                    isRoot={false}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
