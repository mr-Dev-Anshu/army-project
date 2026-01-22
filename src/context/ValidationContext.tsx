"use client";
import {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    useEffect
} from "react";

import { registerValidationDispatch } from "./validationDispatcher";
type State = {
    apiUrl: string | null;
    missingFields: string[];
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
};

type Action =
    | {
        type: "SET_MISSING_FIELDS";
        payload: {
            apiUrl: string;
            fields: string[];
            onConfirm: () => void;
            onCancel: () => void;
        };
    }
    | { type: "RESET" };

const initialState: State = {
    apiUrl: null,
    missingFields: [],
    onConfirm: null,
    onCancel: null,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_MISSING_FIELDS":
            return {
                apiUrl: action.payload.apiUrl,
                missingFields: action.payload.fields,
                onConfirm: action.payload.onConfirm,
                onCancel: action.payload.onCancel,
            };
        case "RESET":
            return initialState;
        default:
            return state;
    }
};

const ValidationContext = createContext<any>(null);

export const useValidation = () => {
    const ctx = useContext(ValidationContext);
    if (!ctx) throw new Error("ValidationProvider missing");
    return ctx;
};

export const ValidationProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        registerValidationDispatch(dispatch);
    }, [dispatch]);

    return (
        <ValidationContext.Provider value={{ state, dispatch }}>
            {children}
        </ValidationContext.Provider>
    );
};

