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

  /* ================= CIVILIAN ================= */

  Civilian: {
    title: "Fill Civilian Details",
    helperText: "Enter required civilian offender details.",
    fields: [
      { type: "input", label: "Full Name", placeholder: "Enter Name" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "Father's / Husband's Name", placeholder: "Enter Father's / Husband's Name" },

      { type: "input", label: "I Card Number", placeholder: "Enter ID" },
    ],
  },

  /* ================= EMPLOYEE ================= */

  Employee: {
    title: "Fill Employee Details",
    fields: [
      { type: "input", label: "Employee ID", placeholder: "Enter ID" },
      { type: "input", label: "Department", placeholder: "Enter Department" },

      { type: "input", label: "Place of Work", placeholder: "Enter Location" },
      { type: "input", label: "Place of Stay", placeholder: "Enter Location" },

      { type: "input", label: "Pass No.", placeholder: "Enter Pass Number" },
      {
        type: "date",
        label: "Pass Issue Date",
        placeholder: "Pick a date",
      },
      {
        type: "date",
        label: "Pass Expire Date",
        placeholder: "Pick a date",
      },

      { type: "input", label: "Address", placeholder: "Enter Address" },
    ],
  },

  /* ================= SERVANT / MAID ================= */

  "Servant/Maid": {
    title: "Fill Servant / Maid Details",
    fields: [
      { type: "input", label: "Maid/Servant Pass Number", placeholder: "e.g. 12345678" },
      { type: "input", label: "Father's Name (Son of)", placeholder: "e.g. Apraadhi k Papa" },

      { type: "input", label: "Pass ID", placeholder: "e.g. 1234" },
      { type: "input", label: "Name", placeholder: "Enter Name" },

      { type: "select", label: "Trade", options: [] },
      { type: "input", label: "Worked at Quarter Number", placeholder: "e.g. DM-35/4" },

      {
        type: "select",
        label: "Officers Enclave C/O Rank (Army official's details)",
        options: [],
      },

      { type: "input", label: "Army Official Name", placeholder: "Army Official Name" },

      { type: "input", label: "Place of QTR.", placeholder: "Enter Location" },
      { type: "input", label: "Unit", placeholder: "Select Unit" },

      { type: "input", label: "FMN", placeholder: "Select FMN" },
      { type: "input", label: "Command", placeholder: "Select Command" },

      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "I Card Number", placeholder: "Enter ID" },
    ],
  },

  /* ================= SHOP KEEPER ================= */

  "Shop Keeper": {
    title: "Fill Shop Keeper Details",
    fields: [
      { type: "input", label: "Shop Owner Name", placeholder: "e.g. John Keeper" },
      { type: "input", label: "Shop Address", placeholder: "e.g. C/O 56 APO" },
      { type: "input", label: "Shop Name", placeholder: "e.g. John Shop" },

      { type: "input", label: "Unit", placeholder: "Select Unit" },

      { type: "input", label: "Pass No.", placeholder: "Enter Pass Number" },
      {
        type: "date",
        label: "Pass Issue Date",
        placeholder: "Pick a date",
      },
      {
        type: "date",
        label: "Pass Expire Date",
        placeholder: "Pick a date",
      },
    ],
  },

  /* ================= TEMPORARY HIRED WORKER ================= */

  "Temporary Hired Worker": {
    title: "Fill Temporary Worker Details",
    fields: [
      { type: "input", label: "Name", placeholder: "Enter Name" },
      { type: "input", label: "Place of Stay", placeholder: "e.g. C/O 56 APO" },
      { type: "input", label: "Place of Work", placeholder: "e.g. C/O 56 APO" },
      { type: "input", label: "Type of Work", placeholder: "e.g. Labour / Helper" },

      { type: "input", label: "Pass No.", placeholder: "Enter Pass Number" },
      {
        type: "date",
        label: "Pass Issue Date",
        placeholder: "Pick a date",
      },
      {
        type: "date",
        label: "Pass Expire Date",
        placeholder: "Pick a date",
      },
    ],
  },
};
