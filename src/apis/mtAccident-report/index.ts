// apis/mtAccidentReport.ts
export const MT_ACCIDENT_API = {
  list: "/api/mt-accident-reports",
  byId: (id: string) => `/api/mt-accident-reports/${id}`,
};

export const getAllMTAccidentReports = async () => {
  const res = await fetch(MT_ACCIDENT_API.list);
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
};

export const getMTAccidentReportById = async (id: string) => {
  const res = await fetch(MT_ACCIDENT_API.byId(id));
  if (!res.ok) throw new Error("Failed to fetch report");
  return res.json();
};

export const createMTAccidentReport = async (data: any) => {
  const res = await fetch(MT_ACCIDENT_API.list, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create report");
  return res.json();
};

export const updateMTAccidentReport = async (id: string, data: any) => {
  const res = await fetch(MT_ACCIDENT_API.byId(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update report");
  return res.json();
};

export const deleteMTAccidentReport = async (id: string) => {
  const res = await fetch(MT_ACCIDENT_API.byId(id), {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete report");
  return res.json();
};