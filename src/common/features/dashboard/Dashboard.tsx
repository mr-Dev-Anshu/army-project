"use client";

import {
  FileText,
  Gauge,
  BarChart3,
  AlertTriangle,
  PlusCircle,
  FileBarChart,
  Search,
  SquareSplitHorizontal,
  Loader2,
} from "lucide-react";

import Sidebar from "./components/dashboard-components/Sidebar";
import ActionCard from "./components/dashboard-components/ActionCard";
import DynamicStatsCard from "./components/dashboard-components/DynamicStatsCard";
import CreateNewRecordPanel from "./components/dashboard-components/CreateNewRecordPanel";
import AllRegisteredReports from "./components/dashboard-components/AllRegisteredReports";

import { useState } from "react";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";
import DashboardReports from "./components/dashboard-components/DashboardReports";
import { ReportsPage } from "@/app/general-traffic-offence-reports/_components";
import StaticSpeedForm from "@/common/component/staticSpeedForm/MainForm";
import MultiFormReport from "@/common/component/investigation-report/MultiFormReport";
import MultiStepForm from "@/common/component/multi-step-form/MulitstepForm";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const [page, setPage] = useState<
    | "dashboard"
    | "createRecord"
    | "reportsCategory"
    | "noVehicleReports"
    | "viewReports"
    | "staticSpeed"
    | "investigation"
    | "multiForm"
  >("dashboard");

  const { isLoading } = useGetAllTrafficOffences();

  return (
    <div className="w-full h-screen flex bg-white">
      {/* -------- SIDEBAR -------- */}
      <div className="print:hidden">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onMenuSelect={(p) => setPage(p as any)}
        />
      </div>

      {/* -------- RIGHT CONTENT -------- */}
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-8 overflow-y-auto no-scrollbar">
        {/* ---------------- DASHBOARD ---------------- */}
        {page === "dashboard" && (
          <>
            {/* SEARCH BAR */}
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3 print:hidden">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <SquareSplitHorizontal className="w-5 h-5" />
              </button>

              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Type to search..."
                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* QUICK CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              <DynamicStatsCard
                icon={<FileText />}
                value={42}
                title="Traffic Reports"
              />
              <DynamicStatsCard icon={<Gauge />} value={42} title="Static Speed" />
              <DynamicStatsCard icon={<BarChart3 />} value={42} title="MP Reports" />
              <DynamicStatsCard
                icon={<AlertTriangle />}
                value={42}
                title="Pending"
              />
            </div>

            {/* QUICK ACTIONS */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ActionCard
                  title="Create New Record"
                  icon={<PlusCircle />}
                  onClick={() => setPage("createRecord")}
                />

                <ActionCard
                  title="View All Registered Reports"
                  icon={<FileBarChart />}
                  onClick={() => setPage("reportsCategory")}
                />

                <ActionCard
                  title="Certificates &  Forms"
                  icon={<FileText />}
                  onClick={() => setPage("viewReports")}
                />

                <ActionCard
                  title="MP General Diary & Daily Occurrence Book"
                  icon={<Gauge />}
                  onClick={() => setPage("staticSpeed")}
                />

                <ActionCard
                  title="Outsidery Report Analysis Module"
                  icon={<AlertTriangle />}
                  onClick={() => setPage("investigation")}
                />

                <ActionCard
                  title="Millitary Structure"
                  icon={<SquareSplitHorizontal />}
                  onClick={() => setPage("multiForm")}
                />
              </div>
            </div>

            {/* DASHBOARD REPORTS TABLE */}
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                All Registered Reports
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-blue-600" />
                </div>
              ) : (
                <DashboardReports />
              )}
            </div>
          </>
        )}

        {/* -------- CATEGORY CARDS PAGE -------- */}
        {page === "reportsCategory" && (
          <AllRegisteredReports
            onNoVehicleReports={() => setPage("noVehicleReports")}
            onVehicleReports={() => setPage("viewReports")}
            onStaticSpeed={() => setPage("staticSpeed")}
            onMPReports={() => setPage("investigation")}
          />
        )}

        {/* -------- INDIVIDUAL PAGES -------- */}
        {page === "noVehicleReports" && <ReportsPage viewType="no-vehicle" />}
        {page === "viewReports" && <ReportsPage viewType="vehicle" />}
        {page === "staticSpeed" && <StaticSpeedForm />}
        {page === "investigation" && <MultiFormReport />}
        {page === "multiForm" && <MultiStepForm />}
        {page === "createRecord" && (
          <CreateNewRecordPanel setCollapsed={setCollapsed} />
        )}
      </div>
    </div>
  );
}
