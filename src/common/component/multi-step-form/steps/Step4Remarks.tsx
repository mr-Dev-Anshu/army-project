
// "use client";

// import { useForm } from "@/context/FormContext";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useState } from "react";

// export default function Step4Remarks() {
//   const { state, dispatch } = useForm();
//   const d = state.formData;

//   const remarkOptions = [
//     "The indl committed offence as enumerated under Para 3 above...",
//     "Suitable disciplinary action be taken as deemed appropriate...",
//     "Unit should ensure strict compliance of traffic rules...",
//   ];

//   const [selected, setSelected] = useState<number | null>(0);

//   const updateRemarks = (text: string) => {
//     dispatch({
//       type: "SET_FORM_DATA",
//       payload: { remarks: text },
//     });
//   };

//   return (
//     <div
//       className="
//         space-y-6 
//         px-4
//         w-full
//         overflow-y-auto
//       "
//     >
//       {/* ADD REMARKS */}
//       <div className="w-full">
//         <h3 className="text-lg sm:text-xl font-semibold">
//           ADD REMARKS
//         </h3>

//         <Textarea
//           value={d.remarks || ""}
//           onChange={(e) => updateRemarks(e.target.value)}
//           className="
//             mt-2 
//             min-h-[120px] 
//             sm:min-h-[130px] 
//             md:min-h-[150px]
//           "
//         />
//       </div>

//       {/* PRE WRITTEN REMARKS */}
//       <div className="space-y-3">
//         <Label className="text-sm sm:text-base font-semibold">
//           Pre Written Remarks
//         </Label>

//         <div className="space-y-3">
//           {remarkOptions.map((text, index) => (
//             <label
//               key={index}
//               className="
//                 flex gap-2 
//                 items-start 
//                 text-sm sm:text-base 
//                 cursor-pointer
//                 leading-snug
//               "
//             >
//               <Checkbox
//                 checked={selected === index}
//                 onCheckedChange={() => {
//                   setSelected(index);
//                   updateRemarks(text);
//                 }}
//               />

//               <span className="block">
//                 {text}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useForm } from "@/context/FormContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { FileUpload } from "@/components/common/FileUpload";

interface Step4RemarksProps {
  value?: string;
  onChange?: (value: string) => void;
  files?: string[];
  onFilesChange?: (files: string[]) => void;
}

export default function Step4Remarks({ value, onChange, files, onFilesChange }: Step4RemarksProps) {
  const remarkOptions = [
    "The indl committed offence...",
    "Suitable disciplinary action...",
    "Unit should ensure traffic compliance...",
  ];

  const [selected, setSelected] = useState<number | null>(0);

  const set = (text: string) => {
    if (onChange) onChange(text);
  };

  return (
    <div className="space-y-6 px-4">
      <Textarea
        value={value || ""}
        onChange={(e) => set(e.target.value)}
        className="min-h-[140px]"
        placeholder="Enter remarks here..."
      />



      <div className="pt-4 border-t">
        <Label className="text-sm font-semibold mb-3 block">Pre-Written Remarks</Label>
        <div className="space-y-3">
          {remarkOptions.map((text, i) => (
            <label key={i} className="flex gap-2 items-start cursor-pointer">
              <Checkbox
                checked={selected === i}
                onCheckedChange={() => {
                  setSelected(i);
                  set(text);
                }}
                className="mt-0.5"
              />
              <span className="text-sm leading-snug text-gray-600">{text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t">
        <Label className="font-semibold text-sm text-gray-700">Attached Documents</Label>
        <FileUpload
          value={files}
          onChange={onFilesChange}
          mode="list"
        />
      </div>
    </div>
  );
}
