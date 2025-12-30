"use client";

import React, { useState } from "react";
import { ShoppingCart, HardHat } from "lucide-react";
import ShopkeeperTable from "./shopkeeper/components/ShopkeeperTable";
import MaidServantTable from "./maid_Servant/component/MaidServantTable";
import TemporaryHiredTable from "./temporaryHired/components/TemporaryHiredTable";
import RightSideSheet from "@/components/common/RightSideSheet";
import ShopkeeperSecurityPassEntryForm from "./shopkeeper/components/form";
import MaidServantSecurityPassEntryForm from "./maid_Servant/component/form";
import TemporaryHiredWorkerPassForm from "./temporaryHired/components/form";

type CivilEmployeeView = "menu" | "shopkeepers" | "maidServants" | "temporaryWorkers";

const CivilEmployeePage = () => {
    const [currentView, setCurrentView] = useState<CivilEmployeeView>("menu");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingShopkeeper, setEditingShopkeeper] = useState<any>(null);
    const [editingMaidServant, setEditingMaidServant] = useState<any>(null);
    const [editingTemporaryWorker, setEditingTemporaryWorker] = useState<any>(null);

    const cards = [
        {
            title: "Shopkeepers & Workers Security Passes",
            icon: <ShoppingCart className="w-8 h-8 text-white" />,
            onClick: () => setCurrentView("shopkeepers"),
        },
        {
            title: "Maid Servants Security Passes",
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18.6667 25.6667L17.5 21"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M22.1641 16.3217C22.4735 16.3217 22.7702 16.1988 22.989 15.98C23.2078 15.7612 23.3307 15.4645 23.3307 15.155V14C23.3307 13.3812 23.0849 12.7877 22.6473 12.3501C22.2097 11.9125 21.6162 11.6667 20.9974 11.6667H17.4974C17.188 11.6667 16.8912 11.5438 16.6724 11.325C16.4536 11.1062 16.3307 10.8095 16.3307 10.5V4.66671C16.3307 4.04787 16.0849 3.45438 15.6473 3.01679C15.2097 2.57921 14.6162 2.33337 13.9974 2.33337C13.3786 2.33337 12.7851 2.57921 12.3475 3.01679C11.9099 3.45438 11.6641 4.04787 11.6641 4.66671V10.5C11.6641 10.8095 11.5411 11.1062 11.3224 11.325C11.1036 11.5438 10.8068 11.6667 10.4974 11.6667H6.9974C6.37856 11.6667 5.78506 11.9125 5.34748 12.3501C4.9099 12.7877 4.66406 13.3812 4.66406 14V15.155C4.66406 15.4645 4.78698 15.7612 5.00577 15.98C5.22456 16.1988 5.52131 16.3217 5.83073 16.3217"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M5.83394 16.3334H22.1673L24.4691 24.2282C24.5102 24.3997 24.5119 24.5783 24.474 24.7506C24.4361 24.9229 24.3597 25.0843 24.2504 25.2228C24.1411 25.3612 24.0019 25.4731 23.8432 25.55C23.6844 25.6269 23.5103 25.6668 23.3339 25.6667H4.66728C4.4909 25.6668 4.31679 25.6269 4.15805 25.55C3.99932 25.4731 3.86008 25.3612 3.75082 25.2228C3.64155 25.0843 3.56511 24.9229 3.52723 24.7506C3.48934 24.5783 3.49101 24.3997 3.53211 24.2282L5.83394 16.3334Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9.33594 25.6667L10.5026 21"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            onClick: () => setCurrentView("maidServants"),
        },
        {
            title: "Temporary Hired Worker Security Passes",
            icon: <HardHat className="w-8 h-8 text-white" />,
            onClick: () => setCurrentView("temporaryWorkers"),
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="border-b bg-white px-6 py-4">
                <div className="mb-2 flex items-center text-sm text-gray-500">
                    <button
                        onClick={() => setCurrentView("menu")}
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                        <span className="h-4 w-4">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5.33337C11.3137 5.33337 14 4.43794 14 3.33337C14 2.2288 11.3137 1.33337 8 1.33337C4.68629 1.33337 2 2.2288 2 3.33337C2 4.43794 4.68629 5.33337 8 5.33337Z" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14 8C14 9.10667 11.3333 10 8 10C4.66667 10 2 9.10667 2 8" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M2 3.33337V12.6667C2 13.7734 4.66667 14.6667 8 14.6667C11.3333 14.6667 14 13.7734 14 12.6667V3.33337" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </span>
                        System Setup
                    </button>
                    <span className="mx-2">|</span>
                    <button onClick={() => setCurrentView("menu")} className="hover:text-gray-900 transition-colors">Basic Information</button>
                    <span className="mx-2 text-gray-400">&gt;</span>
                    <button
                        onClick={() => setCurrentView("menu")}
                        className={`font - medium ${currentView === 'menu' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'} `}
                    >
                        Civil Employees Management
                    </button>
                    {currentView === "shopkeepers" && (
                        <>
                            <span className="mx-2 text-gray-400">&gt;</span>
                            <span className="font-medium text-gray-900">
                                Shopkeepers & Workers Security Passes
                            </span>
                        </>
                    )}
                    {currentView === "maidServants" && (
                        <>
                            <span className="mx-2 text-gray-400">&gt;</span>
                            <span className="font-medium text-gray-900">
                                Maid Servants Security Passes
                            </span>
                        </>
                    )}
                    {currentView === "temporaryWorkers" && (
                        <>
                            <span className="mx-2 text-gray-400">&gt;</span>
                            <span className="font-medium text-gray-900">
                                Temporary Hired Worker Security Passes
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {currentView === "menu" && (
                    <>
                        <h1 className="mb-8 text-xl font-semibold text-gray-700">
                            Civil Employees Management
                        </h1>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {cards.map((card, index) => (
                                <div
                                    key={index}
                                    onClick={card.onClick}
                                    className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                                >
                                    <div className="mb-4 flex">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700 shadow-sm transition-colors group-hover:bg-gray-800">
                                            {card.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700">
                                        {card.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {currentView === "shopkeepers" && (
                    <ShopkeeperTable
                        onAddNew={() => {
                            setEditingShopkeeper(null);
                            setIsAddOpen(true);
                        }}
                        onEdit={(item) => {
                            setEditingShopkeeper(item);
                            setIsAddOpen(true);
                        }}
                    />
                )}
                {currentView === "maidServants" && (
                    <MaidServantTable
                        onAddNew={() => {
                            setEditingMaidServant(null);
                            setIsAddOpen(true);
                        }}
                        onEdit={(item) => {
                            setEditingMaidServant(item);
                            setIsAddOpen(true);
                        }}
                    />
                )}
                {currentView === "temporaryWorkers" && (
                    <TemporaryHiredTable
                        onAddNew={() => {
                            setEditingTemporaryWorker(null);
                            setIsAddOpen(true);
                        }}
                        onEdit={(item) => {
                            setEditingTemporaryWorker(item);
                            setIsAddOpen(true);
                        }}
                    />
                )}
            </div>

            {/* Right Side Sheet for Add New */}
            <RightSideSheet
                isOpen={isAddOpen}
                onClose={() => {
                    setIsAddOpen(false);
                    setEditingShopkeeper(null);
                    setEditingMaidServant(null);
                    setEditingTemporaryWorker(null);
                }}
                title={
                    currentView === "shopkeepers"
                        ? (editingShopkeeper ? "Edit Security Pass Entry" : "Add Security Pass Entry")
                        : currentView === "maidServants"
                            ? (editingMaidServant ? "Edit Maid Servant Pass" : "Add Maid Servant Pass")
                            : (editingTemporaryWorker ? "Edit Temporary Worker Pass" : "Add Temporary Worker Pass")
                }
                description={
                    currentView === "shopkeepers"
                        ? (editingShopkeeper ? "Update details to modify pass record" : "Fill details to generate pass record")
                        : currentView === "maidServants"
                            ? (editingMaidServant ? "Update details to modify maid servant pass" : "Fill details to generate maid servant pass")
                            : (editingTemporaryWorker ? "Update details to modify temporary worker pass" : "Fill details to generate temporary worker pass")
                }
            >
                {currentView === "shopkeepers" && (
                    <ShopkeeperSecurityPassEntryForm
                        onCancel={() => {
                            setIsAddOpen(false);
                            setEditingShopkeeper(null);
                        }}
                        onSuccess={() => {
                            setIsAddOpen(false);
                            setEditingShopkeeper(null);
                        }}
                        initialData={editingShopkeeper}
                    />
                )}

                {currentView === "maidServants" && (
                    <MaidServantSecurityPassEntryForm
                        onCancel={() => {
                            setIsAddOpen(false);
                            setEditingMaidServant(null);
                        }}
                        onSuccess={() => {
                            setIsAddOpen(false);
                            setEditingMaidServant(null);
                        }}
                        initialData={editingMaidServant}
                    />
                )}

                {currentView === "temporaryWorkers" && (
                    <TemporaryHiredWorkerPassForm
                        onCancel={() => {
                            setIsAddOpen(false);
                            setEditingTemporaryWorker(null);
                        }}
                        onSuccess={() => {
                            setIsAddOpen(false);
                            setEditingTemporaryWorker(null);
                        }}
                        initialData={editingTemporaryWorker}
                    />
                )}
            </RightSideSheet>
        </div>
    );
};

export default CivilEmployeePage;
