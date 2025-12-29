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
  cardBgColor?: string;
  borderColor?: string;
}

const DynamicStatsCard: React.FC<StatCardProps> = ({
  icon,
  value,
  title,
  trend,
  iconBgColor,
  iconColor,
  cardBgColor,
  borderColor,
}) => {
  const finalValue = value ?? 42;
  const finalTitle = title || "Total General Traffic & Offence Reports";
  const finalIconBg = iconBgColor || "bg-gray-100";
  const finalIconColor = iconColor || "text-gray-600";
  const finalCardBg = cardBgColor || "bg-white";
  const finalBorderColor = borderColor || "border-gray-100";

  const trendValue = trend?.value || "+18.2%";
  const trendLabel = trend?.label || "than last week";
  const isPositive = trend?.direction === "up" || trendValue.startsWith("+");

  return (
    <div
      className={`
        ${finalCardBg}
        ${finalBorderColor}
        rounded-2xl
        shadow-sm
        border
        hover:shadow-md
        transition-shadow

        w-full
        max-w-[320px]
        sm:max-w-[360px]
        md:max-w-[380px]
        lg:w-full

        h-auto
        min-h-[160px]

        p-5
        sm:p-6
      `}
    >
      {/* Icon + Value */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`${finalIconBg} rounded-xl p-3`}>
          <div className={`w-6 h-6 ${finalIconColor}`}>
            {icon || <Construction className="w-full h-full" />}
          </div>
        </div>

        <span
          className="
            text-3xl
            font-semibold
            text-gray-900
          "
        >
          {finalValue}
        </span>
      </div>

      <div className="mt-2">
        <h3
          className="
            text-sm
            sm:text-base
            font-semibold
            text-[#0A0A0A]
            mb-2
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
            gap-2
            text-sm
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
          <span className="text-gray-400 text-xs sm:text-sm">
            {trendLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DynamicStatsCard;
