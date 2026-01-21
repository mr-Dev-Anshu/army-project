"use client";

import { useRouter } from "next/navigation";
import { Gauge, ClipboardList, PanelLeft, Siren, Car } from "lucide-react";
import Link from "next/link";
import ConeIcon from "@/components/icons/ConeIcon";

export default function CreateNewRecordPanel({ setCollapsed }: any) {
  const router = useRouter();

  const records = [
    {
      title: "(Initial Report) Immediate Reporting of Incident",
      icon: <Siren className="w-6 h-6 text-white" color="white" />,
      bgColor: "bg-[#FF9933]",
      key: "immediate-reporting-incident",
      path: "/create-record/immediate-reporting-incident",
    },
    {
      title: "General & Traffic Offence Reports",
      icon: <ConeIcon className="w-6 h-6 text-white" color="white" />,
      bgColor: "bg-[#1E293B]", // Dark navy/slate
      key: "general",
      path: "/create-record/general-traffic",
    },
    {
      title: "Static Speed Check Reports",
      icon: <Gauge className="w-6 h-6 text-white" />,
      bgColor: "bg-[#556B2F]", // Dark olive green
      key: "speed",
      path: "/create-record/static-speed",
    },
    {
      title: "MP Occurrence & Investigation Reports",
      icon: <ClipboardList className="w-6 h-6 text-white" />,
      bgColor: "bg-[#7F1D1D]", // Dark red
      key: "mp",
      path: "/create-record/mp-investigation",
    },
    {
      title: "(MT Accident) Mechanical Transport Accident Report",
      icon: <Car className="w-6 h-6 text-white" />,
      bgColor: "bg-[#C2A14D]",
      key: "mtAccident",
      path: "/create-record/mt-accident",
    },
  ];

  const handleSelect = (path: string) => {
    if (setCollapsed) setCollapsed(true); // Sidebar Auto Collapse
    router.push(path);
  };

  return (
    <div className="h-full w-full ">
      {/* ---------- HEADER / BREADCRUMB ---------- */}
      <div className="flex items-center gap-4 text-sm text-[#0A0A0A] mb-6 pb-4 border-b border-gray-200">
        <PanelLeft className="w-5 h-5 text-gray-500" />
        <div className="h-4 w-[1px] bg-gray-200"></div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
            <path d="M0.75 8.75L4.75 4.75L0.75 0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-semibold text-[#0A0A0A]">Create New Record</span>
        </div>
      </div>

      <div className="space-y-1 mb-8">
        <h1 className="text-lg font-bold text-[#404040]">Create New Record</h1>
      </div>

      {/* ---------- CARDS GRID ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl">
        {records.map((item) => (
          <div
            key={item.key}
            onClick={() => handleSelect(item.path)}
            className="bg-white border-transparent rounded-2xl p-5 h-44 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group shadow-sm"
          >
            {/* Icon Circle */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bgColor}`}>
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 leading-tight">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
