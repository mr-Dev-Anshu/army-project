// "use client";

// import { useState } from "react";
// import { useReactToPrint } from "react-to-print";
// import { useRef } from "react";

// import { useRouter } from "next/navigation";
// import { BookOpen, ChevronRight, Printer, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import MTAccidentReportForm from "@/features/RegisterBooks/OccasionalUseRegisters/mtAccident21CorpPro/components/form";
// import MTAccidentReportTable from "@/features/RegisterBooks/OccasionalUseRegisters/mtAccident21CorpPro/components/MTAccidentReportTable";
// import RightSideSheet from "@/components/common/RightSideSheet";
// import { useMTAccidentReport } from "@/features/RegisterBooks/OccasionalUseRegisters/mtAccident21CorpPro/hooks/useMTAccidentReport";

// const Page = () => {
//   const router = useRouter();
//   const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState<any>(null);
//   const printRef = useRef<HTMLDivElement>(null);

//   // Fetch data
//   const { useReports, deleteReport } = useMTAccidentReport();
//   const { data: registers = [], isLoading } = useReports();
//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: "MT Accident Reports",
//     pageStyle: `
//     @page {
//       size: A4 portrait;
//       margin: 12mm;
//     }
//   `,
//   });

//   const handleEdit = (record: any) => {
//     setSelectedRecord(record);
//     setIsSheetOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteReport(id);
//     } catch (error) {
//       console.error("Failed to delete record:", error);
//     }
//   };

//   const handleAddNew = () => {
//     setSelectedRecord(null);
//     setIsSheetOpen(true);
//   };

//   const handleSuccess = () => {
//     setIsSheetOpen(false);
//     setSelectedRecord(null);
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header Section (Breadcrumb + Title) */}
//       <div className="flex items-center justify-between border-b bg-white px-6 py-4">
//         <div className="flex items-center gap-4 text-sm text-gray-500">
//           <BookOpen className="h-5 w-5 text-gray-700" />
//           <div className="h-5 w-[1px] bg-gray-300"></div>
//           <div className="flex items-center gap-2">
//             <span className="hover:text-[#0A0A0A] text-[#0A0A0A] transition-colors cursor-pointer">
//               Reports & Analysis
//             </span>
//             <ChevronRight className="h-4 w-4 text-gray-400" />
//             <span
//               className="hover:text-[#0A0A0A] text-[#0A0A0A] transition-colors cursor-pointer"
//               onClick={() => router.push("/analysis/registers-books")}
//             >
//               Registers/Books
//             </span>
//             <ChevronRight className="h-4 w-4 text-gray-400" />
//             <span className="font-bold text-[#0A0A0A]">
//               MT Accident Report (21 Corp Pro)
//             </span>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button
//             onClick={handlePrint}
//             className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer gap-2"
//           >
//             Download & Print Report
//             <Printer className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <div className="p-6" ref={printRef}>
//         <MTAccidentReportTable
//           data={registers}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onAddNew={handleAddNew}
//         />
//       </div>

//       <RightSideSheet
//         isOpen={isSheetOpen}
//         onClose={() => setIsSheetOpen(false)}
//         title={
//           selectedRecord ? "Edit MT Accident Report" : "Add MT Accident Report"
//         }
//         description="Record details of MT Accident"
//       >
//         <MTAccidentReportForm
//           initialData={selectedRecord}
//           onSuccess={handleSuccess}
//           onCancel={() => setIsSheetOpen(false)}
//         />
//       </RightSideSheet>
//     </div>
//   );
// };

// export default Page;




"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import MTAccidentReportForm from "@/features/RegisterBooks/OccasionalUseRegisters/mtAccident21CorpPro/components/form";
import MTAccidentReportTable from "@/features/RegisterBooks/OccasionalUseRegisters/mtAccident21CorpPro/components/MTAccidentReportTable";
import RightSideSheet from "@/components/common/RightSideSheet";
import { useMTAccidentReport } from "@/features/RegisterBooks/OccasionalUseRegisters/mtAccident21CorpPro/hooks/useMTAccidentReport";

const Page = () => {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch data
  const { useReports, deleteReport } = useMTAccidentReport();
  const { data: registers = [], isLoading } = useReports();

  /* ================= PRINT ================= */

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "MT Accident Reports",
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 12mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
  });

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id);
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const handleAddNew = () => {
    setSelectedRecord(null);
    setIsSheetOpen(true);
  };

  const handleSuccess = () => {
    setIsSheetOpen(false);
    setSelectedRecord(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ===== PRINT GLOBAL FIX ===== */}
      <style jsx global>{`
        @media print {
          body {
            overflow: visible !important;
          }

          .print-full,
          .print-full * {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }

          button {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Section (Breadcrumb + Title) */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <BookOpen className="h-5 w-5 text-gray-700" />
          <div className="h-5 w-[1px] bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <span className="hover:text-[#0A0A0A] text-[#0A0A0A] transition-colors cursor-pointer">
              Reports & Analysis
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span
              className="hover:text-[#0A0A0A] text-[#0A0A0A] transition-colors cursor-pointer"
              onClick={() => router.push("/analysis/registers-books")}
            >
              Registers/Books
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-bold text-[#0A0A0A]">
              MT Accident Report (21 Corp Pro)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handlePrint}
            className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer gap-2"
          >
            Download & Print Report
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ===== PRINT AREA ===== */}
      <div className="p-6 print-full" ref={printRef}>
        <MTAccidentReportTable
          data={registers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      </div>

      <RightSideSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={
          selectedRecord ? "Edit MT Accident Report" : "Add MT Accident Report"
        }
        description="Record details of MT Accident"
      >
        <MTAccidentReportForm
          initialData={selectedRecord}
          onSuccess={handleSuccess}
          onCancel={() => setIsSheetOpen(false)}
        />
      </RightSideSheet>
    </div>
  );
};

export default Page;
