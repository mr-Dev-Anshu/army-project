import { useQuery } from "@tanstack/react-query";
import * as api from "@/apis";

export const useGetFieldSuggestions = (fieldType: string, query: string) => {
  return useQuery({
    queryKey: ["field-suggestions", fieldType, query],
    queryFn: () => api.getFieldSuggestions(fieldType, query),
    enabled: !!fieldType, // Enable even for empty query to show history
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
