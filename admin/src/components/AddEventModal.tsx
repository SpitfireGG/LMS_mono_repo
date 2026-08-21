import { useState } from "react";
import Modal from "./Modal";
import {
  FormField,
  TextInput,
  SelectInput,
  TextareaInput,
  FormActions,
} from "./FormField";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const eventTypes = [
  { value: "session", label: "Class Session" },
  { value: "assignment", label: "Assignment Deadline" },
  { value: "exam", label: "Exam / Quiz" },
  { value: "office", label: "Office Hours" },
  { value: "meeting", label: "Meeting" },
];

const classOptions = [
  { value: "UXD-301", label: "UXD-301 — Foundations of UX Design" },
  { value: "CSE-410", label: "CSE-410 — Advanced Data Structures" },
  { value: "HCI-220", label: "HCI-220 — Human-Computer Interaction" },
  { value: "ML-501", label: "ML-501 — Machine Learning Foundations" },
];

export default function AddEventModal({
  isOpen,
  onClose,
}: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("session");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [selectedClass, setSelectedClass] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      setTitle("");
      setNotes("");
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Event"
      subtitle="Schedule a new event on your calendar"
    >
      <div className="space-y-5">
        {/* Title */}
        <FormField label="Event Title" htmlFor="evtTitle" required>
          <TextInput
            id="evtTitle"
            placeholder="e.g. Midterm Review Session"
            value={title}
            onChange={setTitle}
          />
        </FormField>

        {/* Type + Class */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Event Type" htmlFor="evtType">
            <SelectInput
              id="evtType"
              value={eventType}
              onChange={setEventType}
            >
              {eventTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label="Related Class" htmlFor="evtClass">
            <SelectInput
              id="evtClass"
              value={selectedClass}
              onChange={setSelectedClass}
            >
              <option value="">None (Personal)</option>
              {classOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </SelectInput>
          </FormField>
        </div>

        {/* Date */}
        <FormField label="Date" htmlFor="evtDate" required>
          <TextInput
            id="evtDate"
            type="date"
            placeholder=""
            value={date}
            onChange={setDate}
          />
        </FormField>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Time" htmlFor="evtStart">
            <TextInput
              id="evtStart"
              type="time"
              placeholder=""
              value={startTime}
              onChange={setStartTime}
            />
          </FormField>
          <FormField label="End Time" htmlFor="evtEnd">
            <TextInput
              id="evtEnd"
              type="time"
              placeholder=""
              value={endTime}
              onChange={setEndTime}
            />
          </FormField>
        </div>

        {/* Location */}
        <FormField label="Location" htmlFor="evtLocation">
          <TextInput
            id="evtLocation"
            placeholder="e.g. Room 304 or Zoom link"
            value={location}
            onChange={setLocation}
          />
        </FormField>

        {/* Notes */}
        <FormField label="Notes" htmlFor="evtNotes">
          <TextareaInput
            id="evtNotes"
            placeholder="Additional details or preparation required..."
            value={notes}
            onChange={setNotes}
            rows={3}
          />
        </FormField>

        {/* Preview */}
        {title && (
          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Preview
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 text-center shrink-0">
                <p className="text-lg font-extrabold text-zinc-100 leading-none">
                  {date ? new Date(date + "T00:00:00").getDate() : "—"}
                </p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">
                  {date
                    ? new Date(date + "T00:00:00").toLocaleDateString("en", {
                        month: "short",
                      })
                    : "—"}
                </p>
              </div>
              <div className="h-10 w-px bg-zinc-800" />
              <div>
                <p className="text-sm font-bold text-zinc-100">
                  {title || "Event Title"}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {startTime} – {endTime}
                  {selectedClass && ` · ${selectedClass}`}
                  {location && ` · ${location}`}
                </p>
              </div>
            </div>
          </div>
        )}

        <FormActions
          onCancel={onClose}
          onConfirm={handleCreate}
          confirmLabel="Add Event"
          loading={loading}
        />
      </div>
    </Modal>
  );
}
