"use client";

import { DocumentType } from "@/features/certificateAndForm/types"
import { useDocuments } from "../hook/index";
import { useRouter } from "next/navigation";

export default function DocumentList({
  type,
}: {
  type: DocumentType;
}) {
    const router = useRouter();
  const { data, isLoading } = useDocuments(type);
  

  if (isLoading) return <p>Loading...</p>;

  if (!data?.length) {
    return (
      <p className="text-sm text-gray-500">
        No {type}s found
      </p>
    );
  }

  return (
    <>
    <div className="space-y-3">
        
      {data.map((doc:any) => (
        <div
        onClick={()=>router.push(`/form-certificate/${type}/${doc._id}`)}
          key={doc._id}
          className="border shadow rounded-lg px-4 py-3 hover:bg-gray-50 cursor-pointer"
        >
          <p className="text-sm">{doc.name}</p>
        </div>
      ))}
    </div>
    </>
  );
}
