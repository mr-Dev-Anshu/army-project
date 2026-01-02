import {
  createDivisionAnalysisRepo,
  getAllDivisionAnalysisRepo,
  getDivisionAnalysisByIdRepo,
  updateDivisionAnalysisRepo,
  deleteDivisionAnalysisRepo,
} from "@/reposetories/divisionAnalysis";

import { DivisionAnalysis } from "@/models/DivisionAnalysis";

export const createDivisionAnalysisService = (payload) =>
  createDivisionAnalysisRepo(payload);

export const getAllDivisionAnalysisService = () => getAllDivisionAnalysisRepo();

export const getDivisionAnalysisByIdService = (id) =>
  getDivisionAnalysisByIdRepo(id);

export const updateDivisionAnalysisService = (id, payload) =>
  updateDivisionAnalysisRepo(id, payload);

export const deleteDivisionAnalysisService = (id) =>
  deleteDivisionAnalysisRepo(id);

export const getGroupedByDivisionService = async (filters = {}) => {
  const match = {};
  if (filters.divisionName) match.divisionName = filters.divisionName;
  if (filters.offence) match.offence = filters.offence;
  if (filters.monthYear) {
    const d = new Date(filters.monthYear);
    if (!isNaN(d)) match.monthYear = d;
  }

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: "$divisionName",
        divisionName: { $first: "$divisionName" },
        totalActionTaken: { $sum: { $ifNull: ["$actionTaken", 0] } },
        totalActionPending: { $sum: { $ifNull: ["$actionPending", 0] } },
        totalNumberOfCases: { $sum: { $ifNull: ["$totalNumberOfCases", 0] } },
        offences: { $addToSet: "$offence" },
        count: { $sum: 1 },
      },
    },
    { $sort: { divisionName: 1 } },
  ];

  return DivisionAnalysis.aggregate(pipeline);
};

export const getGroupedByOffenceService = async (filters = {}) => {
  const match = {};
  if (filters.offence) match.offence = filters.offence;
  if (filters.divisionName) match.divisionName = filters.divisionName;

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: "$offence",
        offence: { $first: "$offence" },
        totalActionTaken: { $sum: { $ifNull: ["$actionTaken", 0] } },
        totalActionPending: { $sum: { $ifNull: ["$actionPending", 0] } },
        totalNumberOfCases: { $sum: { $ifNull: ["$totalNumberOfCases", 0] } },
        divisions: { $addToSet: "$divisionName" },
        count: { $sum: 1 },
      },
    },
    { $sort: { offence: 1 } },
  ];

  return DivisionAnalysis.aggregate(pipeline);
};

export const divisionAnalysisService = {
  create: createDivisionAnalysisService,
  getAll: getAllDivisionAnalysisService,
  getById: getDivisionAnalysisByIdService,
  update: updateDivisionAnalysisService,
  delete: deleteDivisionAnalysisService,
  getGroupedByDivision: getGroupedByDivisionService,
  getGroupedByOffence: getGroupedByOffenceService,
};
