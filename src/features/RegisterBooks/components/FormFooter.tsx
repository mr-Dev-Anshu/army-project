import React from "react";
import { Button } from "@/components/ui/button";

interface FormFooterProps {
    onCancel?: () => void;
    onSave?: () => void;
}

export const FormFooter = ({ onCancel, onSave }: FormFooterProps) => {
    return (
        <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 bg-white sticky bottom-0 z-10">
            <Button
                variant="outline"
                className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 px-6"
                onClick={onCancel}
            >
                Cancel
            </Button>
            <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                onClick={onSave}
            >
                Save & Add Another
            </Button>
        </div>
    );
};
