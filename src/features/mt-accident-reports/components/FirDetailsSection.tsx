// components/mt-accident/FirDetailsSection.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FirDetailsSectionProps {
  firNumber: string;
  onFirNumberChange: (value: string) => void;
  firDate: Date | undefined;
  onFirDateChange: (date: Date | undefined) => void;
  policeStation: string;
  onPoliceStationChange: (value: string) => void;
}

export function FirDetailsSection(props: FirDetailsSectionProps) {
  const { firNumber, onFirNumberChange, firDate, onFirDateChange, policeStation, onPoliceStationChange } = props;

  return (
    <section>
      <h3 className="text-lg font-bold mb-4">FIR / MACT Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>FIR / MACT No.</Label>
          <Input
            placeholder="Value"
            value={firNumber}
            onChange={(e) => onFirNumberChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>FIR Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !firDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {firDate ? format(firDate, "PPP") : "-- / -- / ----"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={firDate} onSelect={onFirDateChange} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-2 mt-6">
        <Label>FIR Police Station</Label>
        <Input
          placeholder="Enter Station Name"
          value={policeStation}
          onChange={(e) => onPoliceStationChange(e.target.value)}
        />
      </div>
    </section>
  );
}