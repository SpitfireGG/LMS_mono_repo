import { useState } from "react";
import Modal from "./Modal";
import {
  FormField,
  TextInput,
  SelectInput,
  TextareaInput,
  FormActions,
} from "./FormField";

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  assignmentTitle?: string;
}

const feedbackPresets = [
  "Excellent work! Keep it up.",
  "Good effort. Review the feedback for improvements.",
  "Meets expectations. See comments for details.",
  "Needs improvement. Please see rubric.",
  "Incomplete. Schedule a meeting to discuss.",
];

export default function GradeSubmissionModal({
  isOpen,
  onClose,
  studentName = "Aria Chen",
  assignmentTitle = "User Research Report",
}: GradeSubmissionModalProps) {
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("graded");
  const [loading, setLoading] = useState(false);

  const numericScore = parseFloat(score);
  const numericMax = parseFloat(maxScore);
  const percentage =
    !isNaN(numericScore) && !isNaN(numericMax) && numericMax > 0
      ? Math.round((numericScore / numericMax) * 100)
      : null;

  const handleGrade = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      setScore("");
      setFeedback("");
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Grade Submission"
      subtitle={`Review and grade ${studentName}'s work`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Student + Assignment Info */}
        <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-accent">
              {studentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-100">{studentName}</p>
            <p className="text-[11px] text-zinc-500">{assignmentTitle}</p>
          </div>
        </div>

        {/* Score + Max + Grade */}
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Score" htmlFor="gradeScore" required>
            <TextInput
              id="gradeScore"
              placeholder="85"
              value={score}
              onChange={setScore}
              type="number"
            />
          </FormField>
          <FormField label="Max Score" htmlFor="gradeMax">
            <TextInput
              id="gradeMax"
              placeholder="100"
              value={maxScore}
              onChange={setMaxScore}
              type="number"
            />
          </FormField>
          <FormField label="Letter Grade" htmlFor="gradeLetter">
            <SelectInput
              id="gradeLetter"
              value={grade}
              onChange={setGrade}
            >
              <option value="">Auto</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="B-">B-</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="C-">C-</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </SelectInput>
          </FormField>
        </div>

        {/* Score Preview */}
        {percentage !== null && (
          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Score Breakdown
              </span>
              <span
                className={`text-sm font-extrabold ${
                  percentage >= 90
                    ? "text-emerald-400"
                    : percentage >= 70
                      ? "text-accent"
                      : percentage >= 50
                        ? "text-amber-400"
                        : "text-rose-400"
                }`}
              >
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, percentage)}%`,
                  backgroundColor:
                    percentage >= 90
                      ? "#34d399"
                      : percentage >= 70
                        ? "var(--color-accent-dark)"
                        : percentage >= 50
                          ? "#fbbf24"
                          : "#fb7185",
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-500">
              <span>0</span>
              <span className="text-zinc-300 font-bold">
                {score} / {maxScore}
              </span>
              <span>{maxScore}</span>
            </div>
          </div>
        )}

        {/* Status */}
        <FormField label="Submission Status" htmlFor="gradeStatus">
          <SelectInput
            id="gradeStatus"
            value={status}
            onChange={setStatus}
          >
            <option value="graded">Graded</option>
            <option value="needs-revision">Needs Revision</option>
            <option value="incomplete">Incomplete</option>
          </SelectInput>
        </FormField>

        {/* Quick Feedback */}
        <FormField label="Feedback" htmlFor="gradeFeedback">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {feedbackPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setFeedback(preset)}
                className="text-[10px] font-bold text-zinc-500 bg-zinc-800 hover:bg-zinc-750 hover:text-zinc-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                {preset.length > 30 ? preset.slice(0, 30) + "..." : preset}
              </button>
            ))}
          </div>
          <TextareaInput
            id="gradeFeedback"
            placeholder="Detailed feedback for the student..."
            value={feedback}
            onChange={setFeedback}
            rows={4}
          />
        </FormField>

        <FormActions
          onCancel={onClose}
          onConfirm={handleGrade}
          confirmLabel="Submit Grade"
          loading={loading}
        />
      </div>
    </Modal>
  );
}
