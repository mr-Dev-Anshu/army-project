"use client";

import { useRouter } from "next/navigation";
import { Gauge, ClipboardList, LayoutDashboard, ChevronRight } from "lucide-react";
import ConeIcon from "@/components/icons/ConeIcon";

export default function CreateNewRecordPanel({ setCollapsed }: any) {
  const router = useRouter();

  const records = [
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
  ];

  const handleSelect = (path: string) => {
    if (setCollapsed) setCollapsed(true); // Sidebar Auto Collapse
    router.push(path);
  };

  return (
    <div className="h-full w-full">
      {/* ---------- HEADER / BREADCRUMB ---------- */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-semibold text-gray-900">Create New Record</span>
      </div>

      <div className="mb-2">
        <h2 className="text-gray-500 text-sm font-medium mb-6">Create New Record</h2>
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
