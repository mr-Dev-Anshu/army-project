"use client";

import {
  PieChart,
  ClipboardList,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Files,
  BookOpen,
  LineChart,
  Database,
  Shield,
  ChevronLeft,
  Gauge,
  Network,
  User as UserIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import ConeIcon from "@/components/icons/ConeIcon";
import Tooltip from "./Tooltip";


const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface MenuItem {
  icon?: ReactNode;
  label: string;
  badge?: string;
  submenu?: MenuItem[];
  action?: string;
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  onMenuSelect: (page: string) => void;
  activeAction?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: <PieChart className="w-5 h-5" />, label: "Dashboard", action: "dashboard" },
];

const FORMS_AND_CERTIFICATES: MenuItem = {
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

const REPORTS_AND_ANALYSIS: MenuItem[] = [
  { icon: <Files className="w-5 h-5" />, label: "All Reports", action: "viewReports" },
  { icon: <BookOpen className="w-5 h-5" />, label: "Registers/Books" },
  {
    icon: <LineChart className="w-5 h-5" />,
    label: "MP Offence Analysis Monthly Report",
    action: "mpOffenceAnalysis",
  },
];

const SYSTEM_SETUP: MenuItem[] = [
  {
    icon: <Database className="w-5 h-5" />,
    label: "Basic Information",
    submenu: [
      { label: "Offence Types" },
      { label: "Civil Employees Management", action: "civilEmployees" },
      { label: "Vehicles (Make & Take)" },
      { label: "Ranks" },
      { label: "Units" },
      { label: "Installation" },
    ],
  },
  {
    icon: <Network className="w-5 h-5" />,
    label: "Military Structure Data",
    submenu: [
      { label: "Brigade" },
      { label: "Division" },
      { label: "Corps / Sub-Area" },
      { label: "Command / Area" },
    ],
  },
  { icon: <UserIcon className="w-5 h-5" />, label: "User Access Management" },
];

const QUICK_ACTIONS: MenuItem[] = [
  {
    icon: <ConeIcon className="w-5 h-5" color="currentColor" />,
    label: "General & Traffic Offence Report",
    action: "multiForm",
  },
  {
    icon: <Gauge className="w-5 h-5" />,
    label: "Static Speed Check Report",
    action: "staticSpeed",
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    label: "MP Occurrence & Investigation Report",
    action: "investigation",
  },
];

function Sidebar({ collapsed, setCollapsed, onMenuSelect, activeAction }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [localActive, setLocalActive] = useState<string | undefined>();

  const currentAction = activeAction ?? localActive;

  const handleMenuSelect = (action?: string) => {
    if (!action) return;
    setLocalActive(action);
    onMenuSelect(action);
    setCollapsed(true);
  };

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const renderMenuItem = (item: MenuItem, isSubmenu = false) => (
    <button
      key={item.label}
      onClick={() => handleMenuSelect(item.action)}
      aria-pressed={item.action === currentAction}
      className={cn(
        "w-full relative flex items-center transition-all group",
        item.action === currentAction && "bg-gray-100 text-gray-900",
        collapsed
          ? "h-10 justify-center hover:bg-gray-100 rounded-lg"
          : cn(
            "gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg text-left",
            isSubmenu && "py-1.5"
          )
      )}
    >
      {!isSubmenu && (
        <span
          className={cn(
            "flex-shrink-0 relative",
            item.action === currentAction
              ? "text-gray-900"
              : "text-gray-500 group-hover:text-gray-900"
          )}
        >
          {item.icon}

          {collapsed && <Tooltip label={item.label} />}
        </span>
      )}

      {!collapsed && (
        <>
          <span
            className={cn(
              "flex-1 text-gray-600 group-hover:text-gray-900 whitespace-normal break-words leading-snug",
              isSubmenu ? "text-sm" : "text-base",
              item.action === currentAction && "text-gray-900 font-medium"
            )}
          >
            {item.label}
          </span>

          {item.badge && (
            <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-gray-200 text-gray-600 rounded-full">
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
            "w-full flex items-center transition-all group relative",
            collapsed
              ? "h-10 justify-center hover:bg-gray-100 rounded-lg"
              : "gap-3 px-4 py-2.5 text-left hover:bg-gray-100 rounded-lg"
          )}
        >
          <span className="text-gray-500 group-hover:text-gray-900 flex-shrink-0 relative">
            {item.icon}

            {collapsed && <Tooltip label={item.label} />}
          </span>

          {!collapsed && (
            <>
              <span className="flex-1 text-base text-gray-600 group-hover:text-gray-900 leading-snug">
                {item.label}
              </span>
              {openMenus.includes(item.label) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </>
          )}
        </CollapsibleTrigger>

        {!collapsed && (
          <CollapsibleContent className="pt-1 pl-4 ml-5 border-l border-gray-400 space-y-1">
            {item.submenu?.map((sub) => renderMenuItem(sub, true))}
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  };


  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-300 flex flex-col transition-all duration-300",
        collapsed ? "w-[74px]" : "w-[340px]"
      )}
    >
      {/* HEADER */}
      <div className="p-4 flex items-center gap-3 relative group/sidebar">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" fill="white" />
        </div>

        {!collapsed && (
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Brand name</h1>
            <p className="text-xs text-gray-400 font-medium">Brand name</p>
          </div>
        )}

        <button
          className="cursor-pointer absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-50 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all opacity-0 group-hover/sidebar:opacity-100"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav
        className={cn(
          "flex-1 ",
          collapsed ? "px-2 pt-4" : "p-4 space-y-1"
        )}
      >
        {/* Dashboard */}
        <div className="mb-2">{MENU_ITEMS.map((item) => renderMenuItem(item))}</div>

        <div className="w-full h-px bg-gray-300 my-2" />

        {/* Create New Record */}
        <div className="mb-2">
          {!collapsed && (
            <h2 className="px-4 py-3 text-sm font-bold text-gray-400">
              Create New Record
            </h2>
          )}

          <div className="space-y-1">
            {QUICK_ACTIONS.map((item) => renderMenuItem(item))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-300 my-2" />

        {/* Reports */}
        {!collapsed && (
          <h2 className="px-4 py-3 text-sm font-bold text-gray-400">
            Reports & Analysis
          </h2>
        )}
        {REPORTS_AND_ANALYSIS.map((item) => renderMenuItem(item))}

        <div className="w-full h-px bg-gray-300 my-2" />

        {renderCollapsibleSection(FORMS_AND_CERTIFICATES)}

        <div className="w-full h-px bg-gray-300 my-2" />

        {!collapsed && (
          <h2 className="px-4 py-3 text-sm font-bold text-gray-400">
            System Setup
          </h2>
        )}
        {SYSTEM_SETUP.map((item) => renderCollapsibleSection(item))}
      </nav>
    </div>
  );
}

export default Sidebar;
