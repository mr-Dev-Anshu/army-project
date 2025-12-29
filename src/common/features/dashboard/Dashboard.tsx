"use client";

import {
  FileText,
  Gauge,
  BarChart3,
  AlertTriangle,
  PlusCircle,
  Book,
  FileBarChart,
  Shield,
  Search,
  SquareSplitHorizontal,
} from "lucide-react";

import Sidebar from "./components/dashboard-components/Sidebar";
import ActionCard from "./components/dashboard-components/ActionCard";
import DynamicStatsCard from "./components/dashboard-components/DynamicStatsCard";
import CreateNewRecordPanel from "./components/dashboard-components/CreateNewRecordPanel";
import AllRegisteredReports from "./components/dashboard-components/AllRegisteredReports";

import { useMemo, useState } from "react";
import MultiStepForm from "../../component/multi-step-form/MulitstepForm";
import StaticSpeedForm from "@/common/component/staticSpeedForm/MainForm";
import MultiFormReport from "@/common/component/investigation-report/MultiFormReport";
import CollapsibleOffenceTable from "@/common/component/tables/OffendersTable";

import { Loader2 } from "lucide-react";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";
import { transformOffenceData } from "@/common/component/tables/transform";
import ReportsPage from "@/app/hello/page";
import UnifiedAllReports from "./components/UnifiedAllReports";


export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const [page, setPage] = useState<
    | "dashboard"
    | "createRecord"
    | "multiForm"
    | "staticSpeed"
    | "investigation"
    | "viewReports"
  >("dashboard");

  /* ===== FETCH DATA FOR TABLE ===== */
  const { data: trafficReports, isLoading } = useGetAllTrafficOffences();

  const offenceTableData = useMemo(() => {
    if (!trafficReports) return [];
    return transformOffenceData(trafficReports);
  }, [trafficReports]);

  const statsData = [
    {
      icon: <FileText />,
      value: 42,
      title: "Total General Traffic & Offence Reports",
      trend: { value: "+18.2%", label: "than last week", direction: "up" },
      iconBgColor: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      icon: <Gauge />,
      value: 42,
      title: "Total Static Speed Report",
      trend: { value: "+18.2%", label: "than last week", direction: "up" },
      iconBgColor: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      icon: <BarChart3 />,
      value: 42,
      title: "Total Ongoing MP Occurrence & Investigation Report",
      trend: { value: "+18.2%", label: "than last week", direction: "up" },
    },
    {
      icon: <AlertTriangle />,
      value: 42,
      title: "Action Pending",
      trend: { value: "+18.2%", label: "than last week", direction: "up" },
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const quickActions = [
    { title: "Create New Record", icon: <PlusCircle /> },
    { title: "View All Registered Reports", icon: <FileBarChart /> },
    { title: "Certificates & Forms", icon: <FileText /> },
    { title: "MP General Diary & Daily Occurrence Book", icon: <Book /> },
    { title: "Outsidery Report Analysis Module", icon: <BarChart3 /> },
    { title: "Military Structure", icon: <Shield /> },
  ];

  return (
    <div className="w-full h-screen flex bg-[#f5f5f7]">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onMenuSelect={(p) => setPage(p as any)}
      />

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-8 overflow-y-auto">
        {/* ================== DASHBOARD PAGE ================== */}
        {page === "dashboard" && (
          <>
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="w-full flex items-center gap-2 sm:w-[300px] shadow-md md:w-full px-4 py-2 border-2 rounded-xl">
                <SquareSplitHorizontal />
                <div className="flex items-center gap-3">
                  <Search />
                  <input type="text" placeholder="Type to search..." />
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {statsData.map((card, i) => (
                <DynamicStatsCard key={i} {...card} />
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Quick Actions</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, i) => (
                  <ActionCard
                    key={i}
                    {...action}
                    onClick={() => {
                      if (action.title === "Create New Record")
                        setPage("createRecord");
                      else if (action.title === "View All Registered Reports")
                        setPage("viewReports");
                    }}
                  />
                ))}
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 border shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                All Registered Reports
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="mt-6 space-y-10">

                  {/* STATIC SPEED
                  <StaticSpeedCheckReportsPage /> */}
                  <UnifiedAllReports/>

                </div>
              )}
            </div>
          </>
        )}

        {page === "createRecord" && (
          <CreateNewRecordPanel setCollapsed={setCollapsed} />
        )}
        {page === "viewReports" && <AllRegisteredReports />}
        {page === "multiForm" && <MultiStepForm />}
        {page === "staticSpeed" && <StaticSpeedForm />}
        {page === "investigation" && <MultiFormReport />}
      </div>
    </div>
  );
}
