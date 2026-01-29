"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, XCircle } from "lucide-react";
import { resetValidation } from "@/context/validationDispatcher";
import { getFieldLabel } from "@/utils/fieldLabelMap";
import { useValidation } from "@/context/ValidationContext";


const MissingFieldsModal = () => {
    const { state } = useValidation();

    // Determine if the modal should be open
    const isOpen = state.missingFields.length > 0;

    const handleConfirm = () => {
        state.onConfirm?.();
        resetValidation();
    };

    const handleCancel = () => {
        state.onCancel?.();
        resetValidation();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive mb-2">
                        <AlertTriangle className="h-6 w-6" />
                        <DialogTitle className="text-xl">Incomplete Submission</DialogTitle>
                    </div>
                    <DialogDescription>
                        The following required fields are missing. Please review them before continuing.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-md border p-4 bg-muted/30 max-h-[240px] overflow-y-auto custom-scrollbar">
                        <ul className="space-y-2">
                            {state.missingFields.map((field: string) => (
                                <li key={field} className="flex items-start gap-2 text-sm text-foreground/90">
                                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                    <span>{getFieldLabel(field)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Continue Anyway
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MissingFieldsModal;