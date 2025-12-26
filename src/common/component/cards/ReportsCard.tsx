import React from "react";

interface ReportsCardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  onClick?: () => void;
  iconBgColor?: string;
  className?: string;
}

export default function ReportsCard({
  title,
  count,
  icon,
  onClick,
  iconBgColor = "bg-blue-900", // Default dark blue
  className = "",
}: ReportsCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative w-full bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-[200px] ${className}`}
    >
      {/* Icon Circle */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor} text-white mb-4`}>
         {icon}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-800 leading-tight">
          {title}
        </h3>
        
        <div className="flex justify-between items-end">
             <span className="text-sm text-gray-500 font-medium">Total Reports</span>
             <span className="text-xl font-bold text-gray-800">{count}</span>
        </div>
      </div>
    </div>
  );
}
