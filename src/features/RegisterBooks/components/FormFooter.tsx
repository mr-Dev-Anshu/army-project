import React from "react";
import { Button } from "@/components/ui/button";

interface FormFooterProps {
    onCancel?: () => void;
    onSave?: () => void;
    isLoading?: boolean;
    saveLabel?: string;
}

export const FormFooter = ({ onCancel, onSave, isLoading, saveLabel = "Save & Add Another" }: FormFooterProps) => {
    return (
        <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 bg-white sticky bottom-0 z-10">
            <Button
                variant="outline"
                className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 px-6"
                onClick={onCancel}
                disabled={isLoading}
            >
                Cancel
            </Button>
            <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                onClick={onSave}
                disabled={isLoading}
            >
                {isLoading ? "Saving..." : saveLabel}
            </Button>
        </div>
    );
};
