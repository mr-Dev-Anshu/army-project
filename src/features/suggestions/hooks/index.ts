import { useQuery } from "@tanstack/react-query";
import * as api from "@/apis";

export const useGetFieldSuggestions = (fieldType: string, query: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["field-suggestions", fieldType, query],
    queryFn: () => api.getFieldSuggestions(fieldType, query),
    enabled: options?.enabled !== undefined ? options.enabled : !!fieldType, // Use options.enabled if provided, else fallback to default logic
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
