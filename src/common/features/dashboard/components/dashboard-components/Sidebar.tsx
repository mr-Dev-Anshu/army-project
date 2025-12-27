"use client";

import {
  PieChart,
  Users,
  Clock,
  ClipboardList,
  FileCheck,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Car,
  Book,
  FileBarChart,
  Database,
  Shield,
  ChevronLeft,
  FileText,
  Settings,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface MenuItem {
  icon?: React.ReactNode;
  label: string;
  badge?: string;
  submenu?: MenuItem[];
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onMenuSelect: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  onMenuSelect,
}) => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const menuItems: MenuItem[] = [
    { icon: <PieChart className="w-5 h-5" />, label: "Dashboard", badge: "1" },
  ];

  const formsAndCertificates: MenuItem = {
    icon: <FileCheck className="w-5 h-5" />,
    label: "Forms & Certificates",
    submenu: [
      { label: "Compromise Certificate" },
      { label: "Confiscation Certificate" },
      { label: "Handing/Taking Certificate" },
      { label: "MP Report Form" },
      { label: "Contact Numbers" },
      { label: "Letters" },
    ],
  };

  const reportsAndAnalysis: MenuItem[] = [
    {
      icon: <FileBarChart className="w-5 h-5" />,
      label: "All Reports",
    },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Analysis Dashboard" },
    { icon: <Users className="w-5 h-5" />, label: "Civil Employee Analysis" },
    { icon: <Car className="w-5 h-5" />, label: "Vehicle Tracking" },
    {
      icon: <Book className="w-5 h-5" />,
      label: "MP General Diary & Daily Occurrence Book",
    },
    {
      icon: <FileBarChart className="w-5 h-5" />,
      label: "Outsidery Report Analysis Module",
    },
  ];

  const systemSetup: MenuItem[] = [
    {
      icon: <Database className="w-5 h-5" />,
      label: "Basic Information",
      submenu: [
        { label: "Installation" },
        { label: "Ranks" },
        { label: "Units" },
        { label: "Vehicles (Make & Take)" },
        { label: "Offence Types" },
        { label: "Civil Employees" },
      ],
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Military Structure Data",
      submenu: [
        { label: "Brigade" },
        { label: "Division" },
        { label: "Corps/Sub-Area" },
        { label: "Command/Area" },
      ],
    },
    { icon: <Settings className="w-5 h-5" />, label: "User Access Management" },
  ];

  const renderMenuItem = (item: MenuItem, isSubmenu = false) => (
    <button
      key={item.label}
      onClick={() => {
        if (item.label === "Dashboard") onMenuSelect("dashboard");
        if (item.label === "All Reports") onMenuSelect("viewReports");
      }}
      className={cn(
        "w-full relative flex items-center transition-all",
        collapsed
          ? "h-12 justify-center hover:bg-gray-100 rounded-lg"
          : "px-4 py-2.5 gap-3 hover:bg-gray-100 rounded-lg",
        isSubmenu && !collapsed && "pl-12"
      )}
    >
      {/* ICON */}
      <span className="text-gray-700 flex-shrink-0">{item.icon}</span>

      {/* TEXT IN EXPANDED */}
      {!collapsed && (
        <>
          <span className="flex-1 text-base text-gray-700 text-left whitespace-normal break-words leading-snug">
            {item.label}
          </span>

          {item.badge && (
            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  );

  const renderCollapsibleSection = (item: MenuItem) => {
    if (!item.submenu) return renderMenuItem(item);

    return (
      <Collapsible
        key={item.label}
        open={openMenus.includes(item.label)}
        onOpenChange={() => toggleMenu(item.label)}
        className="w-full"
      >
        <CollapsibleTrigger
          className={cn(
            "w-full flex items-center transition-all",
            collapsed
              ? "h-12 justify-center hover:bg-gray-100 rounded-lg"
              : "gap-3 px-4 py-2.5 text-left hover:bg-gray-100 rounded-lg"
          )}
        >
          <span className="text-gray-400 flex-shrink-0">{item.icon}</span>

          {!collapsed && (
            <>
              <span className="flex-1 text-lg text-gray-600">{item.label}</span>
              {openMenus.includes(item.label) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </>
          )}
        </CollapsibleTrigger>

        {!collapsed && (
          <CollapsibleContent className="pt-1">
            {item.submenu?.map((sub) => renderMenuItem(sub, true))}
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  };

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-[90px]" : "w-[340px]"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-white" />
        </div>

        {!collapsed && (
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">Brand name</h1>
            <p className="text-xs text-gray-400">Brand name</p>
          </div>
        )}

        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav
        className={cn(
          "flex-1 overflow-y-auto side-scrollbar",
          collapsed ? "px-0 pt-4" : "p-4 space-y-1"
        )}
      >
        {/* Dashboard */}
        <div className={collapsed ? "px-2" : ""}>
          {menuItems.map((item) => renderMenuItem(item))}
        </div>

        {/* Divider */}
        {collapsed && <div className="w-full h-px bg-gray-200 my-4" />}

        {/* Create New Record Section */}
        <div className={collapsed ? "pt-4 px-2" : "pt-6"}>
          {!collapsed && (
            <h2 className="px-4 py-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
              Create New Record
            </h2>
          )}

          <div className="space-y-1">
            {/* 1️⃣ GENERAL & TRAFFIC */}
            <button
              onClick={() => onMenuSelect("multiForm")}
              className={cn(
                "w-full flex items-start transition-all",
                collapsed
                  ? "h-12 justify-center hover:bg-gray-100 rounded-lg"
                  : "gap-3 px-4 py-2.5 hover:bg-gray-100 rounded-lg"
              )}
            >
              <span className="text-gray-400 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </span>

              {!collapsed && (
                <span className="text-base text-left text-gray-600 whitespace-normal break-words leading-snug flex-1">
                  General & Traffic Offence Report
                </span>
              )}
            </button>

            {/* 2️⃣ STATIC SPEED */}
            <button
              onClick={() => onMenuSelect("staticSpeed")}
              className={cn(
                "w-full flex items-start transition-all",
                collapsed
                  ? "h-12 justify-center hover:bg-gray-100 rounded-lg"
                  : "gap-3 px-4 py-2.5 hover:bg-gray-100 rounded-lg"
              )}
            >
              <span className="text-gray-400 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </span>

              {!collapsed && (
                <span className="text-base text-left text-gray-600 whitespace-normal break-words leading-snug flex-1">
                  Static Speed Check Report
                </span>
              )}
            </button>

            {/* 3️⃣ MP REPORT */}
            <button
              onClick={() => onMenuSelect("investigation")}
              className={cn(
                "w-full flex items-start transition-all",
                collapsed
                  ? "h-12 justify-center hover:bg-gray-100 rounded-lg"
                  : "gap-3 px-4 py-2.5 hover:bg-gray-100 rounded-lg"
              )}
            >
              <span className="text-gray-400 flex-shrink-0">
                <ClipboardList className="w-5 h-5" />
              </span>

              {!collapsed && (
                <span className="text-base text-left text-gray-600 whitespace-normal break-words leading-snug flex-1">
                  MP Occurrence & Investigation Report
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        {collapsed && <div className="w-full h-px bg-gray-200 my-4" />}

        {/* Forms & Certificates */}
        <div className={collapsed ? "px-2" : ""}>
          {renderCollapsibleSection(formsAndCertificates)}
        </div>

        {/* Divider */}
        {collapsed && <div className="w-full h-px bg-gray-200 my-4" />}

        {/* Reports & Analysis Section */}
        <div className={collapsed ? "pt-4 px-2" : "pt-6"}>
          {!collapsed && (
            <h2 className="px-4 py-2 text-base font-bold text-gray-400 uppercase tracking-wider">
              Reports & Analysis
            </h2>
          )}
          <div className="flex flex-col items-start justify-start w-full">
            {reportsAndAnalysis.map((item) => renderMenuItem(item))}
          </div>
        </div>

        {/* Divider */}
        {collapsed && <div className="w-full h-px bg-gray-200 my-4" />}

        {/* System Setup Section */}
        <div className={collapsed ? "pt-4 px-2 pb-4" : "pt-6 pb-4"}>
          {!collapsed && (
            <h2 className="px-4 py-2 text-base font-bold text-gray-400 uppercase tracking-wider">
              System Setup
            </h2>
          )}
          {systemSetup.map((item) => renderCollapsibleSection(item))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;