import { useState } from "react";
import Modal from "./Modal";
import {
  FormField,
  TextInput,
  SelectInput,
  TextareaInput,
  FormActions,
} from "./FormField";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateClassModal({
  isOpen,
  onClose,
}: CreateClassModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("Intermediate");
  const [maxStudents, setMaxStudents] = useState("30");
  const [schedule, setSchedule] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      setName("");
      setCode("");
      setDescription("");
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Class"
      subtitle="Set up a new class for the current semester"
    >
      <div className="space-y-5">
        {/* Class Name + Code */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <FormField label="Class Name" htmlFor="className" required>
              <TextInput
                id="className"
                placeholder="e.g. Introduction to Machine Learning"
                value={name}
                onChange={setName}
              />
            </FormField>
          </div>
          <FormField label="Course Code" htmlFor="classCode" required>
            <TextInput
              id="classCode"
              placeholder="e.g. ML-101"
              value={code}
              onChange={setCode}
            />
          </FormField>
        </div>

        {/* Category + Max Students */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" htmlFor="classCategory">
            <SelectInput
              id="classCategory"
              value={category}
              onChange={setCategory}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </SelectInput>
          </FormField>
          <FormField label="Max Students" htmlFor="maxStudents">
            <TextInput
              id="maxStudents"
              placeholder="30"
              value={maxStudents}
              onChange={setMaxStudents}
              type="number"
            />
          </FormField>
        </div>

        {/* Schedule + Room */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Schedule" htmlFor="classSchedule" hint="e.g. Mon/Wed 10:00 AM">
            <TextInput
              id="classSchedule"
              placeholder="e.g. Mon/Wed 10:00 AM"
              value={schedule}
              onChange={setSchedule}
            />
          </FormField>
          <FormField label="Room / Location" htmlFor="classRoom">
            <TextInput
              id="classRoom"
              placeholder="e.g. Room 304 or Online"
              value={room}
              onChange={setRoom}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Description" htmlFor="classDesc">
          <TextareaInput
            id="classDesc"
            placeholder="Brief description of the class, prerequisites, and learning outcomes..."
            value={description}
            onChange={setDescription}
            rows={4}
          />
        </FormField>

        {/* Preview Card */}
        {(name || code) && (
          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Preview
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-accent">
                  {code || "—"}


                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-100">
                  {name || "Class Name"}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {category} · {maxStudents || "0"} seats · {room || "TBD"}
                </p>
              </div>
            </div>
          </div>
        )}

        <FormActions
          onCancel={onClose}
          onConfirm={handleCreate}
          confirmLabel="Create Class"
          loading={loading}
        />
      </div>
    </Modal>
  );
}
