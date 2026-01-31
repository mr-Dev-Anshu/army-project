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

const StatsCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-5 space-y-4">
      <div className="h-10 w-10 bg-gray-200 rounded-lg" />
      <div className="h-4 w-40 bg-gray-200 rounded" />
      <div className="h-8 w-24 bg-gray-300 rounded" />
      <div className="h-3 w-20 bg-gray-200 rounded" />
    </div>
  );
};

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  // Fetch Data
  const { data: trafficOffences, isLoading: trafficLoading } =
    useGetAllTrafficOffences({ groupBy: "offenceType" });

  const { data: staticSpeedRecords, isLoading: speedLoading } =
    useGetStaticSpeedRecords();

  const { data: mpReports, isLoading: mpLoading } = useGetAllMPReports();

  const isStatsLoading = trafficLoading || speedLoading || mpLoading;

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

  const todayFormatted = useMemo(() => {
    const now = new Date();

    const date = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const day = now.toLocaleDateString("en-GB", {
      weekday: "long",
    });

    return `${date} | ${day}`;
  }, []);

  const stats = useMemo(() => {
    const trafficCount = allTrafficOffences.length;
    const staticSpeedCount = staticSpeedRecords?.length || 0;
    const mpCount = mpReports?.length || 0;
    const pendingCount = allTrafficOffences.filter(
      (o: any) => o.actionStatus === false,
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
      href: "/create-record",
    },
    {
      title: "View All Reports",
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
      href: "/reports",
    },
    {
      title: "Registers/Books",
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
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      href: "/analysis/registers-books",
    },
    {
      title: "MP Offence Analysis Monthly Report",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3V21H21"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 9L14 14L10 10L7 13"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      href: "/analysis/mp-offence-monthly",
    },
    {
      title: "Certificates, Letters & Forms",
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
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      href: "/form-certificate/certificate",
    },
    {
      title: "Civil Employees Management",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 21.0028V19.0028C21.9993 18.1165 21.7044 17.2556 21.1614 16.5551C20.6184 15.8547 19.8581 15.3544 19 15.1328"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16 3.13281C16.8604 3.35311 17.623 3.85351 18.1676 4.55512C18.7122 5.25673 19.0078 6.11964 19.0078 7.00781C19.0078 7.89598 18.7122 8.75889 18.1676 9.4605C17.623 10.1621 16.8604 10.6625 16 10.8828"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      href: "/setup/civil-employees",
    },
    {
      title: "Vehicles Security Pass Management",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 17H21C21.6 17 22 16.6 22 16V13C22 12.1 21.3 11.3 20.5 11.1C18.7 10.6 16 10 16 10C16 10 14.7 8.6 13.8 7.7C13.3 7.3 12.7 7 12 7H5C4.4 7 3.9 7.4 3.6 7.9L2.2 10.8C2.06758 11.1862 2 11.5917 2 12V16C2 16.6 2.4 17 3 17H5"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7 19C8.10457 19 9 18.1046 9 17C9 15.8954 8.10457 15 7 15C5.89543 15 5 15.8954 5 17C5 18.1046 5.89543 19 7 19Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 17H15"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 19C18.1046 19 19 18.1046 19 17C19 15.8954 18.1046 15 17 15C15.8954 15 15 15.8954 15 17C15 18.1046 15.8954 19 17 19Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      href: "/setup/vehicles-security-pass-management",
    },
    {
      title: "Offence Types Management",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.9969 13L6.49687 20.5C5.66687 21.33 4.32687 21.33 3.49687 20.5C3.29973 20.3031 3.14333 20.0693 3.03663 19.8119C2.92992 19.5545 2.875 19.2786 2.875 19C2.875 18.7214 2.92992 18.4455 3.03663 18.1881C3.14333 17.9307 3.29973 17.6969 3.49687 17.5L10.9969 10"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16 16L22 10"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 8L14 2"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 7L17 15"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M21 11L13 3"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      href: "/setup/offence-type-management",
    },
  ];
  return (
    <div className="w-full h-screen flex bg-[#f5f5f7]">
      {/* SIDEBAR */}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-8 overflow-y-auto no-scrollbar">
        {/* HEADER / SEARCH */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-gray-500"
            >
              <span className="flex items-center pr-3 mr-2 border-r border-gray-300">
                <SquareSplitHorizontal className="w-5 h-5" />{" "}
              </span>
            </button>
          </div>

          {/* DATE */}
          <div className="text-sm text-gray-600 font-medium">
            {todayFormatted}
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 print:hidden">
          {isStatsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))
            : statsData.map((card, i) => (
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
