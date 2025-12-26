"use client";

import { useState } from "react";
import ActionCard from "./ActionCard";
import { FileText, Gauge, ClipboardList } from "lucide-react";
import MultiStepForm from "@/common/component/multi-step-form/MulitstepForm";
import StaticSpeedForm from "@/common/component/staticSpeedForm/MainForm";
import MultiFormReport from "@/common/component/investigation-report/MultiFormReport";

export default function CreateNewRecordPanel({ setCollapsed }: any) {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const records = [
    {
      title: "General & Traffic Offence Record",
      icon: <FileText className="text-white" />,
      key: "general",
    },
    {
      title: "Static Speed Check Record",
      icon: <Gauge className="text-white" />,
      key: "speed",
    },
    {
      title: "MP Occurrence & Investigation Record",
      icon: <ClipboardList className="text-white" />,
      key: "mp",
    },
  ];

  const handleSelect = (key: string) => {
    setSelectedRecord(key);
    setCollapsed(true); //  Sidebar Auto Collapse
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        Dashboard /
        <span className="text-black font-medium"> Create New Record</span>
      </div>

      {/* ---------- HEADING + CARDS ---------- */}
      {!selectedRecord && (
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <h2 className="text-xl text-gray-500 font-semibold mb-6">
              Create New Record
            </h2>

            <div className="space-y-4">
              {records.map((item) => (
                <ActionCard
                  key={item.key}
                  title={item.title}
                  icon={item.icon}
                  onClick={() => handleSelect(item.key)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------- GENERAL FORM ---------- */}
      {selectedRecord === "general" && (
        <div className="w-full  mx-auto">
          <MultiStepForm />
        </div>
      )}

      {/* ---------- SPEED FORM ---------- */}
      {selectedRecord === "speed" && (
        <div className="w-full  p-6 border rounded-xl">
          <StaticSpeedForm />
        </div>
      )}

      {/* ---------- MP FORM ---------- */}
      {selectedRecord === "mp" && (
        <div className="w-full  p-6 border rounded-xl ">
          <MultiFormReport/>
      </div>
        
      )}
    </div>
  );
}
