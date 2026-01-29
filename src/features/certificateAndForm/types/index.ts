export type DocumentType = "certificate" | "form" | "letter";

export interface CreateDocumentPayload {
  name: string;
  url: string;
  type: "certificate" | "letter" | "form";
}

export interface DocumentItem {
  _id: string;             
  name: string;            
  type:string;      
  url?: string;        
  createdAt?: string;     
  updatedAt?: string;      
  description?: string;    
  isLoading?:boolean
}
