"use client";

import ActionCard from "../dashboard-components/ActionCard";
import { FileText, Gauge, ClipboardList } from "lucide-react";

export default function CreateNewRecordPanel() {
  const records = [
    {
      title: "General & Traffic Offence Record",
      icon: <FileText className="text-white" />,
    },
    {
      title: "Static Speed Check Record",
      icon: <Gauge className="text-white" />,
    },
    {
      title: "MP Occurrence & Investigation Record",
      icon: <ClipboardList className="text-white" />,
    },
  ];

  return (
    <div className="h-full w-full  flex flex-col">

      {/* -------- Breadcrumb -------- */}
      <div className="text-sm text-gray-500 mb-6">
        Dashboard / <span className="text-black font-medium">Create New Record</span>
      </div>

      <h2 className="text-xl text-gray-500 font-semibold mb-6 ml-32">Create New Record</h2>

      {/* -------- CENTER SECTION -------- */}
      <div className="flex flex-1 items-start justify-center">
        <div className="space-y-4  w-full max-w-7xl">
          {records.map((item, i) => (
            <ActionCard key={i} title={item.title} icon={item.icon} />
          ))}
        </div>
      </div>

    </div>
  );
}
