import certificateModel from "@/models/Certificate&Form";

export const create = (data) => {
  return certificateModel.create(data);
};

export const findById = (id) => {
  return certificateModel.findById(id);
};

export const findByType = (type) => {
  return certificateModel.find({ type });
};

export const getAllCertificate = () => {
  return certificateModel.find();
}

export const updateById = (id, updateData) => {
  return certificateModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true },
  );
};

export const deleteById = (id) => {
  return certificateModel.findByIdAndDelete(id);
};
