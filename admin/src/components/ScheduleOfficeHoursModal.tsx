import { useState } from "react";
import Modal from "./Modal";
import {
  FormField,
  TextInput,
  SelectInput,
  TextareaInput,
  FormActions,
} from "./FormField";

interface ScheduleOfficeHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ScheduleOfficeHoursModal({
  isOpen,
  onClose,
}: ScheduleOfficeHoursModalProps) {
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:00");
  const [location, setLocation] = useState("Online");
  const [recurring, setRecurring] = useState("weekly");
  const [maxStudents, setMaxStudents] = useState("5");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      setNotes("");
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Office Hours"
      subtitle="Set up recurring or one-off office hours for students"
    >
      <div className="space-y-5">
        {/* Day + Recurring */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Day" htmlFor="ohDay">
            <SelectInput id="ohDay" value={day} onChange={setDay}>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label="Recurrence" htmlFor="ohRecurring">
            <SelectInput
              id="ohRecurring"
              value={recurring}
              onChange={setRecurring}
            >
              <option value="weekly">Every week</option>
              <option value="biweekly">Every 2 weeks</option>
              <option value="once">One-time only</option>
            </SelectInput>
          </FormField>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Time" htmlFor="ohStart">
            <TextInput
              id="ohStart"
              type="time"
              placeholder=""
              value={startTime}
              onChange={setStartTime}
            />
          </FormField>
          <FormField label="End Time" htmlFor="ohEnd">
            <TextInput
              id="ohEnd"
              type="time"
              placeholder=""
              value={endTime}
              onChange={setEndTime}
            />
          </FormField>
        </div>

        {/* Location + Max Students */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Location" htmlFor="ohLocation">
            <TextInput
              id="ohLocation"
              placeholder="e.g. Online or Room 101"
              value={location}
              onChange={setLocation}
            />
          </FormField>
          <FormField
            label="Max Students"
            htmlFor="ohMax"
            hint="Per time slot"
          >
            <TextInput
              id="ohMax"
              placeholder="5"
              value={maxStudents}
              onChange={setMaxStudents}
              type="number"
            />
          </FormField>
        </div>

        {/* Notes */}
        <FormField label="Notes for Students" htmlFor="ohNotes">
          <TextareaInput
            id="ohNotes"
            placeholder="e.g. Come prepared with specific questions. Drop-ins welcome."
            value={notes}
            onChange={setNotes}
            rows={3}
          />
        </FormField>

        {/* Preview */}
        <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Schedule Preview
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-violet-400">
                {day.slice(0, 3).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100">Office Hours</p>
              <p className="text-[11px] text-zinc-500 font-mono">
                {startTime} – {endTime} · {location}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                {recurring === "weekly"
                  ? "Repeats every week"
                  : recurring === "biweekly"
                    ? "Repeats every 2 weeks"
                    : "One-time session"}{" "}
                · Max {maxStudents} students
              </p>
            </div>
          </div>
        </div>

        <FormActions
          onCancel={onClose}
          onConfirm={handleCreate}
          confirmLabel="Schedule Office Hours"
          loading={loading}
        />
      </div>
    </Modal>
  );
}
