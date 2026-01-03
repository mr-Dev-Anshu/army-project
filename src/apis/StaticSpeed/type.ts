// ---------- TYPES ----------
export interface StaticSpeedOffence {
  time?: string;
  timeOfOffence?: string;       // "18:00" (HH:mm)
  incidentLocation: string;
  description: string;
  authSpeed: string;
  actualSpeedNoted: string;
  overSpeedCalculated: string;
}

export interface StaticSpeedVehicle {
  vehicleType: string;
  vehicleCategory: string;
  vehicleNumber: string;
  vehicleName: string;
}

export interface CreateStaticSpeedPayload
  extends StaticSpeedVehicle {
  offenceOccurenceDetails: StaticSpeedOffence;
  actionStatus?: boolean;
}
