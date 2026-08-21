import { useState } from "react";
import Modal from "./Modal";
import {
  FormField,
  TextInput,
  SelectInput,
  TextareaInput,
  FormActions,
} from "./FormField";

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const assignmentTypes = [
  { value: "Report", label: "Report" },
  { value: "Code", label: "Code Submission" },
  { value: "Project", label: "Project" },
  { value: "Design", label: "Design" },
  { value: "Written", label: "Written" },
  { value: "Quiz", label: "Quiz" },
  { value: "Presentation", label: "Presentation" },
];

const classOptions = [
  { value: "UXD-301", label: "UXD-301 — Foundations of UX Design" },
  { value: "CSE-410", label: "CSE-410 — Advanced Data Structures" },
  { value: "HCI-220", label: "HCI-220 — Human-Computer Interaction" },
  { value: "ML-501", label: "ML-501 — Machine Learning Foundations" },
];

export default function CreateAssignmentModal({
  isOpen,
  onClose,
}: CreateAssignmentModalProps) {
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [type, setType] = useState("Report");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("23:59");
  const [weight, setWeight] = useState("20");
  const [maxScore, setMaxScore] = useState("100");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      setTitle("");
      setDescription("");
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Assignment"
      subtitle="Set up a new assignment for your class"
    >
      <div className="space-y-5">
        {/* Title */}
        <FormField label="Assignment Title" htmlFor="asgTitle" required>
          <TextInput
            id="asgTitle"
            placeholder="e.g. Weekly Research Paper"
            value={title}
            onChange={setTitle}
          />
        </FormField>

        {/* Class + Type */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Class" htmlFor="asgClass" required>
            <SelectInput
              id="asgClass"
              value={selectedClass}
              onChange={setSelectedClass}
            >
              <option value="">Select a class</option>
              {classOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label="Type" htmlFor="asgType">
            <SelectInput id="asgType" value={type} onChange={setType}>
              {assignmentTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectInput>
          </FormField>
        </div>

        {/* Due Date + Time */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Due Date" htmlFor="asgDueDate" required>
            <TextInput
              id="asgDueDate"
              type="date"
              placeholder=""
              value={dueDate}
              onChange={setDueDate}
            />
          </FormField>
          <FormField label="Due Time" htmlFor="asgDueTime">
            <TextInput
              id="asgDueTime"
              type="time"
              placeholder=""
              value={dueTime}
              onChange={setDueTime}
            />
          </FormField>
        </div>

        {/* Weight + Max Score */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Weight"
            htmlFor="asgWeight"
            hint="Percentage of final grade"
          >
            <div className="relative">
              <TextInput
                id="asgWeight"
                placeholder="20"
                value={weight}
                onChange={setWeight}
                type="number"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">
                %
              </span>
            </div>
          </FormField>
          <FormField label="Max Score" htmlFor="asgMaxScore">
            <TextInput
              id="asgMaxScore"
              placeholder="100"
              value={maxScore}
              onChange={setMaxScore}
              type="number"
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Instructions" htmlFor="asgDesc">
          <TextareaInput
            id="asgDesc"
            placeholder="Assignment instructions, requirements, and grading criteria..."
            value={description}
            onChange={setDescription}
            rows={4}
          />
        </FormField>

        {/* Preview */}
        {(title || selectedClass) && (
          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Preview
            </p>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                    {type}
                  </span>
                  {selectedClass && (
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                      {selectedClass}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-zinc-100">
                  {title || "Assignment Title"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">
                  {dueDate || "No date"} {dueTime}
                </p>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  {weight}% · {maxScore} pts
                </p>
              </div>
            </div>
          </div>
        )}

        <FormActions
          onCancel={onClose}
          onConfirm={handleCreate}
          confirmLabel="Create Assignment"
          loading={loading}
        />
      </div>
    </Modal>
  );
}
