"use client";

import React from "react";

interface ActionCardProps {
  title?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title = "Create New Record",
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        w-fit
        bg-[#1f1f1f]
        rounded-md
        px-8
        h-18
        flex
        items-center
        gap-4
        text-[#ffff]
        hover:bg-[#2a2a2a]
        transition-colors
      "
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-[#2f2f2f] flex items-center justify-center">
        {icon}
      </div>

      {/* Text */}
      <span className="text-base font-medium tracking-wide">
        {title}
      </span>
    </button>
  );
};

export default ActionCard;
