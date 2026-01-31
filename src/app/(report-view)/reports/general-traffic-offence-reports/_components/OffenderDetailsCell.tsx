import React from "react";

interface OffenderDetailsCellProps {
  details: any;
  mpName: string;
}

export default function OffenderDetailsCell({ details, mpName }: OffenderDetailsCellProps) {
  /* ================= HELPERS ================= */
  const normalizeType = (t: string) => {
    if (!t) return "";
    if (t === "Military Person") return "militaryPersonnel";
    if (t === "Employee") return "employee";
    if (t === "Civilian") return "civilian";
    if (t === "Shop Keeper") return "shopKeeper";
    if (t === "Servant/Maid") return "servantMaid";
    if (t === "Temporary Hired Worker") return "tempHiredWorker";
    return t; // fallback (e.g. already camelCase)
  };

  // Resolve type from possible locations
  const rawType = details?.offenderType || details?.individualType || details?.type;
  const type = normalizeType(rawType);

  // Resolve details object from possible locations
  // If details contains 'offenderDetails', use that.
  // Otherwise, if it *is* the details object (no type wrapper), use it directly.
  const d = details?.offenderDetails || details?.individualDetails || details || {};

  const get = (...keys: string[]) => {
    for (const k of keys) {
      if (d[k]) return d[k];
    }
    return null;
  };

  const renderContent = () => {
    if (!details || Object.keys(details).length === 0) {
      return <span className="text-gray-400 text-xs">No details available</span>;
    }

    if (!type) return <span className="text-gray-400">-</span>;

    const TypeLabel = (
      <div className="text-xs font-semibold text-gray-500 mb-1">
        {type === 'militaryPersonnel' ? 'Military Personnel' :
          type === 'civilian' ? 'Civilian / Dependent' :
            type === 'employee' ? 'Employee' :
              type === 'shopKeeper' ? 'Shop Keeper' :
                type === 'servantMaid' ? 'Servant / Maid' :
                  type === 'tempHiredWorker' ? 'Temporarily Hired Worker' :
                    details?.individualType}
      </div>
    );

    /* ================= MILITARY PART ================= */
    if (type === 'militaryPersonnel') {
      const armyNo = get("armyNumber", "armyNo", "Army Rider / Driver Number", "militaryPersonnelArmyNo");
      const rank = get("rank", "Select Rank", "militaryPersonnelRank"); // "Select Rank" maps to "Select Rank" in form if not in map
      const name = get("name", "Full Name", "militaryPersonnelName");
      const unit = get("unit", "Unit", "militaryPersonnelUnit");
      const fmn = get("fmn", "FMN", "militaryPersonnelFmn");

      return (
        <div className="space-y-0.5 text-xs text-[#0A0A0A]">
          {armyNo && <div><span className="font-semibold ">Army No:</span> {armyNo}</div>}
          {rank && <div><span className="font-semibold ">Rank:</span> {rank}</div>}
          {name && <div><span className="font-semibold ">Name:</span> {name}</div>}
          {unit && <div><span className="font-semibold ">Unit:</span> {unit}</div>}
          {fmn && <div><span className="font-semibold ">FMN:</span> {fmn}</div>}
        </div>
      );
    }

    /* ================= EMPLOYEE ================= */
    if (type === 'employee') {
      const serviceNo = get("Employee ID", "employeeServiceNumber");
      // Note: "Rank" and "Name" are NOT in the Employee config, but keeping lookups just in case
      const rank = get("rank", "employeeRank");
      const name = get("name", "employeeName");
      const dept = get("Department");


      return (
        <div className="space-y-0.5 text-xs text-[#0A0A0A]">
          {serviceNo && <div><span className="font-semibold ">Service No:</span> {serviceNo}</div>}
          {dept && <div><span className="font-semibold ">Dept:</span> {dept}</div>}
          {/* Fallbacks if data exists */}
          {rank && <div><span className="font-semibold ">Rank:</span> {rank}</div>}
          {name && <div><span className="font-semibold ">Name:</span> {name}</div>}
        </div>
      );
    }

    /* ================= CIVILIAN ================= */
    if (type === 'civilian') {
      const name = get("name", "Full Name", "civilianName");
      const aadhar = get("aadharCardNo", "Aadhar Card No.", "civilianAadharCardNumber");
      const father = get("so", "Father's / Husband's Name", "civilianFathersName");
      const address = get("address", "Address", "civilianAddress");
      const iCard = get("iCardNumber", "ID Card Number", "civilianICardNumber", "icard", "identityCard");

      return (
        <div className="space-y-0.5 text-xs text-[#0A0A0A]">
          {name && <div><span className="font-semibold ">Name:</span> {name}</div>}
          {aadhar && <div><span className="font-semibold ">Aadhar No.:</span> {aadhar}</div>}
          {father && <div><span className="font-semibold ">Father/Husband:</span> {father}</div>}
          {address && <div><span className="font-semibold ">Address:</span> {address}</div>}
          {iCard && <div><span className="font-semibold ">ID Card:</span> {iCard}</div>}
        </div>
      );
    }

    /* ================= SHOP KEEPER ================= */
    if (type === "shopKeeper") {
      const name = get("Shop Owner Name", "shopOwnerName");
      const unit = get("unit", "Unit", "shopUnit");
      const address = get("Shop Address", "shopAddress");
      const passNo = get("Pass No.", "shopPassNo", "passNo");

      return (
        <div className="space-y-0.5 text-xs text-[#0A0A0A]">

          {name && <div><span className="font-semibold ">Name:</span> {name}</div>}
          {unit && <div><span className="font-semibold ">Unit:</span> {unit}</div>}
          {address && <div><span className="font-semibold ">Address:</span> {address}</div>}
          {passNo && <div><span className="font-semibold ">Pass No:</span> {passNo}</div>}
        </div>
      );
    }

    /* ================= SERVANT / MAID ================= */
    if (type === "servantMaid") {
      const name = get("name", "maidName");
      const father = get("so", "Father's Name (Son of)", "maidFathersName");
      const passNo = get("passNo", "Maid/Servant Pass Number", "maidPassNumber");
      const coRank = get("Officers Enclave C/O Rank (Army official's details)", "officersEnclaveRank");
      const coName = get("armyOfficialName", "Army Official Name", "officersEnclaveName");
      const coUnit = get("unit", "Unit", "officersEnclaveUnit");
      const coFmn = get("fmn", "FMN", "officersEnclaveFmn");

      return (
        <div className="space-y-0.5 text-xs text-[#0A0A0A]">
          {name && <div><span className="font-semibold ">Name:</span> {name}</div>}
          {father && <div><span className="font-semibold ">Father/Husband:</span> {father}</div>}
          {passNo && <div><span className="font-semibold ">Pass No:</span> {passNo}</div>}
          {coRank && <div><span className="font-semibold ">C/O Rank:</span> {coRank}</div>}
          {coName && <div><span className="font-semibold ">C/O Name:</span> {coName}</div>}
          {coUnit && <div><span className="font-semibold ">C/O Unit:</span> {coUnit}</div>}
          {coFmn && <div><span className="font-semibold ">C/O FMN:</span> {coFmn}</div>}
        </div>
      );
    }

    /* ================= TEMP HIRED WORKER ================= */
    if (type === "tempHiredWorker") {
      const name = get("name", "tempWorkerName");
      const passNo = get("Pass No.", "tempWorkerPassNo", "passNo");
      const placeWork = get("Place of Work", "tempWorkerPlaceOfWork");
      const typeWork = get("Type of Work", "tempWorkerTypeOfWork");

      return (
        <div className="space-y-0.5 text-xs text-[#0A0A0A]">
          {name && <div><span className="font-semibold ">Name:</span> {name}</div>}
          {passNo && <div><span className="font-semibold ">Pass No:</span> {passNo}</div>}
          {placeWork && <div><span className="font-semibold ">Place of Work:</span> {placeWork}</div>}
          {typeWork && <div><span className="font-semibold ">Type of Work:</span> {typeWork}</div>}
        </div>
      );
    }

    // Fallback for others
    return (
      <div className="space-y-0.5 text-xs">

        {Object.entries(d).slice(0, 3).map(([k, v]: any) => (
          <div key={k}><span className="font-semibold text-gray-900">{k.replace(/([A-Z])/g, ' $1').trim()}:</span> {v}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-1 text-xs">
      {renderContent()}

      {mpName && mpName !== "Unknown" && (
        <div className="flex gap-1 items-start pt-1 border-t border-dashed border-gray-200 mt-1">
          <span className="font-bold text-gray-900 min-w-[70px] shrink-0">MP Name:</span>
          <span className="text-gray-700 break-words">{mpName}</span>
        </div>
      )}
    </div>
  );
}
