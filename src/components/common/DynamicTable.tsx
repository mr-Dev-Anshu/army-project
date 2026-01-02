import React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  headerGroup?: string;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
  bordered?: boolean;
}

export function DynamicTable<T>({
  data,
  columns,
  className,
  emptyMessage = "No records found.",
  bordered = false
}: DynamicTableProps<T>) {
  const hasGroups = columns.some((col) => col.headerGroup);
  // Calculate top offset for the second row based on expected height of first row.
  // Standard row is ~40-45px.
  const subHeaderTop = "40px";

  return (
    <div className={cn("overflow-x-auto overflow-y-auto max-h-[350px] rounded-lg border border-gray-200 bg-white", className)}>
      <table className="w-full text-left text-sm text-gray-700 relative border-collapse">
        <thead className={cn(
          "bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 text-xs", // Removed uppercase
          bordered && "border-0"
        )}>
          {hasGroups ? (
            <>
              {/* Group Header Row */}
              <tr>
                {columns.reduce((acc: React.ReactNode[], col, index, arr) => {
                  const prevCol = arr[index - 1];
                  if (col.headerGroup) {
                    if (prevCol?.headerGroup === col.headerGroup) {
                      // Skip if same group as previous - already handled by colSpan
                      return acc;
                    }
                    // Count span
                    let span = 1;
                    for (let i = index + 1; i < arr.length; i++) {
                      if (arr[i].headerGroup === col.headerGroup) span++;
                      else break;
                    }
                    acc.push(
                      <th
                        key={`group-${index}`}
                        colSpan={span}
                        className={cn(
                          "sticky top-0 z-10 bg-gray-50 px-4 py-2 whitespace-nowrap shadow-sm text-center border-b font-bold text-black border-gray-200",
                          bordered && "border"
                        )}
                        style={{ height: subHeaderTop }}
                      >
                        {col.headerGroup}
                      </th>
                    );
                  } else {
                    acc.push(
                      <th
                        key={`ph-${index}`}
                        rowSpan={2}
                        className={cn(
                          "sticky top-0 z-10 bg-gray-50 px-4 py-3 shadow-sm align-middle whitespace-nowrap",
                          bordered && "border border-gray-200",
                          col.headerClassName
                        )}
                      >
                        {col.header}
                      </th>
                    );
                  }
                  return acc;
                }, [])}
              </tr>
              {/* Sub Header Row */}
              <tr>
                {columns.map((col, index) => {
                  if (!col.headerGroup) return null; // Already rendered in first row
                  return (
                    <th
                      key={index}
                      className={cn(
                        "sticky z-10 bg-gray-50 px-2 py-2 shadow-sm text-center align-top",
                        bordered && "border border-gray-200",
                        col.headerClassName
                      )}
                      style={{ top: subHeaderTop }}
                    >
                      {col.header}
                    </th>
                  );
                })}
              </tr>
            </>
          ) : (
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={cn(
                    "sticky top-0 z-10 bg-gray-50 px-4 py-3 whitespace-nowrap shadow-sm",
                    bordered && "border border-gray-200", // Add borders to th
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody className={cn(
          "divide-y divide-gray-100",
          bordered && "divide-none" // Remove divide-y if we use border on cells
        )}>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors group">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "px-4 py-4 align-top",
                      bordered && "border border-gray-200", // Add borders to td
                      col.className
                    )}
                  >
                    {col.cell
                      ? col.cell(item, rowIndex)
                      : (col.accessorKey ? String(item[col.accessorKey]) : "")}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
