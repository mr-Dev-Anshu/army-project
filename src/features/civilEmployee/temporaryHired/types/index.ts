// components/forms/types.ts

// ================= TEMPORARY HIRED WORKER PASS =================
export interface SubWorker {
  name: string;
  mobile: string;
  aadhar: string;
}

export interface TemporaryHiredWorker {
  workerName: string;
  workerMobile: string;
  workerAadhar: string;
  permanentAddressLine: string;
  permanentCityDistrict: string;
  permanentState: string;
  permanentPincode: string;
  placeOfStay: string;
  placeOfDuty: string;
  passNumber: string;
  validFrom: string | null;
  validTill: string | null;
  subWorkers: SubWorker[];
}