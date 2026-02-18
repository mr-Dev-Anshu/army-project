"use client";
import {
  PieChart,
  FileCheck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Files,
  BookOpen,
  LineChart,
  Database,
  Network,
  User as UserIcon,
  ClipboardList,
  Gauge,
  Shield,
  Siren,
  LogOut,
  FileBadge,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ConeIcon from "@/components/icons/ConeIcon";
import { useForm } from "@/context/FormContext";
import { useAuth } from "@/context/AuthContext";
import SimpleToolTip from "@/components/ui/SimpleToolTip";

/* ✅ TOOLTIP IMPORT (ADDED) */

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string;
  submenu?: MenuItem[];
}

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isSuperAdmin = user?.role?.toLowerCase() === "superadmin";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([
    "Forms & Certificates",
    "Basic Information",
  ]);

  const routesThatPreferCollapsed = [
    "/",
    "/create-record",
    "/forms",
    "/test",
    "/reports",
    "/analysis",
    "/setup",
    "/structure",
    "/hello",
  ];

  const shouldPreferCollapsed = () => {
    return routesThatPreferCollapsed.some((route) =>
      pathname.startsWith(route),
    );
  };

  useEffect(() => {
    const preferred = shouldPreferCollapsed();
    if (isCollapsed !== preferred) {
      setIsCollapsed(preferred);
    }
  }, [pathname]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const menuItems: MenuItem[] = [
    {
      icon: <PieChart className="w-5 h-5" />,
      label: "Dashboard",
      href: "/",
      badge: "1",
    },
    {
      icon: <Siren className="w-5 h-5" />,
      label: "Immediate Reporting of Incident (Initial Report)",
      href: "/create-record/immediate-reporting-incident",
    }
  ];

  const createNewRecordItems: MenuItem[] = [
    
    {
      icon: <ConeIcon className="w-5 h-5" color="currentColor" />,
      label: "General & Traffic Offence Report",
      href: "/create-record/general-traffic",
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: "Static Speed Check Report",
      href: "/create-record/static-speed",
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      label: "MP Occurrence & Investigation Report",
      href: "/create-record/mp-investigation",
    },
  ];

  const reportsAndAnalysis: MenuItem[] = [
    {
      icon: <Files className="w-5 h-5" />,
      label: "All Reports",
      href: "/reports",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Registers/Books",
      href: "/analysis/registers-books",
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      label: "MP Offence Analysis Monthly Report",
      href: "/analysis/mp-offence-monthly",
    },
  ];

  const formsAndCertificates: MenuItem = {
    icon: <FileBadge className="w-5 h-5" />,
    label: "Certificates, Letters & Forms",
    href: "/form-certificate/certificate",
  };

const systemSetup: MenuItem[] = [
  {
    icon: <Database className="w-5 h-5" />,
    label: "Basic Information",
    submenu: [
      {
        label: "Offence Types Management",
        href: "/setup/offence-type-management",
      },
      {
        label: "Civil Employees Management",
        href: "/setup/civil-employees",
      },
      {
        label: "Vehicles Security Pass Management",
        href: "/setup/vehicles-security-pass-management",
      },
    ],
  },

  // ✅ ONLY SUPER ADMIN CAN SEE
  ...(isSuperAdmin
    ? [
        {
          icon: <UserIcon className="w-5 h-5" />,
          label: "User Access Management",
          href: "/setup/users",
        },
      ]
    : []),
];

  const renderMenuItem = (item: MenuItem, isSubmenu = false) => {
    if (item.submenu) return null;
    const active = isActive(item.href);

    return (
      <Link
        href={item.href || "#"}
        className={cn(
          "w-full relative flex items-center transition-all group rounded-lg",
          isCollapsed
            ? "h-10 justify-center hover:bg-gray-100"
            : cn(
                "gap-3 px-4 py-2 hover:bg-gray-100 text-left",
                isSubmenu && "py-1.5",
                active && "bg-blue-50 text-blue-700 hover:bg-blue-50",
              ),
        )}
      >
        {!isSubmenu && (
          <span
            className={cn(
              "flex-shrink-0",
              active
                ? "text-blue-700"
                : "text-gray-500 group-hover:text-gray-900",
            )}
            {...(isCollapsed && {
              "data-tooltip-id": "sidebar-tooltip",
              "data-tooltip-content": item.label,
            })}
          >
            {item.icon}
          </span>
        )}

        {!isCollapsed && (
          <>
            <span
              className={cn(
                "flex-1 whitespace-normal break-words leading-snug",
                isSubmenu ? "text-sm" : "text-base",
                active
                  ? "text-blue-700 font-medium"
                  : "text-gray-600 group-hover:text-gray-900",
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
      </Link>
    );
  };

  const renderCollapsibleSection = (item: MenuItem) => {
    if (!item.submenu) return renderMenuItem(item);

    const hasActiveSubmenu = item.submenu.some((sub) => isActive(sub.href));

    return (
      <Collapsible
        key={item.label}
        open={openMenus.includes(item.label)}
        onOpenChange={() => toggleMenu(item.label)}
        className="w-full"
      >
        <CollapsibleTrigger
          className={cn(
            "w-full flex items-center transition-all group rounded-lg",
            isCollapsed
              ? "h-10 justify-center hover:bg-gray-100"
              : "gap-3 px-4 py-2.5 text-left hover:bg-gray-100",
            hasActiveSubmenu && "bg-blue-50",
          )}
        >
          <span
            className={cn(
              "flex-shrink-0",
              hasActiveSubmenu
                ? "text-blue-700"
                : "text-gray-500 group-hover:text-gray-900",
            )}
            {...(isCollapsed && {
              "data-tooltip-id": "sidebar-tooltip",
              "data-tooltip-content": item.label,
            })}
          >
            {item.icon}
          </span>

          {!isCollapsed && (
            <>
              <span
                className={cn(
                  "flex-1 text-base leading-snug",
                  hasActiveSubmenu
                    ? "text-blue-700 font-medium"
                    : "text-gray-600 group-hover:text-gray-900",
                )}
              >
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

        {!isCollapsed && (
          <CollapsibleContent className="pt-1 pl-4 ml-5 border-l border-gray-200 space-y-1">
            {item.submenu.map((sub) => (
              <div key={sub.label}>{renderMenuItem(sub, true)}</div>
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  };

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-[74px]" : "w-[340px]"
      )}
    >
      {/* HEADER */}
      <div className="p-4 flex items-center gap-3 relative group/sidebar">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" fill="white" />
        </div>

        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Provost | 21 Corps</h1>
            <p className="text-sm text-gray-400 font-medium">Central Command</p>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-50 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all opacity-0 group-hover/sidebar:opacity-100"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto no-scrollbar",
          isCollapsed ? "px-2 pt-4" : "p-4 space-y-1"
        )}
      >
        {/* Dashboard */}
        <div className="mb-4 mt-4">
          {menuItems.map((item) => (
            <div key={item.label}>{renderMenuItem(item)}</div>
          ))}
        </div>

        <div className="w-full h-px bg-gray-100 my-2" />

        {/* Create New Record */}
        <div className="mb-2">
          {!isCollapsed && (
            <h2 className="px-4 py-3 text-sm font-bold text-gray-400">
              Create New Record
            </h2>
          )}
          <div className="space-y-1">
            {createNewRecordItems.map((item) => (
              <div key={item.label}>{renderMenuItem(item)}</div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 my-2" />

        {/* Reports & Analysis */}
        <div className="mb-2">
          {!isCollapsed && (
            <h2 className="px-4 py-3 text-sm font-bold text-gray-400">
              Reports & Analysis
            </h2>
          )}
          <div className="space-y-1">
            {reportsAndAnalysis.map((item) => (
              <div key={item.label}>{renderMenuItem(item)}</div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 my-2" />

        {/* Forms & Certificates */}
        <div className="mb-2">{renderCollapsibleSection(formsAndCertificates)}</div>

        <div className="w-full h-px bg-gray-100 my-2" />

        {/* System Setup */}
        <div className="pb-4">
          {!isCollapsed && (
            <h2 className="px-4 py-3 text-sm font-bold text-gray-400">
              System Setup
            </h2>
          )}
          <div className="space-y-1">
            {systemSetup.map((item) => (
              <div key={item.label}>{renderCollapsibleSection(item)}</div>
            ))}
          </div>
        </div>
      </nav>

      {/* USER PROFILE & LOGOUT */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || "Role"}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
      <SimpleToolTip />
    </div>
  );
};

export default Sidebar;