"use client";
import {
    PieChart,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Files,
    BookOpen,
    LineChart,
    Database,
    User as UserIcon,
    LogOut,
    Shield,
    Siren,
    Gauge,
    ClipboardList,
    FileBadge,
} from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ConeIcon from "@/components/icons/ConeIcon";
import { useAuth } from "@/context/AuthContext";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { renderToStaticMarkup } from "react-dom/server";

// Local MenuItem type for sidebar items
interface MenuItem {
    icon?: ReactNode;
    label: ReactNode | string;
    href?: string;
    badge?: string;
    submenu?: Array<any>;
}

const cn = (...classes: (string | boolean)[]) =>
    classes.filter(Boolean).join(" ");

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState<string[]>([
        "Forms & Certificates",
        "Basic Information",
        "Military Structure Data",
    ]);

    console.log(user, "this is user");
    // Check if user is admin
    const isSuperAdmin = user?.role === "superadmin";

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

    // FIX: Added ': string' type annotation
    const toggleMenu = (label: string) => {
        setOpenMenus((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label],
        );
    };

    const isActive = (href: string | undefined) => {
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
            href: "/immediate-reporting-incident",
        },
    ];

    const createNewRecordItems = [
        {
            icon: <ConeIcon className="w-5 h-5" color="currentColor" />,
            label: (
                <>
                    <span className="font-bold">General & Traffic</span> Offence
                    Report
                </>
            ),
            href: "/create-record/general-traffic",
        },
        {
            icon: <Gauge className="w-5 h-5" />,
            label: (
                <>
                    <span className="font-bold">Static Speed</span> Check Report
                </>
            ),
            href: "/create-record/static-speed",
        },
        {
            icon: <ClipboardList className="w-5 h-5" />,
            label: (
                <>
                    MP Occurrence &{" "}
                    <span className="font-bold">Investigation</span> Report
                </>
            ),
            href: "/create-record/mp-investigation",
        },
    ];

    const reportsAndAnalysis = [
        {
            icon: <Files className="w-5 h-5" />,
            label: (
                <>
                    <span className="font-bold">All</span> Reports
                </>
            ),
            href: "/reports",
        },
        {
            icon: <BookOpen className="w-5 h-5" />,
            label: (
                <>
                    <span className="font-bold">Registers</span>/Books
                </>
            ),
            href: "/analysis/registers-books",
        },
        {
            icon: <LineChart className="w-5 h-5" />,
            label: (
                <>
                    MP Offence <span className="font-bold">Analysis</span>{" "}
                    Monthly <span className="font-bold"> Report</span>
                </>
            ),
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
                    label: (
                        <>
                            <span className="font-bold">Offence Types</span>{" "}
                            Management
                        </>
                    ),
                    href: "/setup/offence-type-management",
                },
                {
                    label: (
                        <>
                            <span className="font-bold">Civil Employees</span>{" "}
                            Managemen
                        </>
                    ),
                    href: "/setup/civil-employees",
                },
                {
                    label: (
                        <>
                            <span className="font-bold">
                                Vehicles Security Pass
                            </span>{" "}
                            Management
                        </>
                    ),
                    href: "/setup/vehicles-security-pass-management",
                },
            ],
        },
    ];

    // FIX: Added type annotations for item and isSubmenu
    // const renderMenuItem = (item: MenuItem, isSubmenu: boolean = false) => {
    const renderMenuItem = (item: any, isSubmenu = false) => {
        if (item.submenu) return null;
        const active = isActive(item.href);

        return (
            <Link
                key={item.label}
                href={item.href || "#"}
                {...(isCollapsed
                    ? {
                          "data-tooltip-id": "sidebar-tooltip",
                          "data-tooltip-html": renderToStaticMarkup(
                              typeof item.label === "string"
                                  ? item.label
                                  : item.label,
                          ),
                          "data-tooltip-place": "right",
                      }
                    : {})}
                className={cn(
                    "w-full relative flex items-center transition-all group rounded-lg my-2",
                    isCollapsed
                        ? "h-10 justify-center hover:bg-gray-100"
                        : cn(
                              "gap-3 px-4 py-2 hover:bg-gray-100 text-left",
                              isSubmenu && "py-1.5",
                              isActive(item.href) &&
                                  "bg-blue-50 text-blue-700 hover:bg-blue-50",
                          ),
                )}
            >
                {!isSubmenu && (
                    <span className="flex-shrink-0">{item.icon}</span>
                )}

                {!isCollapsed && (
                    <>
                        <span
                            className={cn(
                                "flex-1 whitespace-normal break-words leading-snug",
                                isSubmenu ? "text-sm" : "text-base",
                                isActive(item.href)
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

    // FIX: Added type annotation for item
    // const renderCollapsibleSection = (item: MenuItem) => {
    const renderCollapsibleSection = (item: any) => {
        if (!item.submenu) return renderMenuItem(item);
        const hasActiveSubmenu = item.submenu.some((sub: any) =>
            isActive(sub.href),
        );

        return (
            <Collapsible
                key={item.label}
                open={openMenus.includes(item.label)}
                onOpenChange={() => toggleMenu(item.label)}
                className="w-full"
            >
                <CollapsibleTrigger
                    {...(isCollapsed
                        ? {
                              "data-tooltip-id": "sidebar-tooltip",
                              "data-tooltip-html": renderToStaticMarkup(
                                  item.label,
                              ),
                              "data-tooltip-place": "right",
                          }
                        : {})}
                    className={cn(
                        "w-full flex items-center transition-all group rounded-lg",
                        isCollapsed
                            ? "h-10 justify-center hover:bg-gray-100"
                            : "gap-3 px-4 py-2.5 text-left hover:bg-gray-100",
                        hasActiveSubmenu && "bg-blue-50",
                    )}
                >
                    <span className="flex-shrink-0">{item.icon}</span>
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
                        {item.submenu.map((sub: any) => (
                            <div key={sub.label}>
                                {renderMenuItem(sub, true)}
                            </div>
                        ))}
                    </CollapsibleContent>
                )}
            </Collapsible>
        );
    };

    return (
        <div
            className={cn(
                "h-screen bg-white border-r border-gray-300 flex flex-col transition-all duration-300",
                isCollapsed ? "w-[74px]" : "w-[340px]",
            )}
        >
            <div className="p-4 flex items-center gap-3 relative group/sidebar">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" fill="white" />
                </div>
                {!isCollapsed && (
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Provost | 21 Corps
                        </h1>
                        <p className="text-sm text-gray-400 font-medium">
                            Central Command
                        </p>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm z-50 text-gray-500 hover:text-gray-900 opacity-0 group-hover/sidebar:opacity-100 transition-all"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            <nav
                className={cn(
                    "flex-1 overflow-y-auto no-scrollbar",
                    isCollapsed ? "px-2 pt-4" : "p-4 space-y-1",
                )}
            >
                <div className="mb-2">
                    {menuItems.map((item, idx) => (
                        <div key={idx}>{renderMenuItem(item)}</div>
                    ))}
                </div>
                <div className="w-full h-[1px] bg-gray-300 my-2" />
                <div className="mb-2">
                    {!isCollapsed && (
                        <h2 className="px-4 py-3 text-sm font-bold text-gray-400">
                            Create New Record
                        </h2>
                    )}
                    {createNewRecordItems.map((item, idx) => (
                        <div key={idx}>{renderMenuItem(item)}</div>
                    ))}
                </div>
                <div className="w-full h-px bg-gray-100 my-2" />
                <div className="mb-2">
                    {!isCollapsed && (
                        <h2 className="px-4 py-3 text-sm font-bold text-gray-400">
                            Reports & Analysis
                        </h2>
                    )}
                    {reportsAndAnalysis.map((item, idx) => (
                        <div key={idx}>{renderMenuItem(item)}</div>
                    ))}
                </div>
                <div className="w-full h-px bg-gray-100 my-2" />
                <div className="mb-2">
                    {renderCollapsibleSection(formsAndCertificates)}
                </div>
                <div className="w-full h-px bg-gray-100 my-2" />
                <div className="pb-4">
                    {!isCollapsed && (
                        <h2 className="px-4 py-3 text-sm font-bold text-gray-400">
                            System Setup
                        </h2>
                    )}
                    <div className="space-y-1">
                        {systemSetup.map((item, idx) => (
                            <div
                                key={
                                    typeof item.label === "string"
                                        ? (item.label as string)
                                        : `system-setup-${idx}`
                                }
                            >
                                {renderCollapsibleSection(item)}
                            </div>
                        ))}

                        {/* Conditional Rendering for Admin Only */}
                        {isSuperAdmin &&
                            renderMenuItem({
                                icon: <UserIcon className="w-5 h-5" />,
                                label: "User Access Management",
                                href: "/setup/users",
                            })}
                    </div>
                </div>
            </nav>

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
            {isCollapsed && (
                <Tooltip
                    id="sidebar-tooltip"
                    className="!text-sm !px-3 !py-2 !rounded-md !bg-gray-900 !text-white z-100"
                    delayShow={100}
                />
            )}
        </div>
    );
};

export default Sidebar;
