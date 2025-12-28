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
  File,
  SquareSplitVertical,
  SquareSplitHorizontal,
} from "lucide-react";

import Sidebar from "./components/dashboard-components/Sidebar";
import ActionCard from "./components/dashboard-components/ActionCard";
import DynamicStatsCard from "./components/dashboard-components/DynamicStatsCard";
import CreateNewRecordPanel from "./components/dashboard-components/CreateNewRecordPanel";
import AllRegisteredReports from "./components/dashboard-components/AllRegisteredReports";
import DashboardReports from "./components/dashboard-components/DashboardReports";

import { useState, useMemo } from "react";
import MultiStepForm from "../../component/multi-step-form/MulitstepForm";
import StaticSpeedForm from "@/common/component/staticSpeedForm/MainForm";
import MultiFormReport from "@/common/component/investigation-report/MultiFormReport";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";
import { useGetStaticSpeedRecords } from "@/features/staticSpeed/hooks";
import { useGetAllMPReports } from "@/features/mpReports/hooks";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const [page, setPage] = useState<"dashboard" | "createRecord" | "multiForm" | "staticSpeed" | "investigation" | "viewReports">(
    "dashboard"
  );

  // Fetch Data
  const { data: trafficOffences } = useGetAllTrafficOffences({ groupBy: "offenceType" });
  const { data: staticSpeedRecords } = useGetStaticSpeedRecords();
  const { data: mpReports } = useGetAllMPReports();

  // Process Traffic Offences
  const allTrafficOffences = useMemo(() => {
    if (!trafficOffences) return [];
    // Handle grouped data as seen in DashboardReports
    let flattened: any[] = [];
    if (Array.isArray(trafficOffences)) {
      trafficOffences.forEach((group: any) => {
        if (group.offences) {
          flattened = [...flattened, ...group.offences];
        } else {
          // If not grouped, maybe it is the offence itself?
          // But based on usage, we expect grouped if we passed groupBy.
          // If API behavior differs without groupBy, we'd need to adjust.
          // For consistency with DashboardReports, we use the same param and logic.
          flattened.push(group);
        }
      });
    }
    return flattened;
  }, [trafficOffences]);

  const stats = useMemo(() => {
    const trafficCount = allTrafficOffences.length;
    const staticSpeedCount = staticSpeedRecords?.length || 0;
    const mpCount = mpReports?.length || 0;

    // Calculate pending actions (assuming filtered from traffic offences for now, 
    // or we could combine pending from all types if they have status)
    // DashboardReports only filtered traffic offences for "Action Status", so sticking to that.
    const pendingCount = allTrafficOffences.filter((o: any) => o.actionStatus === false).length;

    return {
      traffic: trafficCount,
      staticSpeed: staticSpeedCount,
      mp: mpCount,
      pending: pendingCount
    }
  }, [allTrafficOffences, staticSpeedRecords, mpReports]);


  const statsData = [
    {
      icon: <FileText />,
      value: stats.traffic,
      title: "Total General Traffic & Offence Reports",
      trend: { value: "+18.2%", label: "than last week", direction: "up" as const },
      iconBgColor: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      icon: <Gauge />,
      value: stats.staticSpeed,
      title: "Total Static Speed Report",
      trend: { value: "+18.2%", label: "than last week", direction: "up" as const },
      iconBgColor: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      icon: <BarChart3 />,
      value: stats.mp,
      title: "Total Ongoing MP Occurrence & Investigation Report",
      trend: { value: "+18.2%", label: "than last week", direction: "up" as const },
    },
    {
      icon: <AlertTriangle />,
      value: stats.pending,
      title: "Action Pending",
      trend: { value: "+18.2%", label: "than last week", direction: "up" as const },
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
      <div className="print:hidden">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onMenuSelect={(p) => setPage(p as any)}
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-4  sm:p-5 md:p-6 space-y-8 overflow-y-auto no-scrollbar">

        {/* ================== DASHBOARD PAGE ================== */}
        {page === "dashboard" && (
          <>
            {/* HEADER / SEARCH */}
            {/* HEADER / SEARCH */}
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3 print:hidden">
              <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <SquareSplitHorizontal className="w-5 h-5" />
              </button>
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Type to search..."
                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
              />
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-xs">
                JD
              </div>
            </div>

            {/* STATS GRID RESPONSIVE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 print:hidden">
              {statsData.map((card, i) => (
                <DynamicStatsCard key={i} {...card} />
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="space-y-4 print:hidden">
              <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider pl-1">Quick Actions</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, i) => (
                  <ActionCard
                    key={i}
                    {...action}
                    onClick={() => {
                      if (action.title === "Create New Record") {
                        setPage("createRecord");
                      } else if (action.title === "View All Registered Reports") {
                        setPage("viewReports");
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* TABLE / LIST SECTION */}
            <div className="space-y-4">
              <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider pl-1 print:hidden">
                All Registered Reports
              </h2>
              <DashboardReports />
            </div>
          </>
        )
        }

        {/* ================== CREATE NEW RECORD PAGE ================== */}
        {page === "createRecord" && <CreateNewRecordPanel setCollapsed={setCollapsed} />}

        {/* ================== VIEW ALL REPORTS PAGE ================== */}
        {page === "viewReports" && <AllRegisteredReports />}

        {/* ================== MULTI STEP FORM ================== */}
        {page === "multiForm" && <MultiStepForm />}
        {page === "staticSpeed" && <StaticSpeedForm />}
        {page === "investigation" && <MultiFormReport />}

      </div >
    </div >
  );
}
