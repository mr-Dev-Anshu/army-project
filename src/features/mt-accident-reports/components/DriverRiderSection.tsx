// components/mt-accident/DriverRiderSection.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DriverRiderSectionProps {
  driverName: string;
  onDriverNameChange: (value: string) => void;
  driverRank: string;
  onDriverRankChange: (value: string) => void;
  driverUnit: string;
  onDriverUnitChange: (value: string) => void;
  driverArmyNo: string;
  onDriverArmyNoChange: (value: string) => void;
}

export function DriverRiderSection(props: DriverRiderSectionProps) {
  const {
    driverName,
    onDriverNameChange,
    driverRank,
    onDriverRankChange,
    driverUnit,
    onDriverUnitChange,
    driverArmyNo,
    onDriverArmyNoChange,
  } = props;

  return (
    <section>
      <h3 className="text-lg font-bold mb-4">Driver / Rider Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Driver / Rider Name</Label>
          <Input value={driverName} onChange={(e) => onDriverNameChange(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Rank</Label>
          <Input value={driverRank} onChange={(e) => onDriverRankChange(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Input value={driverUnit} onChange={(e) => onDriverUnitChange(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Army No.</Label>
          <Input value={driverArmyNo} onChange={(e) => onDriverArmyNoChange(e.target.value)} />
        </div>
      </div>
    </section>
  );
}