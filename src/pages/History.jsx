import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { History as HistoryIcon, Trash2, ExternalLink, Search } from "lucide-react";
import { LANGUAGES } from "../data/mockAnalysis.js";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "explain", label: "Explain" },
  { id: "debug", label: "Debug" },
];

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
const langLabel = (id) => (LANGUAGES.find((l) => l.id === id) || { label: id }).label;

export default function History({ items, onDelete, onClear }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((h) => {
      if (filter !== "all" && h.mode !== filter) return false;
      if (!q) return true;
      return `${h.title} ${langLabel(h.language)} ${h.code}`.toLowerCase().includes(q);
    });
  }, [items, filter, query]);

  function handleClear() {
    if (window.confirm("Delete all analysis history? This cannot be undone.")) onClear();
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Analysis History</h1>
        <p>Review earlier analyses and open any of them again in the dashboard.</p>
      </header>

      <div className="toolbar">
        <label className="search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search history</span>
          <input type="search" placeholder="Search by title, language or code" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="seg" role="group" aria-label="Filter by analysis type">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className={`seg-btn${filter === f.id ? " is-active" : ""}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        {items.length > 0 ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleClear}>
            <Trash2 size={14} aria-hidden="true" /> Clear all
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <HistoryIcon size={28} aria-hidden="true" />
          <h3>No analyses yet</h3>
          <p className="muted">Run Explain Code or Debug Code on the dashboard and it will be saved here.</p>
          <Link to="/" className="btn btn-primary btn-sm">Go to dashboard</Link>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <Search size={28} aria-hidden="true" />
          <h3>No matching analyses</h3>
          <p className="muted">Try a different search or filter.</p>
        </div>
      ) : (
        <ul className="history-list">
          {visible.map((h) => (
            <li key={h.id} className="card history-item">
              <div className="history-main">
                <div className="history-top">
                  <span className={`badge ${h.mode === "debug" ? "mode-debug" : "mode-explain"}`}>{h.mode === "debug" ? "Debug" : "Explain"}</span>
                  <span className="chip">{langLabel(h.language)}</span>
                  {h.mode === "debug" ? <span className="chip chip-soft">{h.issueCount} {h.issueCount === 1 ? "issue" : "issues"}</span> : null}
                  {h.seed ? <span className="chip chip-warm">Sample entry</span> : null}
                  <time className="small muted" dateTime={new Date(h.createdAt).toISOString()}>{dateFormat.format(new Date(h.createdAt))}</time>
                </div>
                <h3>{h.title}</h3>
                <pre className="preview" aria-label="Code preview"><code>{String(h.code || "").split("\n").slice(0, 3).join("\n")}</code></pre>
              </div>
              <div className="history-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate("/", { state: { entry: h } })}>
                  <ExternalLink size={14} aria-hidden="true" /> Open
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDelete(h.id)} aria-label={`Delete ${h.title}`}>
                  <Trash2 size={14} aria-hidden="true" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}