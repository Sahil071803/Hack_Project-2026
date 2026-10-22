export default function Loader({ label = "Working...", hint }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader-ring" aria-hidden="true" />
      <div>
        <p className="loader-label">{label}</p>
        {hint ? <p className="muted small">{hint}</p> : null}
      </div>
    </div>
  );
}