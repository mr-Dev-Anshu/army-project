import axios from "axios";
import { CreateDocumentPayload, DocumentType } from "@/features/certificateAndForm/types";

export const getCertificateByType = async(type:DocumentType)=>{
    const response = await axios.get(`/api/certificate-form?type=${type}`);
    return response.data.data;
}

export const createCertificate = async(data:CreateDocumentPayload)=>{
    const response = await axios.post(`/api/certificate-form`,data);
    return response.data;
}

export const getCertificateById = async(id:String)=>{
    const response = await axios.get(`/api/certificate-form/${id}`);
    return response.data;
}

export const deleteCertificate = async(id:String)=>{
    const response = await axios.delete(`/api/certificate-form/${id}`);
    return response;
}

export const updateCertificate = async(id:String,data:object)=>{
    const response = await axios.patch(`/api/certificate-form/${id}`,data);
    return response.data;
}