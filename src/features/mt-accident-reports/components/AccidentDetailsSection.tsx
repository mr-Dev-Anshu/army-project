// components/mt-accident/AccidentDetailsSection.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AccidentDetailsSectionProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string;
  onTimeChange: (time: string) => void;
  place: string;
  onPlaceChange: (place: string) => void;
  type: string;
  onTypeChange: (type: string) => void;
  cause: string;
  onCauseChange: (cause: string) => void;
}

export function AccidentDetailsSection(props: AccidentDetailsSectionProps) {
  const {
    date,
    onDateChange,
    time,
    onTimeChange,
    place,
    onPlaceChange,
    type,
    onTypeChange,
    cause,
    onCauseChange,
  } = props;

  return (
    <section>
      <h3 className="text-lg font-bold mb-4">Accident Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Date of Accident</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "-- / -- / ----"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={onDateChange} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Time of Accident (24hr format)</Label>
          <Input type="time" value={time} onChange={(e) => onTimeChange(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <Label>Place of Accident</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter Address"
            value={place}
            onChange={(e) => onPlaceChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-6">
        <Label className="mb-3 block">Type of Accident</Label>
        <RadioGroup value={type} onValueChange={onTypeChange}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Normal", "Serious", "Fatal", "Very Serious"].map((t) => (
              <div
                key={t}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-all",
                  type === t ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                )}
              >
                <RadioGroupItem value={t} id={`type-${t}`} />
                <Label htmlFor={`type-${t}`} className="cursor-pointer">
                  {t}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2 mt-6">
        <Label>Probable Cause of Accident</Label>
        <Input
          placeholder="Briefly explain cause"
          value={cause}
          onChange={(e) => onCauseChange(e.target.value)}
        />
      </div>
    </section>
  );
}