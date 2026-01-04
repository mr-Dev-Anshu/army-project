import { DivisionAnalysis } from "@/models/DivisionAnalysis";

export const createDivisionAnalysisRepo = (payload) => {
  return DivisionAnalysis.create(payload);
};

export const getAllDivisionAnalysisRepo = (filters = {}) => {
  return DivisionAnalysis.find(filters).sort({ monthYear: -1 });
};

export const getDivisionAnalysisByIdRepo = (id) => {
  return DivisionAnalysis.findById(id);
};

export const updateDivisionAnalysisRepo = (id, payload) => {
  return DivisionAnalysis.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

export const deleteDivisionAnalysisRepo = (id) => {
  return DivisionAnalysis.findByIdAndDelete(id);
};
