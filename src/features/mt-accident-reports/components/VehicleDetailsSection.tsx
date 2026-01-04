// components/mt-accident/VehicleDetailsSection.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleDetailsSectionProps {
  vehicleNumber: string;
  onVehicleNumberChange: (value: string) => void;
  makeModel: string;
  onMakeModelChange: (value: string) => void;
}

export function VehicleDetailsSection(props: VehicleDetailsSectionProps) {
  const { vehicleNumber, onVehicleNumberChange, makeModel, onMakeModelChange } = props;

  return (
    <section>
      <h3 className="text-lg font-bold mb-4">Vehicle Details</h3>
      <div className="space-y-2">
        <Label>Vehicle BA No. / Civil Vehicle Registration No.</Label>
        <Input
          placeholder="eg. UP 16 AP 1234"
          value={vehicleNumber}
          onChange={(e) => onVehicleNumberChange(e.target.value)}
        />
      </div>
      <div className="space-y-2 mt-4">
        <Label>Make & Take (Model / Type)</Label>
        <Input
          placeholder="Model / Type"
          value={makeModel}
          onChange={(e) => onMakeModelChange(e.target.value)}
        />
      </div>
    </section>
  );
}