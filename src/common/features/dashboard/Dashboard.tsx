"use client";

import {
  Gauge,
  AlertTriangle,
  Search,
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
import ConeIcon from "@/components/icons/ConeIcon";
import MpAlertIcon from "@/components/icons/MpAlertIcon";
import CivilEmployeePage from "@/features/civilEmployee";

import MpOffenceAnalysisMonthlyReport from "@/features/mpOffenceAnalysisMonthlyReport";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const [page, setPage] = useState<
    | "dashboard"
    | "createRecord"
    | "multiForm"
    | "staticSpeed"
    | "investigation"
    | "viewReports"
    | "mpOffenceAnalysis"
    | "civilEmployees"
  >("dashboard");

  // Fetch Data
  const { data: trafficOffences } = useGetAllTrafficOffences({
    groupBy: "offenceType",
  });
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
    const pendingCount = allTrafficOffences.filter(
      (o: any) => o.actionStatus === false
    ).length;

    return {
      traffic: trafficCount,
      staticSpeed: staticSpeedCount,
      mp: mpCount,
      pending: pendingCount,
    };
  }, [allTrafficOffences, staticSpeedRecords, mpReports]);

  const statsData = [
    {
      icon: <ConeIcon className="w-full h-full" color="currentColor" />,
      value: stats.traffic,
      title: "Total General Traffic & Offence Reports",
      trend: {
        value: "+18.2%",
        label: "than last week",
        direction: "up" as const,
      },
      iconBgColor: "bg-gray-100",
      iconColor: "text-[#0A0A0A]",
    },
    {
      icon: <Gauge />,
      value: stats.staticSpeed,
      title: "Total Static Speed Reports",
      trend: {
        value: "+18.2%",
        label: "than last week",
        direction: "up" as const,
      },
      iconBgColor: "bg-gray-100",
      iconColor: "text-[#0A0A0A]",
    },
    {
      icon: <MpAlertIcon className="w-full h-full" color="currentColor" />,
      value: stats.mp,
      title: "Total MP Occurrence & Investigation Reports",
      trend: {
        value: "+18.2%",
        label: "than last week",
        direction: "up" as const,
      },
      iconColor: "text-[#0A0A0A]",
    },
    {
      icon: <AlertTriangle />,
      value: stats.pending,
      title: "Action Pending",
      trend: {
        value: "+18.2%",
        label: "than last week",
        direction: "up" as const,
      },
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
      cardBgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  const quickActions = [
    {
      title: "Create New Record",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 2V8H20"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 15H9"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 12V18"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "View All Registered Reports",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 2V8H20"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 13H8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 17H8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 9H8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Certificates & Forms",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 13C12.7956 13 13.5587 12.6839 14.1213 12.1213C14.6839 11.5587 15 10.7956 15 10C15 9.20435 14.6839 8.44129 14.1213 7.87868C13.5587 7.31607 12.7956 7 12 7C11.2044 7 10.4413 7.31607 9.87868 7.87868C9.31607 8.44129 9 9.20435 9 10C9 10.7956 9.31607 11.5587 9.87868 12.1213C10.4413 12.6839 11.2044 13 12 13Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 12.5L15 18L12 17L9 18L10 12.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "MP General Diary & Daily Occurrence Book",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Outsidery Report Analysis Module",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Military Structure",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
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

            {/* STATS GRID RESPONSIVE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 print:hidden">
              {statsData.map((card, i) => (
                <DynamicStatsCard key={i} {...card} />
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="space-y-4 print:hidden">
              <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider pl-1">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, i) => (
                  <ActionCard
                    key={i}
                    {...action}
                    onClick={() => {
                      if (action.title === "Create New Record") {
                        setPage("createRecord");
                      } else if (
                        action.title === "View All Registered Reports"
                      ) {
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
        )}

        {/* ================== CREATE NEW RECORD PAGE ================== */}
        {page === "createRecord" && (
          <CreateNewRecordPanel setCollapsed={setCollapsed} />
        )}

        {/* ================== VIEW ALL REPORTS PAGE ================== */}
        {page === "viewReports" && <AllRegisteredReports />}

        {/* ================== MULTI STEP FORM ================== */}
        {page === "multiForm" && (
          <MultiStepForm
            onCancel={() => {
              setPage("dashboard");
            }}
          />
        )}

        {page === "staticSpeed" && <StaticSpeedForm onCancel={()=>setPage("dashboard")} />}
        {page === "investigation" && <MultiFormReport onCancel={()=>setPage("dashboard")} />}
        {page === "mpOffenceAnalysis" && <MpOffenceAnalysisMonthlyReport />}
        {page === "civilEmployees" && <CivilEmployeePage />}
      </div>
    </div>
  );
}
