"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="h-3.5 w-3.5 text-gray-400" />,
  className = "",
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = !!item.href && !isLast;

          const content = (
            <span
              className={
                isLast
                  ? "font-semibold text-gray-900 capitalize"
                  : "cursor-pointer hover:text-gray-900 transition-colors"
              }
              aria-current={isLast ? "page" : undefined}
            >
              {item.label}
            </span>
          );

          return (
            <li key={index} className="flex items-center">
              {isClickable ? (
                <Link href={item.href!}>{content}</Link>
              ) : (
                content
              )}

              {!isLast && (
                <span className="mx-2 flex-shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
