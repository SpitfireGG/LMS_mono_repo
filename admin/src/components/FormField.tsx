interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-bold text-zinc-300"
      >
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-zinc-500">{hint}</p>}
    </div>
  );
}

const inputClasses =
  "w-full bg-zinc-950 border border-zinc-800 focus:border-accent-dark/50 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all";

export function TextInput({
  id,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  id?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClasses}
    />
  );
}

export function SelectInput({
  id,
  value,
  onChange,
  children,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClasses} cursor-pointer`}
    >
      {children}
    </select>
  );
}

export function TextareaInput({
  id,
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  id?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={`${inputClasses} resize-none`}
    />
  );
}

export function FormActions({
  onCancel,
  onConfirm,
  confirmLabel = "Create",
  loading = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800 mt-5">
      <button
        onClick={onCancel}
        className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-accent-dark hover:bg-accent-dark text-white transition-all shadow-lg shadow-accent-dark/20 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : confirmLabel}
      </button>
    </div>
  );
}
