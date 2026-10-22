import { FlaskConical, FileText, FileType2, SearchX, Library } from "lucide-react";

export default function SourceReferences({ sources, demo, analyzed }) {
  if (!analyzed) {
    return (
      <div className="empty">
        <Library size={28} aria-hidden="true" />
        <h3>No references yet</h3>
        <p className="muted">Run Explain Code or Debug Code. Supporting passages from the knowledge base will appear here.</p>
      </div>
    );
  }

  if (!sources || sources.length === 0) {
    return (
      <div className="empty warn">
        <SearchX size={28} aria-hidden="true" />
        <h3>No relevant documents found</h3>
        <p className="muted">
          The knowledge base has no passages that match this code, so this answer is not backed by documentation.
          Upload related notes on the Knowledge Base page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="stack">
      {demo ? (
        <div className="callout">
          <FlaskConical size={16} aria-hidden="true" />
          <p>Demonstration references. These passages are sample content, not live retrieval results.</p>
        </div>
      ) : null}
      {sources.map((src) => {
        const Icon = src.type === "PDF" ? FileType2 : FileText;
        const pct = Math.round((src.relevance || 0) * 100);
        return (
          <figure className="source" key={src.id}>
            <figcaption className="source-head">
              <Icon size={16} aria-hidden="true" />
              <span className="source-title">{src.title}</span>
              <span className="chip">{src.type}</span>
              <span className="chip chip-soft">{src.location}</span>
            </figcaption>
            <blockquote>{src.excerpt}</blockquote>
            <div className="meter" aria-label={`Relevance ${pct} percent`}>
              <span className="meter-track"><span className="meter-fill" style={{ width: `${pct}%` }} /></span>
              <span className="small muted">{pct}% match</span>
            </div>
          </figure>
        );
      })}
    </div>
  );
}