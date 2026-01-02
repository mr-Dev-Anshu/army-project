"use client";

import React from "react";
import MilitaryPoliceReport, { MilitaryPoliceReportProps } from "@/components/reports/MilitaryPoliceReport";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { generateWordReport } from "@/utils/generateWordReport";

const mockData: MilitaryPoliceReportProps = {
  reportNo: "PRO/21 CPU/00042/102/25",
  reportDate: "12/12/2025",
  particulars: {
    primary: {
      aadharCardNo: "6648 1882 3227",
      name: "Mr. Rakesh Kumar",
      so: "Ravindra Thakur Baliya",
      relation: "Brother-in-law",
      armyNo: "615699057Y",
      rank: "Hav(CLK)",
      unit: "21 Corps Signal Regt (AREN)",
      fmn: "HQ 21 Corps",
      command: "Southern Comd",
      address: "C/O 56 APO",
      iCardNo: "F-835402",
    },
    secondary: {
      // Image shows identical data in 1.2 block as 1.1, I will replicate it to match exact image appearance
      aadharCardNo: "6648 1882 3227",
      name: "Mr. Rakesh Kumar",
      so: "Ravindra Thakur Baliya",
      relation: "Brother-in-law",
      armyNo: "615699057Y",
      rank: "Hav(CLK)",
      unit: "21 Corps Signal Regt (AREN)",
      fmn: "HQ 21 Corps",
      command: "Southern Comd",
      address: "C/O 56 APO",
      iCardNo: "F-835402",
    },
    vehicle: {
      baNo: "12A123456B",
      makeAndTake: "ALS",
    },
  },
  occurrence: {
    dateOfDuty: "04/01/2005",
    dutyTime: "06:00 - 12:30",
    dutyLocation: "Yodha gate",
    nameOfWitnessingOfficial1: "Bhupender Singh",
    nameOfWitnessingOfficial2: "Mukesh Singh",
    nameOfWitnessingOfficial3: "", // No third name in grid, but space is there
    timeOfOffence: "06:50",
    locationOfOffence: "Civilian Dronbachal Base",
    statement: "Taqriban 0650 baje uper likhe huye Civilian Dronbachal Base se aa raha tha tab maine usko rokh kar check karne par unke pass Cantt mein in/out hone keliye koi bhi pass nahi tha tab maine usse puch-tach karne par pata chala ki 21 CSR ka Hav(CLK) Ajay Shankar Jha ka Brother-in-Law hai. uska particulars uska aadhar card se note kiya aur usko jane diya.",
  },
  offence: {
    type: "Violation Of Local Orders",
    ref1: "Mil Tfc offence (Auth - Para 48 of SAO 6/S/2001/PM).",
    ref2: "Para 463(a) of CMP manual, SAO 9/S/78 and Stn order.",
    description: "The above Civilian Mr Rakesh Kumar brother-in-Law of Hav(CLK) Ajay Shankar Jha was staying in Govt Married Accn QTR No- 123/45 in Dronachal Base without any permission letter from concerned unit.",
  },
  witnessSig: {
    armyNo: "1122334A",
    rank: "Nk (MP)",
    name: "Bhupender Singh",
    unit: "21 Corps Pro Unit",
  },
  mpSig: {
    armyNo: "7788991B",
    rank: "Hav (MP)",
    name: "Robert Robert",
    unit: "21 Corps Pro Unit",
  },
  remarks: {
    text: "The indl committed offence as enumerated under Para 3 above. Suitable discp action be initiated against the indl by the unit, and inform to this office within 15 days from issue of this report.",
    station: "C/O 56 APO",
    dated: "23/01/2025",
  },
};

export default function TestReportPage() {
  const handleDownload = async () => {
    try {
      await generateWordReport(mockData);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 flex flex-col items-center gap-6">
      <Button onClick={handleDownload} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
        <FileDown className="w-4 h-4" />
        Download Word Report
      </Button>
      <MilitaryPoliceReport {...mockData} />
    </div>
  );
}
