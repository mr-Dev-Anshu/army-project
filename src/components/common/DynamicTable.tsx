import React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
}

export function DynamicTable<T>({ 
  data, 
  columns, 
  className,
  emptyMessage = "No records found." 
}: DynamicTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-gray-200 bg-white", className)}>
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-900 uppercase text-xs">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className={cn("px-4 py-3 whitespace-nowrap", col.headerClassName)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors group">
                {columns.map((col, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={cn("px-4 py-4 align-top", col.className)}
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
