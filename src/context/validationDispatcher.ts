let dispatchRef: React.Dispatch<any> | null = null;

export const registerValidationDispatch = (
    dispatch: React.Dispatch<any>
) => {
    dispatchRef = dispatch;
};

export const setMissingFields = (
    apiUrl: string,
    fields: string[],
    onConfirm: () => void,
    onCancel: () => void
) => {
    dispatchRef?.({
        type: "SET_MISSING_FIELDS",
        payload: { apiUrl, fields, onConfirm, onCancel },
    });
};

export const resetValidation = () => {
    dispatchRef?.({ type: "RESET" });
};
