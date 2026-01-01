


// "use client";

// import { useForm } from "@/context/FormContext";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useState } from "react";

// export default function Step4Remarks() {
//   const { state, dispatch } = useForm();

//   const isStatic = !!state?.formData?.staticSpeed;
//   const d = isStatic
//     ? state.formData.staticSpeed
//     : state.formData.traffic;

//   const remarkOptions = [
//     "The indl committed offence as enumerated under para 3 above. Suitable disciplinary action be initiated and intimated to this office within 15 days.",
//     "The indl violated rules as stated above. Necessary action may please be taken.",
//     "The indl is liable for disciplinary action as mentioned.",
//   ];

//   const [selected, setSelected] = useState<number | null>(0);

//   const set = (value: string) =>
//     dispatch({
//       type: "SET_PATH",
//       path: isStatic
//         ? "formData.staticSpeed.remarks"
//         : "formData.traffic.remarks",
//       value,
//     });

//   return (
//     <div>
//       <Label className="mb-4 font-bold">ADD REMARKS:</Label>

//       <Textarea
//         value={d.remarks || ""}
//         onChange={(e) => set(e.target.value)}
//         className="min-h-[140px]"
//       />

//       <p className="text-gray-400 mt-4 mb-3">Pre Written Remarks</p>

//       {remarkOptions.map((text, i) => (
//         <label key={i} className="flex gap-2 mt-4">
//           <Checkbox
//             checked={selected === i}
//             onCheckedChange={() => {
//               setSelected(i);
//               set(text);
//             }}
//             className="mt-2"
//           />
//           {text}
//         </label>
//       ))}
//     </div>
//   );
// }


"use client";

import { useForm } from "@/context/FormContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { SuggestionInput } from "@/common/component/SuggestionInput";

export default function Step4Remarks() {
  const { state, dispatch } = useForm();

  const isStatic = !!state?.formData?.staticSpeed;
  const d = isStatic
    ? state.formData.staticSpeed
    : state.formData.traffic;

  const remarkOptions = [
    "The indl committed offence as enumerated under para 3 above. Suitable disciplinary action be initiated and intimated to this office within 15 days.",
    "The indl violated rules as stated above. Necessary action may please be taken.",
    "The indl is liable for disciplinary action as mentioned.",
  ];

  const [selected, setSelected] = useState<number | null>(0);

  const setRemarks = (value: string) =>
    dispatch({
      type: "SET_PATH",
      path: isStatic
        ? "formData.staticSpeed.remarks"
        : "formData.traffic.remarks",
      value,
    });

  return (
    <div>
      {/* ⭐ Offence Type Suggestion Input ⭐ */}
      <Label className="font-bold mb-2 block">Offence Type</Label>

      <SuggestionInput
        placeholder="Enter Offence Type"
        value={d?.offenceType || ""}
        onChange={(v) =>
          dispatch({
            type: "SET_PATH",
            path: isStatic
              ? "formData.staticSpeed.offenceType"
              : "formData.traffic.offenceType",
            value: v,
          })
        }
        fieldType="offenceType"
      />

      {/* ⭐ Remarks */}
      <Label className="mb-4 font-bold mt-4 block">ADD REMARKS:</Label>

      <Textarea
        value={d.remarks || ""}      
        onChange={(e) => setRemarks(e.target.value)}
        className="min-h-[140px]"
      />

      <p className="text-gray-400 mt-4 mb-3">Pre Written Remarks</p>

      {remarkOptions.map((text, i) => (
        <label key={i} className="flex gap-2 mt-4">
          <Checkbox
            checked={selected === i}
            onCheckedChange={() => {
              setSelected(i);
              setRemarks(text);
            }}
            className="mt-2"
          />
          {text}
        </label>
      ))}
    </div>
  );
}
