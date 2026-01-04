// components/mt-accident/CasualtyDetailsSection.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CasualtyDetailsSectionProps {
  injuredCivil: number;
  injuredMilitary: number;
  diedCivil: number;
  diedMilitary: number;
  onChange: (field: string, value: number) => void;
}

export function CasualtyDetailsSection(props: CasualtyDetailsSectionProps) {
  const { injuredCivil, injuredMilitary, diedCivil, diedMilitary, onChange } = props;

  return (
    <section>
      <h3 className="text-lg font-bold mb-4">Casualty Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Injured (Civil)</Label>
          <Input
            type="number"
            min="0"
            value={injuredCivil}
            onChange={(e) => onChange("injuredCivil", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Injured (Mil)</Label>
          <Input
            type="number"
            min="0"
            value={injuredMilitary}
            onChange={(e) => onChange("injuredMilitary", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Died (Civil)</Label>
          <Input
            type="number"
            min="0"
            value={diedCivil}
            onChange={(e) => onChange("diedCivil", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Died (Mil)</Label>
          <Input
            type="number"
            min="0"
            value={diedMilitary}
            onChange={(e) => onChange("diedMilitary", Number(e.target.value))}
          />
        </div>
      </div>
    </section>
  );
}