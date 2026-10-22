import { Braces, ChevronDown } from "lucide-react";

export default function LanguageSelector({ value, onChange, options, disabled = false }) {
  return (
    <label className="select-wrap">
      <Braces size={16} aria-hidden="true" />
      <span className="sr-only">Programming language</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} aria-hidden="true" />
    </label>
  );
}