import { format, isValid, parseISO } from "date-fns";

export const formatDateForInput = (date: string | Date | undefined | null): string => {
    if (!date) return "";

    const d = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(d)) return "";

    return format(d, "yyyy-MM-dd");
};

export const formatTimeForInput = (date: string | Date | undefined | null): string => {
    if (!date) return "";

    const d = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(d)) return "";

    return format(d, "HH:mm");
};
