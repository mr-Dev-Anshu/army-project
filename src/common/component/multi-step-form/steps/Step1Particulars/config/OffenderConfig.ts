//  export const offenderFormsConfig: any = {
//     "Military Person": {
//       title: "Fill Offender Particulars",
//       helperText: "Select who the offender is and fill their details.",
//       fields: [
//         {
//           type: "input",
//           label: "Army Rider / Driver Number",
//           placeholder: "Enter Number",
//         },
//         {
//           type: "select",
//           label: "Select Rank",
//           options: [
//             { label: "Sepoy", value: "sepoy" },
//             { label: "NCO", value: "nco" },
//           ],
//         },
//         { type: "input", label: "Unit", placeholder: "Enter Unit" },
//         { type: "input", label: "FMN", placeholder: "Enter FMN" },
//         { type: "input", label: "Command", placeholder: "Enter Command" },
//         { type: "input", label: "ID Card Number", placeholder: "Enter ID" },
//       ],
//     },

//     Civilian: {
//       title: "Fill Civilian Details",
//       helperText: "Enter required civilian offender details.",
//       fields: [
//         { type: "input", label: "Full Name", placeholder: "Enter Name" },
//         {
//           type: "input",
//           label: "Father Name",
//           placeholder: "Enter Father Name",
//         },
//         { type: "input", label: "Address", placeholder: "Enter Address" },
//         { type: "input", label: "Mobile Number", placeholder: "Enter Number" },
//         { type: "input", label: "ID Proof", placeholder: "Enter ID Proof" },
//       ],
//     },

//     Employee: {
//       title: "Fill Employee Details",
//       helperText: "Enter employee offender details.",
//       fields: [
//         { type: "input", label: "Employee ID", placeholder: "Enter ID" },
//         { type: "input", label: "Department", placeholder: "Enter Department" },
//         { type: "input", label: "Address", placeholder: "Enter Address" },
//         { type: "input", label: "Mobile Number", placeholder: "Enter Number" },
//       ],
//     },

//     "Servant/Maid": {
//       title: "Fill Offender Particulars",
//       helperText: "Select who the offender is and fill their details.",
//       fields: [
//         {
//           type: "input",
//           label: "Maid/Servant Pass Number*",
//           placeholder: "e.g. 12345678",
//         },
//         {
//           type: "input",
//           label: "Father’s Name (Son of)",
//           placeholder: "e.g. Apradhi k Papa",
//         },
//         { type: "input", label: "Pass ID", placeholder: "e.g. 1234" },
//         { type: "input", label: "Name", placeholder: "e.g. John Apradhi" },
//         {
//           type: "select",
//           label: "Trade",
//           options: [
//             { label: "Maid Servant", value: "maid" },
//             { label: "Cook", value: "cook" },
//             { label: "House Help", value: "househelp" },
//           ],
//         },
//         {
//           type: "input",
//           label: "Worked at Quarter Number",
//           placeholder: "e.g. DM–35/4",
//         },
//         {
//           type: "select",
//           label: "C/O Rank (Army official’s details)",
//           options: [
//             { label: "Sepoy", value: "sepoy" },
//             { label: "NCO", value: "nco" },
//           ],
//         },
//         { type: "input", label: "Name", placeholder: "e.g. John Apradhi" },
//         { type: "input", label: "Place of QTR.", placeholder: "Location" },
//         {
//           type: "select",
//           label: "Unit",
//           options: [
//             { label: "Unit 1", value: "u1" },
//             { label: "Unit 2", value: "u2" },
//           ],
//         },
//         {
//           type: "select",
//           label: "FMN",
//           options: [
//             { label: "FMN 1", value: "f1" },
//             { label: "FMN 2", value: "f2" },
//           ],
//         },
//         {
//           type: "select",
//           label: "Command",
//           options: [
//             { label: "Command 1", value: "c1" },
//             { label: "Command 2", value: "c2" },
//           ],
//         },
//         { type: "input", label: "Address", placeholder: "e.g. C/O 56 APO" },
//         { type: "input", label: "I Card Number", placeholder: "e.g. A–123456" },
//       ],
//     },

//     "Shop Keeper": {
//       title: "Fill Details",
//       helperText: "Select who the offender is and fill their details.",
//       fields: [
//         {
//           type: "input",
//           label: "Civil/DD Vehicle Rider/Driver Name",
//           placeholder: "e.g. John Keeper",
//         },
//         {
//           type: "input",
//           label: "Shop Address",
//           placeholder: "e.g. C/O 56 APO",
//         },
//         { type: "input", label: "Shop Name", placeholder: "e.g. John Shop" },
//         {
//           type: "select",
//           label: "Unit",
//           options: [
//             { label: "Unit 1", value: "u1" },
//             { label: "Unit 2", value: "u2" },
//           ],
//         },
//         { type: "input", label: "Pass No.", placeholder: "Enter Pass No." },
//         { type: "input", label: "Pass Issue Date", placeholder: "Pick a date" },
//         {
//           type: "input",
//           label: "Pass Expire Date",
//           placeholder: "Pick a date",
//         },
//       ],
//     },
//     "Temporary Hired Worker": {
//       title: "Fill Details",
//       helperText:
//         "Select who the offender is and fill their details. The form will update based on your selection.",
//       fields: [
//         {
//           type: "input",
//           label: "Civil/DD Vehicle Rider/Driver Name",
//           placeholder: "e.g. John Keeper",
//         },
//         {
//           type: "input",
//           label: "Place of Stay",
//           placeholder: "e.g. C/O 56 APO",
//         },
//         {
//           type: "input",
//           label: "Place Of Work",
//           placeholder: "e.g. C/O 56 APO",
//         },
//         {
//           type: "input",
//           label: "Type of Work",
//           placeholder: "e.g. John Shop",
//         },
//         {
//           type: "input",
//           label: "Pass No.",
//           placeholder: "Enter Pass No.",
//         },
//         {
//           type: "input",
//           label: "Pass Issue Date",
//           placeholder: "Pick a date",
//         },
//         {
//           type: "input",
//           label: "Pass Expire Date",
//           placeholder: "Pick a date",
//         },
//       ],
//     },
//   };


export const offenderFormsConfig: any = {
  "Military Person": {
    title: "Fill Offender Particulars",
    helperText: "Select who the offender is and fill their details.",
    fields: [
      {
        type: "input",
        label: "Army Rider / Driver Number",
        placeholder: "Enter Number",
      },

      { type: "input", label: "Rank", placeholder: "Enter Rank" },

      // 🔥 Suggestion Fields
      { type: "suggestion", label: "Unit", placeholder: "Enter Unit", fieldType: "unit" },
      { type: "suggestion", label: "FMN", placeholder: "Enter FMN", fieldType: "fmn" },
      { type: "suggestion", label: "Command", placeholder: "Enter Command", fieldType: "command" },

      { type: "input", label: "ID Card Number", placeholder: "Enter ID" },
    ],
  },

  Civilian: {
    title: "Fill Civilian Details",
    helperText: "Enter required civilian offender details.",
    fields: [
      { type: "input", label: "Full Name", placeholder: "Enter Name" },
      { type: "input", label: "Father Name", placeholder: "Enter Father Name" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "Mobile Number", placeholder: "Enter Number" },
      { type: "input", label: "ID Proof", placeholder: "Enter ID Proof" },
    ],
  },

  Employee: {
    title: "Fill Employee Details",
    helperText: "Enter employee offender details.",
    fields: [
      { type: "input", label: "Employee ID", placeholder: "Enter ID" },
      { type: "input", label: "Department", placeholder: "Enter Department" },
      { type: "input", label: "Address", placeholder: "Enter Address" },
      { type: "input", label: "Mobile Number", placeholder: "Enter Number" },
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

      {
        type: "select",
        label: "Trade",
        options: [
          { label: "Maid Servant", value: "maid" },
          { label: "Cook", value: "cook" },
          { label: "House Help", value: "househelp" },
        ],
      },

      { type: "input", label: "Worked at Quarter Number", placeholder: "e.g. DM–35/4" },

      { type: "input", label: "C/O Rank", placeholder: "Enter Rank" },

      { type: "input", label: "Name", placeholder: "e.g. Army Person Name" },
      { type: "input", label: "Place of QTR.", placeholder: "Location" },

      // 🔥 Suggestion Fields
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
      { type: "input", label: "Civil/DD Rider/Driver Name", placeholder: "Enter Name" },
      { type: "input", label: "Shop Address", placeholder: "Address" },
      { type: "input", label: "Shop Name", placeholder: "Shop Name" },

      // 🔥 Unit Suggestion
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
