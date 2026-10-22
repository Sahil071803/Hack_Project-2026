import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Library, History as HistoryIcon, Info, X } from "lucide-react";
import { apiConfig } from "../services/api.js";

const ITEMS = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/knowledge", label: "Knowledge Base", Icon: Library },
  { to: "/history", label: "Analysis History", Icon: HistoryIcon },
];

export default function Sidebar({ open, onNavigate }) {
  const dialogRef = useRef(null);

  function openAbout() {
    const dlg = dialogRef.current;
    if (dlg && typeof dlg.showModal === "function") dlg.showModal();
  }
  function closeAbout() {
    const dlg = dialogRef.current;
    if (dlg && typeof dlg.close === "function") dlg.close();
  }

  return (
    <aside id="sidebar" className={`sidebar${open ? " is-open" : ""}`} aria-label="Sidebar">
      <nav aria-label="Main">
        <ul className="side-list">
          {ITEMS.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} onClick={onNavigate} className={({ isActive }) => `side-link${isActive ? " is-active" : ""}`}>
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <button type="button" className="side-link" onClick={openAbout}>
              <Info size={18} aria-hidden="true" />
              About
            </button>
          </li>
        </ul>
      </nav>

      <div className="side-foot">
        <p className="side-foot-title">{apiConfig.demoMode ? "Demo data" : "Live backend"}</p>
        <p className="muted small">
          {apiConfig.demoMode
            ? "Results are pre-written samples. Connect your backend to enable real analysis."
            : "Requests are sent to your configured backend."}
        </p>
      </div>

      <dialog
        ref={dialogRef}
        className="dialog"
        aria-labelledby="about-title"
        onClick={(e) => { if (e.target === dialogRef.current) closeAbout(); }}
      >
        <div className="dialog-body">
          <div className="dialog-head">
            <h2 id="about-title">About CodeSage AI</h2>
            <button type="button" className="icon-btn" aria-label="Close about dialog" onClick={closeAbout}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p>
            CodeSage AI is a code explainer and debugging assistant that grounds its answers in programming
            documentation using retrieval-augmented generation (RAG).
          </p>
          <p className="muted">
            This build is the frontend only. In demo mode every explanation, issue and reference is a
            pre-written sample, and no AI inference or document retrieval takes place.
          </p>
          <p className="muted small">Submitted code is never executed.</p>
        </div>
      </dialog>
    </aside>
  );
}