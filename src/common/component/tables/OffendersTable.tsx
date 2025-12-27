// components/CollapsibleOffenceTable.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, Circle } from 'lucide-react';

type OffenceDetail = {
  srNo: number;
  reportId: string;
  dateTime: string;
  location: string;
  vehicleNumber?: string;
  reportingMP: string;
  description: string;
  offenders: Array<{
    name: string;
    aadhar?: string;
    fatherName?: string;
  }>;
  actionStatus: 'Pending' | 'Taken';
};

type OffenceGroup = {
  id: string;
  type: string;
  pending: number;
  taken: number;
  total: number;
  details: OffenceDetail[];
};

type TableColumn = {
  key:
    | 'srNo'
    | 'offenceType'
    | 'dateTime'
    | 'location'
    | 'vehicleNumber'
    | 'reportingMP'
    | 'description'
    | 'offenders'
    | 'actionStatus';
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
};

interface CollapsibleOffenceTableProps {
  data: OffenceGroup[];
  columns?: TableColumn[]; 
}

const defaultColumns: TableColumn[] = [
  { key: 'srNo', header: 'Sr. No.', align: 'left' },
  { key: 'offenceType', header: 'Type of Offence', align: 'left' },
  { key: 'dateTime', header: 'Date & Time', align: 'left' },
  { key: 'location', header: 'Location', align: 'left' },
  { key: 'vehicleNumber', header: 'Vehicle No.', align: 'left' },
  { key: 'reportingMP', header: 'Reporting MP', align: 'left' },
  { key: 'description', header: 'Description', align: 'left' },
  { key: 'offenders', header: 'Offender(s)', align: 'left' },
  { key: 'actionStatus', header: 'Action Status', align: 'center' },
];

export default function CollapsibleOffenceTable({
  data,
  columns = defaultColumns,
}: CollapsibleOffenceTableProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No offence reports available.
      </div>
    );
  }

  const colCount = columns.length;

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left">
        {/* Dynamic Headers from props */}
        <thead className="text-xs uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-4 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.map((group) => {
            const isOpen = openGroups.has(group.id);

            return (
              <React.Fragment key={group.id}>
                <tr
                  onClick={() => toggleGroup(group.id)}
                  className=" hover:bg-indigo-50 cursor-pointer transition-colors duration-200 select-none"
                >
                  <td colSpan={colCount} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`}
                        />
                        <span className="font-semibold text-indigo-900">
                          {group.type} ({group.total} OFFENCE{group.total > 1 ? 'S' : ''})
                        </span>
                      </div>

                      <div className="flex items-center gap-8 text-sm">
                        <span className="text-red-600 font-medium">
                          Pending: {group.pending}
                        </span>
                        <span className="text-green-600 font-medium">
                          Taken: {group.taken}
                        </span>
                        <span className="text-gray-700 font-medium pr-4">
                          {group.total} {isOpen ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Collapsible Details */}
                <tr>
                  <td colSpan={colCount} className="p-0">
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="border-t border-gray-200">
                        {group.details.map((detail) => (
                          <div
                            key={detail.reportId}
                            className="bg-white hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="grid gap-4 px-6 py-4 text-gray-700 text-xs" style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}>
                              {columns.map((col) => {
                                switch (col.key) {
                                  case 'srNo':
                                    return <div key={col.key} className="font-medium">{detail.srNo}</div>;
                                  case 'offenceType':
                                    return <div key={col.key} className="font-medium text-indigo-700">{group.type}</div>;
                                  case 'dateTime':
                                    return <div key={col.key}>{detail.dateTime}</div>;
                                  case 'location':
                                    return <div key={col.key}>{detail.location}</div>;
                                  case 'vehicleNumber':
                                    return (
                                      <div key={col.key} className="font-mono text-blue-700">
                                        {detail.vehicleNumber || 'N/A'}
                                      </div>
                                    );
                                  case 'reportingMP':
                                    return <div key={col.key}>{detail.reportingMP}</div>;
                                  case 'description':
                                    return <div key={col.key} className="max-w-md">{detail.description}</div>;
                                  case 'offenders':
                                    return (
                                      <div key={col.key} className="space-y-2">
                                        {detail.offenders.length > 0 ? (
                                          detail.offenders.map((offender, i) => (
                                            <div key={i} className="border-l-2 border-gray-300 pl-3">
                                              <div className="font-medium">{offender.name}</div>
                                              {offender.fatherName && (
                                                <div className="text-xs text-gray-600">
                                                  s/o {offender.fatherName}
                                                </div>
                                              )}
                                              {offender.aadhar && (
                                                <div className="text-xs text-gray-500">
                                                  Aadhar: {offender.aadhar}
                                                </div>
                                              )}
                                            </div>
                                          ))
                                        ) : (
                                          <span className="text-gray-400 italic">
                                            No offender recorded
                                          </span>
                                        )}
                                      </div>
                                    );
                                  case 'actionStatus':
                                    return (
                                      <div key={col.key} className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <Circle
                                            className={`w-3 h-3 fill-current ${
                                              detail.actionStatus === 'Pending'
                                                ? 'text-red-500'
                                                : 'text-green-500'
                                            }`}
                                          />
                                          <span
                                            className={`font-medium ${
                                              detail.actionStatus === 'Pending'
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                            }`}
                                          >
                                            {detail.actionStatus}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  default:
                                    return null;
                                }
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}