import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateDocumentPayload, DocumentType, DocumentItem} from "../types";
import * as api from "@/apis";
import { uploadFile } from "@/lib/uploadFile";
import { toast } from "react-toastify";


export const useDocuments = (type:DocumentType)=>{
    return useQuery({
        queryKey:["documents",type],
        queryFn:()=>api.getCertificateByType(type),
        enabled: !!type,
        retry:1
    // keepPreviousData: true,

    })
}

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDocumentPayload) => {
      // ✅ ONLY send metadata
      const res = await api.createCertificate(payload);
      return res.data;
    },

    onSuccess: (_, variables) => {
      // ✅ Refetch list for active tab
      queryClient.invalidateQueries({
        queryKey: ["documents", variables.type],
      });
    },

    onError: (error: any) => {
      console.error("Create document error:", error);
    },
  });
};

export const useDocumentDetails = (id: string, type: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["document", type, id],
    queryFn: () => api.getCertificateById(id),
    placeholderData: () => {
      const list = queryClient.getQueryData<DocumentItem[]>(["documents", type]);
      return list?.find((doc) => doc._id === id);
    },
    enabled: !!id,
  });
};

export const useDeleteDocument = (type: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteCertificate(id),
        onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", type] });
      
      toast.success(`${type} Deleted Successfully`);
    },
    
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete document");
    }
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; name?: string; url?: string; oldUrl?: string }) => {
      const { id, ...data } = payload;
      return api.updateCertificate(id, data);
    },

    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["document"],
      });
    },
  });
};

export const useDocumentCounts = () => {
  const certs = useQuery({
    queryKey: ["documents", "certificate"],
    queryFn: () => api.getCertificateByType("certificate"),
  });

  const forms = useQuery({
    queryKey: ["documents", "form"],
    queryFn: () => api.getCertificateByType("form"),
  });

  const letters = useQuery({
    queryKey: ["documents", "letter"],
    queryFn: () => api.getCertificateByType("letter"),
  });

  return {
    certificate: certs.data?.length ?? 0,
    form: forms.data?.length ?? 0,
    letter: letters.data?.length ?? 0,
    isLoading: certs.isLoading || forms.isLoading || letters.isLoading,
  };
};
