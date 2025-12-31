





export const offenderFormsConfig: any = {
  "Military Person": {
    title: "Fill Offender Particulars",
    helperText: "Select who the offender is and fill their details.",
    fields: [
      { type: "input", label: "Army Rider / Driver Number", placeholder: "Enter Number" },

      // 🔥 Name Added
      { type: "input", label: "Name", placeholder: "e.g. John Apradhi" },

      // 🔥 Dropdown removed → Suggestion Inputs
      { type: "suggestion", label: "Rank", placeholder: "Enter Rank", fieldType: "rank" },
      { type: "suggestion", label: "Unit", placeholder: "Enter Unit", fieldType: "unit" },
      { type: "suggestion", label: "FMN", placeholder: "Enter FMN", fieldType: "fmn" },
      { type: "suggestion", label: "Command", placeholder: "Enter Command", fieldType: "command" },

      { type: "input", label: "Address", placeholder: "e.g. C/O 56 APO" },
      { type: "input", label: "ID Card Number", placeholder: "Enter ID" },
    ],
  },

  Civilian: {
    title: "Fill Civilian Details",
    helperText: "Enter required civilian offender details.",
    fields: [
      { type: "input", label: "Full Name", placeholder: "Enter Name" },
      { type: "input", label: "Aadhar Card Number", placeholder: "e.g. 8888 8888 8888" },
      { type: "input", label: "Father / Husband Name", placeholder: "Enter Name" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
    ],
  },

  Employee: {
    title: "Fill Employee Details",
    helperText: "Enter employee offender details.",
    fields: [
      { type: "input", label: "Service Number", placeholder: "e.g. MES-12345678" },

      // 🔥 Name Added
      { type: "input", label: "Name", placeholder: "e.g. John Apradhi" },

      // 🔥 Suggestions instead of dropdown
      { type: "suggestion", label: "Rank", placeholder: "Select rank", fieldType: "rank" },
      { type: "suggestion", label: "Unit", placeholder: "Select unit", fieldType: "unit" },
      { type: "suggestion", label: "FMN", placeholder: "Select FMN", fieldType: "fmn" },
      { type: "suggestion", label: "Command", placeholder: "Select Command", fieldType: "command" },

      { type: "input", label: "Address", placeholder: "e.g. C/O 56 APO" },
      { type: "input", label: "I Card Number", placeholder: "e.g. A-123456" },
    ],
  },

  "Servant/Maid": {
    title: "Fill Offender Particulars",
    helperText: "Select who the offender is and fill their details.",
    fields: [
      { type: "input", label: "Maid/Servant Pass Number*", placeholder: "e.g. 12345678" },
      { type: "input", label: "Father’s Name (Son of)", placeholder: "e.g. ABC" },
      { type: "input", label: "Pass ID", placeholder: "e.g. 1234" },
      { type: "input", label: "Name", placeholder: "e.g. John" },

      { type: "suggestion", label: "Trade", placeholder: "Enter Trade", fieldType: "trade" },
      { type: "input", label: "Worked at Quarter Number", placeholder: "e.g. DM–35/4" },

      { type: "suggestion", label: "C/O Rank", placeholder: "Enter Rank", fieldType: "rank" },
      { type: "input", label: "Name", placeholder: "Army Person Name" },
      { type: "input", label: "Place of QTR.", placeholder: "Location" },

      { type: "suggestion", label: "Unit", placeholder: "Enter Unit", fieldType: "unit" },
      { type: "suggestion", label: "FMN", placeholder: "Enter FMN", fieldType: "fmn" },
      { type: "suggestion", label: "Command", placeholder: "Enter Command", fieldType: "command" },

      { type: "input", label: "Address", placeholder: "e.g. C/O 56 APO" },
      { type: "input", label: "I Card Number", placeholder: "e.g. A–123456" },
    ],
  },

  "Shop Keeper": {
    title: "Fill Details",
    helperText: "Fill shopkeeper details.",
    fields: [
      { type: "input", label: "Rider/Driver Name", placeholder: "Enter Name" },
      { type: "input", label: "Shop Address", placeholder: "Address" },
      { type: "input", label: "Shop Name", placeholder: "Shop Name" },
      { type: "suggestion", label: "Unit", placeholder: "Enter Unit", fieldType: "unit" },
      { type: "input", label: "Pass No.", placeholder: "Enter Pass No." },
      { type: "input", label: "Pass Issue Date", placeholder: "Pick Date" },
      { type: "input", label: "Pass Expire Date", placeholder: "Pick Date" },
    ],
  },

  "Temporary Hired Worker": {
    title: "Fill Details",
    helperText: "Enter worker details.",
    fields: [
      { type: "input", label: "Rider/Driver Name", placeholder: "Enter Name" },
      { type: "input", label: "Place of Stay", placeholder: "Enter Location" },
      { type: "input", label: "Place Of Work", placeholder: "Enter Location" },
      { type: "input", label: "Type of Work", placeholder: "Enter Work Type" },
      { type: "input", label: "Pass No.", placeholder: "Enter Pass No." },
      { type: "input", label: "Pass Issue Date", placeholder: "Pick Date" },
      { type: "input", label: "Pass Expire Date", placeholder: "Pick Date" },
    ],
  },
};
