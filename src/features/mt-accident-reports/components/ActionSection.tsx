// components/mt-accident/ActionSection.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ActionSectionProps {
  status: string;
  onStatusChange: (value: string) => void;
  remark: string;
  onRemarkChange: (value: string) => void;
}

export function ActionSection(props: ActionSectionProps) {
  const { status, onStatusChange, remark, onRemarkChange } = props;

  return (
    <section>
      <h3 className="text-lg font-bold mb-4">Action</h3>
      <Label className="mb-3 block">Action Status</Label>
      <RadioGroup value={status} onValueChange={onStatusChange}>
        <div className="flex gap-8">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pending" id="pending" />
            <Label htmlFor="pending">Action Pending</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="taken" id="taken" />
            <Label htmlFor="taken">Action Taken</Label>
          </div>
        </div>
      </RadioGroup>

      <div className="space-y-2 mt-6">
        <Label>Add Remark</Label>
        <Textarea
          placeholder="Enter remark"
          rows={4}
          className="resize-none"
          value={remark}
          onChange={(e) => onRemarkChange(e.target.value)}
        />
      </div>
    </section>
  );
}