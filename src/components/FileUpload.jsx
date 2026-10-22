import { useRef, useState } from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";

/**
 * Drag-and-drop / click-to-browse file picker with validation.
 * `file` is an optional { name, note } object describing the current selection.
 */
export default function FileUpload({
  accept,
  title,
  hint,
  maxSizeMB = 5,
  file = null,
  onFile,
  onClear,
  compact = false,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const allowed = accept.split(",").map((s) => s.trim().toLowerCase());

  function validate(f) {
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) return `"${f.name}" is not supported. Allowed types: ${allowed.join(", ")}.`;
    if (f.size === 0) return `"${f.name}" is empty.`;
    if (f.size > maxSizeMB * 1024 * 1024) return `"${f.name}" is larger than ${maxSizeMB} MB.`;
    return "";
  }

  function handle(f) {
    if (!f) return;
    const message = validate(f);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    onFile(f);
  }

  function openPicker() {
    if (inputRef.current) inputRef.current.click();
  }

  return (
    <div className="upload-block">
      <div
        className={`dropzone${dragging ? " is-drag" : ""}${compact ? " is-compact" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={`${title}. Press Enter to choose a file.`}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handle(e.dataTransfer.files && e.dataTransfer.files[0]);
        }}
      >
        <UploadCloud size={22} aria-hidden="true" />
        <div>
          <p className="dz-title">{title}</p>
          <p className="muted small">{hint}</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          handle(e.target.files && e.target.files[0]);
          e.target.value = "";
        }}
      />
      {error ? (
        <p className="field-error" role="alert">
          <AlertCircle size={14} aria-hidden="true" /> {error}
        </p>
      ) : null}
      {file ? (
        <div className="file-chip">
          <FileText size={14} aria-hidden="true" />
          <span className="file-name" title={file.name}>{file.name}</span>
          {file.note ? <span className="muted small file-note">{file.note}</span> : null}
          <button type="button" className="icon-btn" aria-label={`Remove ${file.name}`} onClick={onClear}>
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}