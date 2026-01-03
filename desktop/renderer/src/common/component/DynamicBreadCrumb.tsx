'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import Breadcrumb, { BreadcrumbItem } from './Breadcrumb';

const DynamicBreadcrumbs: React.FC = () => {
  const pathname = usePathname();

  // Split the path into segments
  const pathSegments = pathname.split('/').filter((segment) => segment.length > 0);

  // Build breadcrumb items
  const items: BreadcrumbItem[] = [
    {
      label: (
        <span className="flex items-center gap-1.5">
          <Home className="h-4 w-4" />
          Home
        </span>
      ),
      href: '/',
    },
  ];

  // Accumulate path for hrefs
  let accumulatedPath = '';

  pathSegments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;

    // Capitalize and format label (replace - with space)
    const label = segment
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special cases (optional) - customize as needed
    const customLabels: Record<string, string> = {
      dashboard: 'Dashboard',
      products: 'Products',
      settings: 'Settings',
      profile: 'My Profile',
    };

    const displayLabel = customLabels[segment] || label;

    items.push({
      label: displayLabel,
      href: accumulatedPath,
    });
  });

  // If on home page, only show Home
  if (pathname === '/') {
    items[0].href = undefined; // Make Home non-clickable on home page
  }

  // Last item is current page (no href)
  if (items.length > 1) {
    items[items.length - 1].href = undefined;
  }

  return <Breadcrumb items={items} />;
};

export default DynamicBreadcrumbs;