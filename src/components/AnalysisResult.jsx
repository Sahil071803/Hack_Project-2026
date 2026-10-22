import { useRef } from "react";
import { BookOpen, Bug, Wrench, Library, Sparkles, AlertTriangle, FlaskConical } from "lucide-react";
import Loader from "./Loader.jsx";
import IssueList, { CodeBlock } from "./IssueList.jsx";
import SourceReferences from "./SourceReferences.jsx";

const TABS = [
  { id: "explanation", label: "Code Explanation", Icon: BookOpen },
  { id: "issues", label: "Detected Issues", Icon: Bug },
  { id: "fix", label: "Suggested Fix", Icon: Wrench },
  { id: "sources", label: "Source References", Icon: Library },
];

function Hint({ title, text }) {
  return (
    <div className="empty">
      <Sparkles size={28} aria-hidden="true" />
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </div>
  );
}

function Explanation({ data }) {
  if (!data) return <Hint title="No explanation yet" text="Select Explain Code to see a summary and a step-by-step walkthrough." />;
  const steps = Array.isArray(data.steps) ? data.steps : [];
  const symbols = Array.isArray(data.symbols) ? data.symbols : [];
  return (
    <div className="stack">
      <section>
        <h3 className="section-title">Summary</h3>
        <p>{data.summary}</p>
      </section>
      {steps.length > 0 ? (
        <section>
          <h3 className="section-title">Step by step</h3>
          <ol className="steps">
            {steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </section>
      ) : null}
      {symbols.length > 0 ? (
        <section>
          <h3 className="section-title">Important functions and variables</h3>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr><th scope="col">Name</th><th scope="col">Kind</th><th scope="col">What it does</th></tr>
              </thead>
              <tbody>
                {symbols.map((s) => (
                  <tr key={s.name}>
                    <td><code>{s.name}</code></td>
                    <td><span className="chip chip-soft">{s.kind}</span></td>
                    <td>{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
      {data.note ? <p className="muted small">{data.note}</p> : null}
    </div>
  );
}

function Fix({ data }) {
  if (!data) return <Hint title="No suggested fix yet" text="Select Debug Code to get corrected code you can copy." />;
  const notes = Array.isArray(data.fixNotes) ? data.fixNotes : [];
  return (
    <div className="stack">
      <p>{data.summary}</p>
      {notes.length > 0 ? (
        <ul className="bullets">
          {notes.map((n, i) => (<li key={i}>{n}</li>))}
        </ul>
      ) : null}
      {data.fixedCode ? <CodeBlock code={data.fixedCode} title="Full corrected code" copyLabel="Copy corrected code" /> : null}
    </div>
  );
}

export default function AnalysisResult({ result, loading, error, activeTab, onTabChange }) {
  const tabRefs = useRef({});
  const issueCount = result && result.debug ? result.debug.issues.length : 0;

  function onKeyDown(e, index) {
    let next = null;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    onTabChange(TABS[next].id);
    const el = tabRefs.current[TABS[next].id];
    if (el) el.focus();
  }

  let body;
  if (loading) {
    body = <Loader label={loading === "debug" ? "Running demo debug analysis..." : "Running demo explanation..."} hint="Demo mode returns pre-written sample results. No AI model is called." />;
  } else if (error) {
    body = (
      <div className="empty danger" role="alert">
        <AlertTriangle size={28} aria-hidden="true" />
        <h3>Analysis failed</h3>
        <p className="muted">{error}</p>
      </div>
    );
  } else if (!result) {
    body = (
      <div className="empty">
        <Sparkles size={28} aria-hidden="true" />
        <h3>Ready when you are</h3>
        <p className="muted">Paste or edit code, then choose Explain Code or Debug Code. Results appear here.</p>
      </div>
    );
  } else {
    body = (
      <>
        {result.demo && result.notice ? (
          <div className="callout">
            <FlaskConical size={16} aria-hidden="true" />
            <p>{result.notice}</p>
          </div>
        ) : null}
        <div role="tablist" aria-label="Analysis sections" className="tablist">
          {TABS.map(({ id, label, Icon }, i) => (
            <button
              key={id}
              ref={(el) => { tabRefs.current[id] = el; }}
              role="tab"
              type="button"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              tabIndex={activeTab === id ? 0 : -1}
              className={`tab${activeTab === id ? " is-active" : ""}`}
              onClick={() => onTabChange(id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
              {id === "issues" && result.debug ? <span className="count">{issueCount}</span> : null}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="tabpanel">
          {activeTab === "explanation" && <Explanation data={result.explanation} />}
          {activeTab === "issues" && (result.debug
            ? <div className="stack"><p>{result.debug.summary}</p><IssueList issues={result.debug.issues} /></div>
            : <Hint title="No debugging results yet" text="Select Debug Code to find issues, severity levels and fixes." />)}
          {activeTab === "fix" && <Fix data={result.debug} />}
          {activeTab === "sources" && <SourceReferences sources={result.sources} demo={result.demo} analyzed />}
        </div>
      </>
    );
  }

  return (
    <section className="card analysis" aria-label="Analysis results" aria-busy={Boolean(loading)}>
      <header className="card-head">
        <h2>Analysis</h2>
      </header>
      {body}
    </section>
  );
}