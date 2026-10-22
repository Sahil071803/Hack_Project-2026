import { useEffect, useRef, useState } from "react";
import { Copy, Check, AlertOctagon, AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";

const SEVERITY = {
  Critical: { cls: "sev-critical", Icon: AlertOctagon },
  High: { cls: "sev-high", Icon: AlertTriangle },
  Medium: { cls: "sev-medium", Icon: AlertCircle },
  Low: { cls: "sev-low", Icon: Info },
};

export function SeverityBadge({ severity }) {
  const entry = SEVERITY[severity] || SEVERITY.Low;
  const { Icon } = entry;
  return (
    <span className={`badge ${entry.cls}`}>
      <Icon size={12} aria-hidden="true" />
      {SEVERITY[severity] ? severity : "Low"}
    </span>
  );
}

function legacyCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(area);
  if (!ok) throw new Error("copy failed");
}

export function CopyButton({ text, label = "Copy" }) {
  const [state, setState] = useState("idle");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else legacyCopy(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={copy} aria-live="polite">
      {state === "copied" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label}
    </button>
  );
}

export function CodeBlock({ code, title = "Corrected code", copyLabel = "Copy code" }) {
  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        <span>{title}</span>
        <CopyButton text={code} label={copyLabel} />
      </div>
      <pre tabIndex={0}><code>{code}</code></pre>
    </div>
  );
}

export default function IssueList({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="empty success">
        <CheckCircle2 size={28} aria-hidden="true" />
        <h3>No issues detected</h3>
        <p className="muted">The analysis did not flag any problems in this code.</p>
      </div>
    );
  }

  return (
    <ul className="issue-list">
      {issues.map((issue) => (
        <li key={issue.id} className={`issue ${(SEVERITY[issue.severity] || SEVERITY.Low).cls}`}>
          <div className="issue-head">
            <SeverityBadge severity={issue.severity} />
            {issue.line ? <span className="chip">Line {issue.line}</span> : null}
          </div>
          <h4>{issue.title}</h4>
          <p>{issue.description}</p>
          <p className="issue-fix"><strong>Recommended fix:</strong> {issue.fix}</p>
          {issue.snippet ? <CodeBlock code={issue.snippet} title="Corrected code" /> : null}
        </li>
      ))}
    </ul>
  );
}