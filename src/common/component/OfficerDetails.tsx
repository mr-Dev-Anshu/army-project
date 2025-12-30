import { FormInput } from "./FormInput";
import { FormSection } from "./FormSection";

interface OfficerDetailsProps {
  title: string;
  data: {
    name: string;
    rank: string;
    unit: string;
    armyNo: string;
  };
  onChange: (field: string, value: string) => void;
}

export function OfficerDetails({
  title,
  data,
  onChange,
}: OfficerDetailsProps) {
  return (
    <FormSection title={title}>
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Name"
          value={data.name}
          onChange={(v) => onChange("name", v)}
        />
        <FormInput
          label="Rank"
          value={data.rank}
          onChange={(v) => onChange("rank", v)}
        />
        <FormInput
          label="Unit"
          value={data.unit}
          onChange={(v) => onChange("unit", v)}
        />
        <FormInput
          label="Army No."
          value={data.armyNo}
          onChange={(v) => onChange("armyNo", v)}
        />
      </div>
    </FormSection>
  );
}
