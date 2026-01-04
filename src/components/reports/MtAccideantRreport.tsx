"use client";

import React from "react";

/* ================= TYPES ================= */

export interface MTAccidentReportProps {
  reportNo: string;
  reportDate: string;

  station?: string;

  dateOfAccident?: string;
  timeOfAccident?: string;
  placeOfAccident?: string;

  vehicle?: {
    number?: string;
    make?: string;
  };

  driver?: {
    name?: string;
    rank?: string;
    armyNo?: string;
    unit?: string;
  };

  casualties?: {
    injuredCivil?: number;
    injuredMilitary?: number;
    diedCivil?: number;
    diedMilitary?: number;
  };

  cause?: string;
  remarks?: string;
}

/* ================= COMPONENT ================= */

export default function MTAccidentReport({
  reportNo,
  reportDate,
  station,
  dateOfAccident,
  timeOfAccident,
  placeOfAccident,
  vehicle,
  driver,
  casualties,
  cause,
  remarks,
}: MTAccidentReportProps) {
  return (
    <div className="w-[794px] bg-white text-black p-10 shadow print:shadow-none print:p-6 font-serif text-sm">
      {/* ================= HEADER ================= */}
      <div className="text-center border-b pb-3 mb-6">
        <h1 className="text-lg font-bold uppercase">
          Motor Transport Accident Report
        </h1>
        <p className="text-xs mt-1">
          (For official use only)
        </p>
      </div>

      {/* ================= META ================= */}
      <div className="flex justify-between mb-6 text-xs">
        <div>
          <div>
            <b>Report No:</b> {reportNo}
          </div>
          <div>
            <b>Station:</b> {station || "—"}
          </div>
        </div>
        <div>
          <b>Date:</b> {reportDate}
        </div>
      </div>

      {/* ================= ACCIDENT DETAILS ================= */}
      <Section title="Accident Details">
        <Row label="Date of Accident" value={dateOfAccident} />
        <Row label="Time of Accident" value={timeOfAccident} />
        <Row label="Place of Accident" value={placeOfAccident} />
      </Section>

      {/* ================= VEHICLE DETAILS ================= */}
      <Section title="Vehicle Details">
        <Row label="Vehicle BA / Regn No." value={vehicle?.number} />
        <Row label="Make & Model" value={vehicle?.make} />
      </Section>

      {/* ================= DRIVER DETAILS ================= */}
      <Section title="Driver Details">
        <Row label="Name" value={driver?.name} />
        <Row label="Rank" value={driver?.rank} />
        <Row label="Army No." value={driver?.armyNo} />
        <Row label="Unit" value={driver?.unit} />
      </Section>

      {/* ================= CASUALTIES ================= */}
      <Section title="Casualty Details">
        <table className="w-full border border-black text-xs mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2">Category</th>
              <th className="border border-black p-2">Civil</th>
              <th className="border border-black p-2">Military</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">Injured</td>
              <td className="border border-black p-2 text-center">
                {casualties?.injuredCivil ?? 0}
              </td>
              <td className="border border-black p-2 text-center">
                {casualties?.injuredMilitary ?? 0}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">Died</td>
              <td className="border border-black p-2 text-center">
                {casualties?.diedCivil ?? 0}
              </td>
              <td className="border border-black p-2 text-center">
                {casualties?.diedMilitary ?? 0}
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* ================= PROBABLE CAUSE ================= */}
      <Section title="Probable Cause of Accident">
        <p className="border border-black p-3 min-h-[60px]">
          {cause || "—"}
        </p>
      </Section>

      {/* ================= REMARKS ================= */}
      <Section title="Remarks / Action Taken">
        <p className="border border-black p-3 min-h-[60px]">
          {remarks || "—"}
        </p>
      </Section>

      {/* ================= SIGNATURE ================= */}
      <div className="mt-16 flex justify-between text-xs">
        <div className="text-center">
          <div className="border-t border-black w-48 mx-auto mb-1"></div>
          <div>Signature of Reporting Officer</div>
        </div>

        <div className="text-center">
          <div className="border-t border-black w-48 mx-auto mb-1"></div>
          <div>Signature of Station Commander</div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="font-bold uppercase text-xs mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="flex border border-black">
      <div className="w-1/3 border-r border-black p-2 font-semibold">
        {label}
      </div>
      <div className="w-2/3 p-2">
        {value || "—"}
      </div>
    </div>
  );
}
