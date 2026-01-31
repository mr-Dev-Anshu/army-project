"use client";
import dynamic from "next/dynamic";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const TooltipComponent = dynamic(
  () => import("react-tooltip").then((mod) => ({ default: Tooltip })),
  { ssr: false }
);

export default function SimpleToolTip() {
  return <TooltipComponent id="sidebar-tooltip" place="right" className="!z-50" />;
}
