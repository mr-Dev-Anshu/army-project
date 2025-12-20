import api from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@/context/FormContext";

export const useCreateOffence = () => {
  const { state } = useForm();  

  return useMutation({
    mutationKey: ["create-offence"],

    mutationFn: async () => {
      const payload = {
        ...state.formData,
      };

      const res = await api.post("/api/general-traffic-offence", payload);
      return res.data;
    },

    onSuccess: () => {
      console.log("Offence Created Successfully");
    },

    onError: (err: any) => {
      console.error("Failed to create offence", err?.response?.data || err);
    },
  });
};
