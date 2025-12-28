import React from "react";
import { Construction } from "lucide-react";

interface StatCardProps {
  icon?: React.ReactNode;
  value?: string | number;
  title?: string;
  trend?: {
    value?: string;
    label?: string;
    direction?: "up" | "down" | string;
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
    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        border border-gray-100
        hover:shadow-md
        transition-shadow

        w-full
        max-w-[320px]
        sm:max-w-[360px]
        md:max-w-[380px]
        lg:w-full

        h-auto
        min-h-[200px]
        sm:min-h-[220px]
        md:min-h-[230px]

        p-5
        sm:p-6
        md:p-8
      "
    >
      {/* Icon + Value */}
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className={`${finalIconBg} rounded-xl p-2 sm:p-3`}>
          <div className={`w-5 h-5 sm:w-6 sm:h-6 ${finalIconColor}`}>
            {icon || <Construction className="w-full h-full" />}
          </div>
        </div>

        <span
          className="
            text-xl
            sm:text-2xl
            md:text-3xl
            font-normal
            text-gray-900
          "
        >
          {finalValue}
        </span>
      </div>

      <div className="mt-4 sm:mt-5 md:mt-6">
        <h3
          className="
            text-md
            sm:text-xl
            md:text-xl
            font-medium
            text-gray-900
            mb-1
            sm:mb-2
            line-clamp-2
          "
        >
          {finalTitle}
        </h3>

        {/* Trend */}
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            sm:text-base
            md:text-xs
          "
        >
          <span
            className={
              isPositive
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {trendValue}
          </span>
          <span
            className="text-gray-400 text-sm
            sm:text-base
            md:text-xs"
          >
            {trendLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DynamicStatsCard;
