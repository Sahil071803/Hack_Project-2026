import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Bug, Eraser, FileCode2, TriangleAlert } from "lucide-react";
import LanguageSelector from "./LanguageSelector.jsx";
import Loader from "./Loader.jsx";

const MONACO_OPTIONS = {
  fontSize: 14,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 14, bottom: 14 },
  tabSize: 4,
  renderLineHighlight: "line",
  smoothScrolling: true,
  ariaLabel: "Code editor",
};

function defineTheme(monaco) {
  monaco.editor.defineTheme("codesage", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0d1019",
      "editor.lineHighlightBackground": "#151a2a",
      "editorLineNumber.foreground": "#4a5270",
      "editorLineNumber.activeForeground": "#a5b4fc",
    },
  });
}

export default function CodeInput({
  code, onCodeChange, language, languageOptions, onLanguageChange,
  problem, onProblemChange, onExplain, onDebug, onClear, onSample, busy,
}) {
  const [ready, setReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Monaco is fetched from a CDN. If it cannot load (offline), switch to a plain textarea.
  useEffect(() => {
    if (ready) return undefined;
    const timer = setTimeout(() => setUseFallback(true), 12000);
    return () => clearTimeout(timer);
  }, [ready]);

  const disabled = Boolean(busy);

  return (
    <section className="card editor-card" aria-label="Code input">
      <header className="card-head">
        <h2>Your code</h2>
        <div className="head-actions">
          <LanguageSelector value={language} onChange={onLanguageChange} options={languageOptions} disabled={disabled} />
          <button type="button" className="btn btn-ghost btn-sm" onClick={onSample} disabled={disabled}>
            <FileCode2 size={15} aria-hidden="true" /> Load sample
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClear} disabled={disabled}>
            <Eraser size={15} aria-hidden="true" /> Clear
          </button>
        </div>
      </header>

      <div className="editor-frame">
        {useFallback && !ready ? (
          <>
            <p className="callout callout-warn">
              <TriangleAlert size={16} aria-hidden="true" />
              The code editor could not load (it needs an internet connection). A basic text box is shown instead.
            </p>
            <textarea
              className="fallback-editor"
              aria-label="Code editor"
              spellCheck={false}
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
            />
          </>
        ) : (
          <Editor
            height="360px"
            language={language}
            value={code}
            theme="codesage"
            beforeMount={defineTheme}
            onMount={() => setReady(true)}
            onChange={(value) => onCodeChange(value ?? "")}
            loading={<Loader label="Loading editor..." />}
            options={MONACO_OPTIONS}
          />
        )}
      </div>

      <div className="field">
        <label htmlFor="problem">Describe the problem (optional)</label>
        <textarea
          id="problem"
          rows={2}
          maxLength={500}
          placeholder="For example: the average looks wrong, or the program crashes on an empty list."
          value={problem}
          onChange={(e) => onProblemChange(e.target.value)}
        />
      </div>

      <div className="action-row">
        <button type="button" className="btn btn-primary" onClick={onExplain} disabled={disabled}>
          <Play size={16} aria-hidden="true" />
          {busy === "explain" ? "Explaining..." : "Explain Code"}
        </button>
        <button type="button" className="btn btn-accent" onClick={onDebug} disabled={disabled}>
          <Bug size={16} aria-hidden="true" />
          {busy === "debug" ? "Debugging..." : "Debug Code"}
        </button>
      </div>
    </section>
  );
}