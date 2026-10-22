import { useEffect, useMemo, useState } from "react";
import { FileText, FileType2, Search, RefreshCw, AlertTriangle, FolderOpen } from "lucide-react";
import FileUpload from "../components/FileUpload.jsx";
import Loader from "../components/Loader.jsx";
import { apiConfig, fetchDocuments, uploadDocument } from "../services/api.js";

const FILTERS = ["All", "PDF", "TXT"];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function KnowledgeBase() {
  const [docs, setDocs] = useState([]);
  const [local, setLocal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchDocuments()
      .then((list) => { if (!cancelled) setDocs(list); })
      .catch((err) => { if (!cancelled) setError(err.message || "Could not load documents."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reload]);

  async function handleUpload(file) {
    setUploadError("");
    setUploading(true);
    try {
      await uploadDocument(file);
      const type = file.name.split(".").pop().toUpperCase();
      setLocal((prev) => [
        {
          id: `local-${Date.now()}`, title: file.name, type, topic: "Uploaded",
          pages: null, sections: null, size: formatSize(file.size), updated: "Just now",
          summary: apiConfig.demoMode
            ? "Added in this browser session only. It is not indexed or searchable in demo mode."
            : "Uploaded to the backend.",
          tags: [], local: true,
        },
        ...prev,
      ]);
    } catch (err) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const all = useMemo(() => [...local, ...docs], [local, docs]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((d) => {
      if (filter !== "All" && d.type !== filter) return false;
      if (!q) return true;
      const haystack = [d.title, d.summary, d.topic, ...(d.tags || [])].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [all, query, filter]);

  const count = (t) => all.filter((d) => d.type === t).length;

  return (
    <div className="page">
      <header className="page-head">
        <h1>Knowledge Base</h1>
        <p>The programming notes and documentation that answers are grounded in.</p>
      </header>

      {apiConfig.demoMode ? (
        <div className="callout">
          <FileText size={16} aria-hidden="true" />
          <p>These are sample documents for the demo. Real chunking, embedding and search start once the backend is connected.</p>
        </div>
      ) : null}

      <div className="stats">
        <div className="stat"><span className="stat-num">{all.length}</span><span className="muted">Documents</span></div>
        <div className="stat"><span className="stat-num">{count("PDF")}</span><span className="muted">PDF files</span></div>
        <div className="stat"><span className="stat-num">{count("TXT")}</span><span className="muted">Text notes</span></div>
      </div>

      <section className="card" aria-label="Add documents">
        <header className="card-head"><h2>Add documents</h2></header>
        <FileUpload
          accept=".pdf,.txt"
          title={uploading ? "Uploading..." : "Drop a PDF or TXT file here"}
          hint="Programming notes or documentation. Up to 10 MB."
          maxSizeMB={10}
          onFile={handleUpload}
        />
        {uploadError ? <p className="field-error" role="alert"><AlertTriangle size={14} aria-hidden="true" /> {uploadError}</p> : null}
      </section>

      <div className="toolbar">
        <label className="search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search documents</span>
          <input type="search" placeholder="Search by title, topic or tag" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="seg" role="group" aria-label="Filter by file type">
          {FILTERS.map((f) => (
            <button key={f} type="button" className={`seg-btn${filter === f ? " is-active" : ""}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader label="Loading documents..." />
      ) : error ? (
        <div className="empty danger" role="alert">
          <AlertTriangle size={28} aria-hidden="true" />
          <h3>Could not load documents</h3>
          <p className="muted">{error}</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setReload((n) => n + 1)}>
            <RefreshCw size={14} aria-hidden="true" /> Try again
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <FolderOpen size={28} aria-hidden="true" />
          <h3>{all.length === 0 ? "No documents yet" : "No documents match"}</h3>
          <p className="muted">{all.length === 0 ? "Upload a PDF or TXT file to start building your knowledge base." : "Try a different search or file type filter."}</p>
        </div>
      ) : (
        <ul className="grid">
          {visible.map((d) => {
            const Icon = d.type === "PDF" ? FileType2 : FileText;
            return (
              <li key={d.id} className="card doc">
                <div className="doc-top">
                  <span className="doc-icon"><Icon size={18} aria-hidden="true" /></span>
                  <span className="chip">{d.type}</span>
                  {d.local ? <span className="chip chip-warm">This session only</span> : null}
                </div>
                <h3>{d.title}</h3>
                <p className="muted">{d.summary}</p>
                {d.tags && d.tags.length > 0 ? (
                  <div className="tags">{d.tags.map((t) => <span key={t} className="chip chip-soft">{t}</span>)}</div>
                ) : null}
                <p className="small muted doc-meta">
                  {d.pages ? `${d.pages} pages` : d.sections ? `${d.sections} sections` : "Size only"}
                  {" - "}{d.size}{" - "}Updated {d.updated}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}