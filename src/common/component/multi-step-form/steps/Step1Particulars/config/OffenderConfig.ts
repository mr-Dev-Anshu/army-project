export const offenderFormsConfig: any = {
  "Military Person": {
    title: "Fill Offender Particulars",
    helperText: "Select who the offender is and fill their details.",
    fields: [
      {
        type: "input",
        label: "Army Rider / Driver Number",
        key: "armyNumber",
        placeholder: "Enter Number",
      },
      {
        type: "select",
        label: "Select Rank",
        key: "rank",
        options: [
          { label: "Sepoy", value: "sepoy" },
          { label: "NCO", value: "nco" },
        ],
      },
      { type: "input", label: "Unit", key: "unit", placeholder: "Enter Unit" },
      { type: "input", label: "FMN", key: "fmn", placeholder: "Enter FMN" },
      { type: "input", label: "Command", key: "command", placeholder: "Enter Command" },
      { type: "input", label: "ID Card Number", key: "iCardNumber", placeholder: "Enter ID" },
    ],
  },

  Civilian: {
    title: "Fill Civilian Details",
    helperText: "Enter required civilian offender details.",
    fields: [
      { type: "input", label: "Full Name", key: "name", placeholder: "Enter Name" },
      {
        type: "input",
        label: "Father Name",
        key: "fatherName",
        placeholder: "Enter Father Name",
      },
      { type: "input", label: "Address", key: "address", placeholder: "Enter Address" },
      { type: "input", label: "Mobile Number", key: "mobileNumber", placeholder: "Enter Number" },
      { type: "input", label: "ID Proof", key: "idProof", placeholder: "Enter ID Proof" },
    ],
  },

  Employee: {
    title: "Fill Employee Details",
    helperText: "Enter employee offender details.",
    fields: [
      { type: "input", label: "Employee ID", key: "employeeId", placeholder: "Enter ID" },
      { type: "input", label: "Department", key: "department", placeholder: "Enter Department" },
      { type: "input", label: "Address", key: "address", placeholder: "Enter Address" },
      { type: "input", label: "Mobile Number", key: "mobileNumber", placeholder: "Enter Number" },
    ],
  },

  "Servant/Maid": {
    title: "Fill Offender Particulars",
    helperText: "Select who the offender is and fill their details.",
    fields: [
      {
        type: "input",
        label: "Maid/Servant Pass Number*",
        key: "passNumber",
        placeholder: "e.g. 12345678",
      },
      {
        type: "input",
        label: "Father’s Name (Son of)",
        key: "fatherName",
        placeholder: "e.g. Apradhi k Papa",
      },
      { type: "input", label: "Pass ID", key: "passId", placeholder: "e.g. 1234" },
      { type: "input", label: "Name", key: "name", placeholder: "e.g. John Apradhi" },
      {
        type: "select",
        label: "Trade",
        key: "trade",
        options: [
          { label: "Maid Servant", value: "maid" },
          { label: "Cook", value: "cook" },
          { label: "House Help", value: "househelp" },
        ],
      },
      {
        type: "input",
        label: "Worked at Quarter Number",
        key: "qtrNumber",
        placeholder: "e.g. DM–35/4",
      },
      {
        type: "select",
        label: "C/O Rank (Army official’s details)",
        key: "c_o_rank",
        options: [
          { label: "Sepoy", value: "sepoy" },
          { label: "NCO", value: "nco" },
        ],
      },
      { type: "input", label: "Name", key: "c_o_name", placeholder: "e.g. John Apradhi" },
      { type: "input", label: "Place of QTR.", key: "placeOfQtr", placeholder: "Location" },
      {
        type: "select",
        label: "Unit",
        key: "unit",
        options: [
          { label: "Unit 1", value: "u1" },
          { label: "Unit 2", value: "u2" },
        ],
      },
      {
        type: "select",
        label: "FMN",
        key: "fmn",
        options: [
          { label: "FMN 1", value: "f1" },
          { label: "FMN 2", value: "f2" },
        ],
      },
      {
        type: "select",
        label: "Command",
        key: "command",
        options: [
          { label: "Command 1", value: "c1" },
          { label: "Command 2", value: "c2" },
        ],
      },
      { type: "input", label: "Address", key: "address", placeholder: "e.g. C/O 56 APO" },
      { type: "input", label: "I Card Number", key: "iCardNumber", placeholder: "e.g. A–123456" },
    ],
  },

  "Shop Keeper": {
    title: "Fill Details",
    helperText: "Select who the offender is and fill their details.",
    fields: [
      {
        type: "input",
        label: "Civil/DD Vehicle Rider/Driver Name",
        key: "name",
        placeholder: "e.g. John Keeper",
      },
      {
        type: "input",
        label: "Shop Address",
        key: "shopAddress",
        placeholder: "e.g. C/O 56 APO",
      },
      { type: "input", label: "Shop Name", key: "shopName", placeholder: "e.g. John Shop" },
      {
        type: "select",
        label: "Unit",
        key: "unit",
        options: [
          { label: "Unit 1", value: "u1" },
          { label: "Unit 2", value: "u2" },
        ],
      },
      { type: "input", label: "Pass No.", key: "passNo", placeholder: "Enter Pass No." },
      { type: "input", label: "Pass Issue Date", key: "passIssueDate", placeholder: "Pick a date" },
      {
        type: "input",
        label: "Pass Expire Date",
        key: "passExpireDate",
        placeholder: "Pick a date",
      },
    ],
  },
  "Temporary Hired Worker": {
    title: "Fill Details",
    helperText:
      "Select who the offender is and fill their details. The form will update based on your selection.",
    fields: [
      {
        type: "input",
        label: "Civil/DD Vehicle Rider/Driver Name",
        key: "name",
        placeholder: "e.g. John Keeper",
      },
      {
        type: "input",
        label: "Place of Stay",
        key: "placeOfStay",
        placeholder: "e.g. C/O 56 APO",
      },
      {
        type: "input",
        label: "Place Of Work",
        key: "placeOfWork",
        placeholder: "e.g. C/O 56 APO",
      },
      {
        type: "input",
        label: "Type of Work",
        key: "typeOfWork",
        placeholder: "e.g. John Shop",
      },
      {
        type: "input",
        label: "Pass No.",
        key: "passNo",
        placeholder: "Enter Pass No.",
      },
      {
        type: "input",
        label: "Pass Issue Date",
        key: "passIssueDate",
        placeholder: "Pick a date",
      },
      {
        type: "input",
        label: "Pass Expire Date",
        key: "passExpireDate",
        placeholder: "Pick a date",
      },
    ],
  },
};
