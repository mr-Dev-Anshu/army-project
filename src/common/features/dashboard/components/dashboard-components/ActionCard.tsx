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
    w-full
    bg-[#1A1A1A]
    rounded-lg
    px-6
    h-20
    flex
    items-center
    justify-start
    gap-4
    text-white
    hover:bg-[#252525]
    transition-colors
    text-left
  "
    >
      <div className="w-10 h-10 shrink-0 rounded-full bg-[#262626] flex items-center justify-center text-gray-400">
        <div className="w-5 h-5">
          {icon}
        </div>
      </div>

      <span className="text-sm font-medium leading-tight">{title}</span>
    </button>
  );
};

export default ActionCard;
