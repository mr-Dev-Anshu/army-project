"use client";

import React, { useState } from "react";
import { Plus, Save } from "lucide-react";
import { IndividualsTable } from "./IndividualsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Individual {
    id: string;
    armyNo: string;
    rank: string;
    name: string;
    unit: string;
    fmn: string;
    command: string;
}

interface AssignedIndividualsProps {
    individuals: Individual[];
    setIndividuals: (individuals: Individual[]) => void;
}

export const AssignedIndividuals = ({
    individuals,
    setIndividuals,
}: AssignedIndividualsProps) => {
    const [currentIndividual, setCurrentIndividual] = useState<Omit<Individual, "id">>({
        armyNo: "",
        rank: "",
        name: "",
        unit: "",
        fmn: "",
        command: "",
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleAddIndividual = () => {
        if (!currentIndividual.armyNo || !currentIndividual.name) return; // Basic validation
        setIndividuals([
            ...individuals,
            { ...currentIndividual, id: Math.random().toString(36).substr(2, 9) },
        ]);
        setCurrentIndividual({
            armyNo: "",
            rank: "",
            name: "",
            unit: "",
            fmn: "",
            command: "",
        });
        setIsEditing(false);
    };

    const handleRemoveIndividual = (id: string) => {
        setIndividuals(individuals.filter((ind) => ind.id !== id));
    };

    const handleEditIndividual = (individual: Individual) => {
        setCurrentIndividual({
            armyNo: individual.armyNo,
            rank: individual.rank,
            name: individual.name,
            unit: individual.unit,
            fmn: individual.fmn,
            command: individual.command,
        });
        handleRemoveIndividual(individual.id);
        setIsEditing(true);
    };

    return (
        <div className="space-y-3">
            <div>
                <Label className="text-xs font-medium text-neutral-700">
                    Enter Each Individuals Details
                </Label>
                <p className="text-[10px] text-neutral-400">
                    Click on "Add Worker button" to add all individuals details
                </p>
            </div>

            <div className="space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="armyNo" className="text-xs font-medium text-neutral-700">
                        Army No.
                    </Label>
                    <Input
                        id="armyNo"
                        placeholder="eg. 11223344F"
                        value={currentIndividual.armyNo}
                        onChange={(e) =>
                            setCurrentIndividual({ ...currentIndividual, armyNo: e.target.value })
                        }
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="rank" className="text-xs font-medium text-neutral-700">
                        Rank
                    </Label>
                    <Input
                        id="rank"
                        placeholder="eg."
                        value={currentIndividual.rank}
                        onChange={(e) =>
                            setCurrentIndividual({ ...currentIndividual, rank: e.target.value })
                        }
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium text-neutral-700">
                        Name
                    </Label>
                    <Input
                        id="name"
                        placeholder="eg."
                        value={currentIndividual.name}
                        onChange={(e) =>
                            setCurrentIndividual({ ...currentIndividual, name: e.target.value })
                        }
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="unit" className="text-xs font-medium text-neutral-700">
                        Unit
                    </Label>
                    <Input
                        id="unit"
                        placeholder="eg."
                        value={currentIndividual.unit}
                        onChange={(e) =>
                            setCurrentIndividual({ ...currentIndividual, unit: e.target.value })
                        }
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="fmn" className="text-xs font-medium text-neutral-700">
                        FMN
                    </Label>
                    <Input
                        id="fmn"
                        placeholder="eg."
                        value={currentIndividual.fmn}
                        onChange={(e) =>
                            setCurrentIndividual({ ...currentIndividual, fmn: e.target.value })
                        }
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="command" className="text-xs font-medium text-neutral-700">
                        Command
                    </Label>
                    <Input
                        id="command"
                        placeholder="eg."
                        value={currentIndividual.command}
                        onChange={(e) =>
                            setCurrentIndividual({ ...currentIndividual, command: e.target.value })
                        }
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleAddIndividual}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200"
                    >
                        {isEditing ? (
                            <Save className="mr-2 h-4 w-4" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        {isEditing ? "Update Individual" : "Add Individual to list"}
                    </Button>
                </div>
            </div>

            {/* List of Workers Table */}
            <IndividualsTable
                individuals={individuals}
                onRemove={handleRemoveIndividual}
                onEdit={handleEditIndividual}
            />
        </div>
    );
};
