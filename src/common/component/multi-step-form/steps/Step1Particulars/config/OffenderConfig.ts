/* ================= OFFENDER CONFIG ================= */

type Field =
  | {
      type: "input";
      label: string;
      placeholder?: string;
    }
  | {
      type: "suggestion";
      label: string;
      placeholder?: string;
      fieldType: string;
    };

interface OffenderFormConfig {
  label: string;
  title: string;
  helperText?: string;
  fields: Field[];
}

export const offenderFormsConfig: Record<string, OffenderFormConfig> = {
  MILITARY: {
    label: "Military Personnel",
    title: "Fill Offender Particulars",
    helperText: "Select who the offender is and fill their details.",
    fields: [
      { type: "input", label: "Army Rider / Driver Number", placeholder: "Enter Number" },
      { type: "input", label: "Name", placeholder: "Enter Name" },
      { type: "suggestion", label: "Rank", placeholder: "Enter Rank", fieldType: "rank" },
      { type: "suggestion", label: "Unit", placeholder: "Enter Unit", fieldType: "unit" },
      { type: "suggestion", label: "FMN", placeholder: "Enter FMN", fieldType: "fmn" },
      { type: "suggestion", label: "Command", placeholder: "Enter Command", fieldType: "command" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "ID Card Number", placeholder: "Enter ID Card Number" },
    ],
  },

  CIVILIAN: {
    label: "Civilian",
    title: "Fill Civilian Details",
    helperText: "Enter required civilian offender details.",
    fields: [
      { type: "input", label: "Full Name", placeholder: "Enter Name" },
      { type: "input", label: "Aadhar Card Number", placeholder: "Enter Aadhar Number" },
      { type: "input", label: "Father / Husband Name", placeholder: "Enter Name" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
    ],
  },

  EMPLOYEE: {
    label: "Employee",
    title: "Fill Employee Details",
    helperText: "Enter employee offender details.",
    fields: [
      { type: "input", label: "Service Number", placeholder: "Enter Service Number" },
      { type: "input", label: "Name", placeholder: "Enter Name" },
      { type: "suggestion", label: "Rank", placeholder: "Enter Rank", fieldType: "rank" },
      { type: "suggestion", label: "Unit", placeholder: "Enter Unit", fieldType: "unit" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "I Card Number", placeholder: "Enter I Card Number" },
    ],
  },

  SERVANT: {
    label: "Servant / Maid",
    title: "Fill Offender Particulars",
    helperText: "Select who the offender is and fill their details.",
    fields: [
      { type: "input", label: "Pass Number", placeholder: "Enter Pass Number" },
      { type: "input", label: "Name", placeholder: "Enter Name" },
      { type: "input", label: "Worked At Quarter Number", placeholder: "Enter Quarter Number" },
      { type: "suggestion", label: "Unit", placeholder: "Enter Unit", fieldType: "unit" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
    ],
  },

  SHOP_KEEPER: {
    label: "Shop Keeper",
    title: "Fill Details",
    helperText: "Fill shopkeeper details.",
    fields: [
      { type: "input", label: "Shop Name", placeholder: "Enter Shop Name" },
      { type: "input", label: "Owner Name", placeholder: "Enter Owner Name" },
      { type: "input", label: "Shop Address", placeholder: "Enter Shop Address" },
      { type: "input", label: "Pass Number", placeholder: "Enter Pass Number" },
    ],
  },

  TEMP_WORKER: {
    label: "Temporary Hired Worker",
    title: "Fill Details",
    helperText: "Enter worker details.",
    fields: [
      { type: "input", label: "Worker Name", placeholder: "Enter Name" },
      { type: "input", label: "Type of Work", placeholder: "Enter Work Type" },
      { type: "input", label: "Place of Stay", placeholder: "Enter Place of Stay" },
      { type: "input", label: "Pass Number", placeholder: "Enter Pass Number" },
    ],
  },
};
