export const offenderFormsConfig: any = {
  "Military Person": {
    title: "Fill Offender Particulars",
    helperText: "Select who the offender is and fill their details.",
    fields: [
      { type: "input", label: "Full Name", placeholder: "Enter Name" },
      {
        type: "input",
        label: "Army Rider / Driver Number",
        placeholder: "Enter Number",
      },
      {
        type: "select",
        label: "Select Rank",
        options: [
          { label: "Sepoy", value: "sepoy" },
          { label: "NCO", value: "nco" },
        ],
      },
      { type: "input", label: "Unit", placeholder: "Enter Unit" },
      { type: "input", label: "FMN", placeholder: "Enter FMN" },
      { type: "input", label: "Command", placeholder: "Enter Command" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "ID Card Number", placeholder: "Enter ID" },
    ],
  },

  Civilian: {
    title: "Fill Civilian Details",
    helperText: "Enter required civilian offender details.",
    fields: [
      { type: "input", label: "Full Name", placeholder: "Enter Name" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "Mobile Number", placeholder: "Enter Number" },
      { type: "input", label: "ID Proof", placeholder: "Enter ID Proof" },
    ],
  },

  Employee: {
    title: "Fill Employee Details",
    fields: [
      { type: "input", label: "Employee ID", placeholder: "Enter ID" },
      { type: "input", label: "Department", placeholder: "Enter Department" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
    ],
  },

  "Servant/Maid": {
    title: "Fill Servant / Maid Details",
    fields: [
      { type: "input", label: "Full Name", placeholder: "Enter Name" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "I Card Number", placeholder: "Enter ID" },
    ],
  },

  "Shop Keeper": {
    title: "Fill Shop Keeper Details",
    fields: [
      { type: "input", label: "Full Name", placeholder: "Enter Name" },
      { type: "input", label: "Shop Name", placeholder: "Enter Shop Name" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
    ],
  },

  "Temporary Hired Worker": {
    title: "Fill Temporary Worker Details",
    fields: [
      { type: "input", label: "Full Name", placeholder: "Enter Name" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "Type of Work", placeholder: "Enter Work" },
    ],
  },
};
