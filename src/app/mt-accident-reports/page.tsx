// app/mt-accident-reports/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MTAccidentTable } from "@/features/mt-accident-reports/components/MTAccidentTable";

import MTAccidentReportForm from "@/features/mt-accident-reports/components/MTAccidentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/diolog";
import { useGetAllMTAccidentReports } from "@/features/mt-accident-reports/hooks/useMTAccidentReport";
import { useRouter } from "next/navigation";

export default function MTAccidentReportsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

  const { data: reports = [], isLoading, isError } = useGetAllMTAccidentReports();

  const handleEdit = (id: string) => {
    router.push(`/mt-accident-reports/edit/${id}`);
  };

  const handleView = (item: any) => {
    router.push(`/mt-accident-reports/view/${item._id}`);
  };

  const handlePrint = (item: any) => {
    router.push(`/mt-accident-reports/print/${item._id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MT Accident Reports</h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage and track all motor transport accident reports
          </p>
        </div>

        {/* Add New Button */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Add MT Accident Report</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <MTAccidentReportForm onSuccess={() => setIsFormOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 text-lg">Loading reports...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-700">Failed to load accident reports. Please try again.</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <MTAccidentTable
            data={reports}
            onEdit={handleEdit}
            onView={handleView}
            onPrint={handlePrint}
          />
        </div>
      )}
    </div>
  );
}