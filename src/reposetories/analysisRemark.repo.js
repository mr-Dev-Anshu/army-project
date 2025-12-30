import { AnalysisRemark } from "@/models/AnalysisRemark";
export async function createRemarkRepo(data) {
  const Remark = new AnalysisRemark(data);
  return await Remark.save();
}

export async function findAllRemarksRepo() {
  return await AnalysisRemark.find({}).sort({ monthYear: -1, createdAt: -1 });
}

export async function findRemarkByIdRepo(id) {
  return await AnalysisRemark.findById(id);
}

export async function updateRemarkByIdRepo(id, data) {
  return await AnalysisRemark.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteRemarkByIdRepo(id) {
  return await AnalysisRemark.findByIdAndDelete(id);
}