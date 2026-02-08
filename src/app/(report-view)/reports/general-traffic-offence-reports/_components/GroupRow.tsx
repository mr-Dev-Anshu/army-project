// "use client";

// import React from "react";
// import { ChevronDown } from "lucide-react";
// import DetailsTable from "./DetailsTable";

// interface GroupRowProps {
//   group: any;
//   index: number;
//   isVehicleInvolved: boolean;
//   onView: (offence: any) => void;
//   onPrint?: (offence: any) => void;
//   isOpen: boolean;
//   onToggle: () => void;
// }

// export default function GroupRow({ group, index, isVehicleInvolved, onView, onPrint, isOpen, onToggle }: GroupRowProps) {
//   const offences = group.offences || [];
//   const total = offences.length;
//   const pending = offences.filter((o: any) => !o.actionStatus).length;
//   const taken = offences.filter((o: any) => o.actionStatus === true).length;
//   const typeName = group.offenceType || "Unknown Offence";

//   // Format Index like "01."
//   const formattedIndex = (index + 1).toString().padStart(2, "0") + ".";

//   return (
//     <div className="border-b border-gray-100 last:border-0 bg-white">
//       {/* Group Header Row */}
//       <div
//         onClick={onToggle}
//         className="flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none"
//       >
//         {/* Type of Offence */}
//         <div className="flex-1 font-semibold text-gray-800 text-sm flex items-center gap-2">
//           <span>{formattedIndex}</span>
//           <span>{typeName.toUpperCase()}</span>
//         </div>

//         {/* Action Status Summary */}
//         <div className="w-64 text-center text-sm">
//           <span className="text-gray-500 mr-1">Pending:</span>
//           <span className="font-bold text-gray-900 mr-4">{pending.toString().padStart(2, "0")}</span>
//           <span className="text-gray-300">|</span>
//           <span className="text-gray-500 ml-4 mr-1">Taken:</span>
//           <span className="font-bold text-gray-900">{taken.toString().padStart(2, "0")}</span>
//         </div>

//         {/* No of Records & Chevron */}
//         <div className="w-32 flex items-center justify-end gap-6 text-sm">
//           <span className="font-bold text-gray-900">{total.toString().padStart(2, "0")}</span>
//           <ChevronDown
//             className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
//           />
//         </div>
//       </div>

//       {/* Expandable Content */}
//       <div
//         className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/50 ${isOpen ? "max-h-[2000px] opacity-100 py-4 px-6 border-t border-gray-100" : "max-h-0 opacity-0"}`}
//       >
//         <DetailsTable offences={offences} isVehicleInvolved={isVehicleInvolved} onView={onView} onPrint={onPrint} />
//       </div>
//     </div>
//   );
// }



"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import DetailsTable from "./DetailsTable";

interface GroupRowProps {
  group: any;
  index: number;
  isVehicleInvolved: boolean;
  onView: (offence: any) => void;
  onPrint?: (offence: any) => void;
  onEdit?: (offence: any) => void; // ✅ FIX
  isOpen: boolean;
  onToggle: () => void;
}

export default function GroupRow({
  group,
  index,
  isVehicleInvolved,
  onView,
  onPrint,
  onEdit, // ✅ FIX
  isOpen,
  onToggle,
}: GroupRowProps) {
  const offences = group.offences || [];
  const total = offences.length;
  const pending = offences.filter((o: any) => !o.actionStatus).length;
  const taken = offences.filter((o: any) => o.actionStatus === true).length;
  const typeName = group.offenceType || "Unknown Offence";

  const formattedIndex = (index + 1).toString().padStart(2, "0") + ".";

  return (
    <div className="border-b border-gray-100 last:border-0 bg-white">
      {/* Group Header */}
      <div
        onClick={onToggle}
        className="flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none"
      >
        <div className="flex-1 font-semibold text-gray-800 text-sm flex items-center gap-2">
          <span>{formattedIndex}</span>
          <span>{typeName.toUpperCase()}</span>
        </div>

        <div className="w-64 text-center text-sm">
          <span className="text-gray-500 mr-1">Pending:</span>
          <span className="font-bold text-gray-900 mr-4">
            {pending.toString().padStart(2, "0")}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 ml-4 mr-1">Taken:</span>
          <span className="font-bold text-gray-900">
            {taken.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="w-32 flex items-center justify-end gap-6 text-sm">
          <span className="font-bold text-gray-900">
            {total.toString().padStart(2, "0")}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/50 ${
          isOpen
            ? "max-h-[2000px] opacity-100 py-4 px-6 border-t border-gray-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <DetailsTable
          offences={offences}
          isVehicleInvolved={isVehicleInvolved}
          onView={onView}
          onPrint={onPrint}
          onEdit={onEdit}   
        />
      </div>
    </div>
  );
}
