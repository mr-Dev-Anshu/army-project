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
import DashboardReports from "./components/dashboard-components/DashboardReports";

import { useState, useMemo } from "react";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";
import { useGetStaticSpeedRecords } from "@/features/staticSpeed/hooks";
import { useGetAllMPReports } from "@/features/mpReports/hooks";
import ConeIcon from "@/components/icons/ConeIcon";
import MpAlertIcon from "@/components/icons/MpAlertIcon";
import Link from "next/link";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  // Fetch Data
  const { data: trafficOffences } = useGetAllTrafficOffences({
    groupBy: "offenceType",
  });
  const { data: staticSpeedRecords } = useGetStaticSpeedRecords();
  const { data: mpReports } = useGetAllMPReports();

  // Process Traffic Offences
  const allTrafficOffences = useMemo(() => {
    if (!trafficOffences) return [];
    let flattened: any[] = [];
    if (Array.isArray(trafficOffences)) {
      trafficOffences.forEach((group: any) => {
        if (group.offences) {
          flattened = [...flattened, ...group.offences];
        } else {
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 15H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 12V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: "/create-record", // Will be a separate page
    },
    {
      title: "View All Registered Reports",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: "/reports", // Separate page
    },
    // You can add more quick actions later pointing to their respective routes
  ];

  return (
    <div className="w-full h-screen flex bg-[#f5f5f7]">
      {/* SIDEBAR */}
     

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-8 overflow-y-auto no-scrollbar">
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

        {/* STATS GRID */}
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
              <Link key={i} href={action.href} className="block">
                <ActionCard {...action} />
              </Link>
            ))}
          </div>
        </div>

        {/* RECENT REPORTS TABLE */}
        <div className="space-y-4">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider pl-1 print:hidden">
            Recent Registered Reports
          </h2>
          <DashboardReports />
        </div>
      </div>
    </div>
  );
}