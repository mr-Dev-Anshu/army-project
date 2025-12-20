import React from "react";
import { Construction } from "lucide-react";

interface StatCardProps {
  icon?: React.ReactNode;
  value?: string | number;
  title?: string;
  trend?: {
    value?: string;
    label?: string;
    direction?: "up" | "down";
  };
  iconBgColor?: string;
  iconColor?: string;
}

const DynamicStatsCard: React.FC<StatCardProps> = ({
  icon,
  value,
  title,
  trend,
  iconBgColor,
  iconColor,
}) => {
  const finalValue = value || 42;
  const finalTitle = title || "Total General Traffic & Offence Reports";
  const finalIconBg = iconBgColor || "bg-gray-100";
  const finalIconColor = iconColor || "text-gray-600";

  const trendValue = trend?.value || "+18.2%";
  const trendLabel = trend?.label || "than last week";
  const isPositive = trend?.direction === "up" || trendValue.startsWith("+");

  return (
    <div className="bg-white h-56 w-80 rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Icon + Value */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`${finalIconBg} rounded-xl p-3`}>
          <div className={`w-6 h-6 ${finalIconColor}`}>
            {icon || <Construction className="w-full h-full" />}
          </div>
        </div>
        <span className="text-4xl font-normal  text-gray-900">{finalValue}</span>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-medium text-gray-900 mb-2 line-clamp-2">
          {finalTitle}
        </h3>

        {/* Trend */}
        <div className="flex items-center gap-1 text-lg">
          <span
            className={
              isPositive
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {trendValue}
          </span>
          <span className="text-gray-400 ">{trendLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default DynamicStatsCard;
