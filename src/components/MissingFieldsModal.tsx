"use client";
import { useValidation } from "@/context/ValidationContext";
import { resetValidation } from "@/context/validationDispatcher";
import { getFieldLabel } from "@/utils/fieldLabelMap";

const MissingFieldsModal = () => {
    const { state } = useValidation();

    if (state.missingFields.length === 0) return null;

    const handleConfirm = () => {
        state.onConfirm?.();
        resetValidation();
    };

    const handleCancel = () => {
        state.onCancel?.();
        resetValidation();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded w-[400px]">
                <h2 className="text-lg font-bold text-red-600">
                    Missing Required Fields
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                    Please review the following fields before continuing:
                </p>

                <ul className="list-disc ml-6 mt-3 text-sm max-h-60 overflow-y-auto w-full">
                    {state.missingFields.map((field: string) => (
                        <li key={field} className="text-gray-800 font-medium">
                            {getFieldLabel(field)}
                        </li>
                    ))}
                </ul>

                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={handleCancel}
                        className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                        Continue Anyway
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissingFieldsModal;
