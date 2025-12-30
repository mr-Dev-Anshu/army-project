import React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: React.ReactNode | string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string | ((item: T) => string);
  headerClassName?: string;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
  getRowClassName?: (item: T) => string;
}

export function DynamicTable<T>({
  data,
  columns,
  className,
  emptyMessage = "No records found.",
  getRowClassName
}: DynamicTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto overflow-y-auto max-h-[350px] rounded-lg border border-gray-200 bg-white", className)}>
      <table className="w-full text-left text-sm text-gray-700 relative border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 uppercase text-xs">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={cn("sticky top-0 z-10 bg-gray-50 px-4 py-3 whitespace-nowrap shadow-sm", col.headerClassName)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "hover:bg-gray-50 transition-colors group",
                  getRowClassName?.(item)
                )}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "px-4 py-4 align-top",
                      typeof col.className === "function" ? col.className(item) : col.className
                    )}
                  >
                    {col.cell
                      ? col.cell(item)
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
