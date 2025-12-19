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
} from "lucide-react";

import Sidebar from "../component/dashboard-components/Sidebar";
import ActionCard from "../component/dashboard-components/ActionCard";
import DynamicStatsCard from "../component/dashboard-components/DynamicStatsCard";
import CreateNewRecordPanel from "../component/dashboard-components/CreateNewRecordPanel";

import { useState } from "react";
import MultiStepForm from "../component/multi-step-form/MulitstepForm";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  //page controller
  const [page, setPage] = useState<"dashboard" | "createRecord" | "multiForm">(
    "dashboard"
  );

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
      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        {/* ================== DASHBOARD PAGE ================== */}
        {page === "dashboard" && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                Dashboard
              </h1>

              <input
                type="text"
                placeholder="Type to search..."
                className="w-[400px] px-4 py-2 border rounded-lg outline-none"
              />
            </div>

            <div className="grid grid-cols-4">
              {statsData.map((card, i) => (
                <DynamicStatsCard key={i} {...card} />
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Quick Actions</h2>

              <div className="grid grid-cols-3 gap-4">
                {quickActions.map((action, i) => (
                  <ActionCard
                    key={i}
                    {...action}
                    onClick={() => {
                      if (action.title === "Create New Record") {
                        setPage("multiForm");
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                All Registered Reports
              </h2>
              <p className="text-gray-500">Coming Soon...</p>
            </div>
          </>
        )}

        {/* ================== CREATE NEW RECORD PAGE ================== */}
        {page === "createRecord" && <CreateNewRecordPanel />}
        {page === "multiForm" && <MultiStepForm />}
      </div>
    </div>
  );
}
