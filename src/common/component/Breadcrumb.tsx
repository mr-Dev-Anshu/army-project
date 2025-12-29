'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';


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
  separator = <ChevronRight className="h-4 w-4 text-gray-500" />,
  className = '',
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center ${className}`}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = !!item.href && !isLast;

          const content = (
            <>
              <span
                className={
                  isLast
                    ? 'font-medium text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 transition-colors'
                }
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
              {!isLast && (
                <span className="mx-2 flex-shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}
            </>
          );

          return (
            <li key={index} className="flex items-center">
              {isClickable ? (
                <Link
                  href={item.href!}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;