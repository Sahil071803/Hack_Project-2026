import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CodeInput from "../components/CodeInput.jsx";
import FileUpload from "../components/FileUpload.jsx";
import AnalysisResult from "../components/AnalysisResult.jsx";
import { analyzeCode, apiConfig, uploadDocument } from "../services/api.js";
import { LANGUAGES, getSampleCode, isSampleCode, getMockAnalysis } from "../data/mockAnalysis.js";

const CODE_EXT = {
  py: "python", js: "javascript", jsx: "javascript", java: "java",
  cpp: "cpp", cc: "cpp", c: "c", h: "c", ts: "typescript", tsx: "typescript",
};
const ACCEPT = ".py,.js,.jsx,.java,.cpp,.cc,.c,.h,.ts,.tsx,.txt,.pdf";

function mergeResult(prev, data) {
  const base = prev && prev.language === data.language ? prev : {};
  return {
    language: data.language,
    demo: Boolean(data.demo),
    notice: data.notice,
    sources: Array.isArray(data.sources) ? data.sources : [],
    explanation: data.explanation || base.explanation || null,
    debug: data.debug || base.debug || null,
  };
}

export default function Home({ onSaveHistory }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(() => getSampleCode("python"));
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("explanation");
  const [attached, setAttached] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Re-open an entry sent from the History page.
  useEffect(() => {
    const entry = location.state && location.state.entry;
    if (!entry) return;
    setLanguage(entry.language);
    setCode(entry.code || "");
    setProblem(entry.problem || "");
    setError("");
    if (apiConfig.demoMode) {
      const data = getMockAnalysis({ language: entry.language, mode: entry.mode, code: entry.code });
      setResult(mergeResult(null, data));
      setTab(entry.mode === "debug" ? "issues" : "explanation");
    } else {
      setResult(null);
    }
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

  function handleLanguage(next) {
    if (!code.trim() || isSampleCode(code)) setCode(getSampleCode(next));
    setLanguage(next);
    setResult(null);
    setError("");
  }

  function handleClear() {
    setCode("");
    setProblem("");
    setResult(null);
    setError("");
    setAttached(null);
  }

  function handleSample() {
    setCode(getSampleCode(language));
    setResult(null);
    setError("");
  }

  async function run(mode) {
    if (busy) return;
    if (!code.trim()) {
      setResult(null);
      setError("The editor is empty. Paste some code or choose Load sample, then try again.");
      return;
    }
    setError("");
    setBusy(mode);
    try {
      const data = await analyzeCode({ code, language, mode, problem });
      setResult((prev) => mergeResult(prev, { ...data, language }));
      setTab(mode === "debug" ? "issues" : "explanation");
      const firstLine = code.trim().split("\n")[0].slice(0, 48);
      onSaveHistory({
        id: `h-${Date.now()}`,
        language,
        mode,
        code,
        problem,
        createdAt: Date.now(),
        title: `${mode === "debug" ? "Debugged" : "Explained"}: ${firstLine}`,
        issueCount: data.debug && data.debug.issues ? data.debug.issues.length : 0,
      });
    } catch (err) {
      setResult(null);
      setError((err && err.message) || "Something went wrong while analyzing the code.");
    } finally {
      setBusy("");
    }
  }

  async function handleFile(file) {
    const ext = file.name.split(".").pop().toLowerCase();
    const lang = CODE_EXT[ext];
    if (lang) {
      try {
        const text = await file.text();
        setCode(text);
        setLanguage(lang);
        setResult(null);
        setError("");
        setAttached({ name: file.name, note: "Loaded into the editor" });
      } catch {
        setError(`Could not read "${file.name}". Try another file.`);
      }
      return;
    }
    if (apiConfig.demoMode) {
      setAttached({ name: file.name, note: "Selected. Not indexed in demo mode" });
      return;
    }
    try {
      await uploadDocument(file);
      setAttached({ name: file.name, note: "Uploaded to the knowledge base" });
    } catch (err) {
      setError((err && err.message) || "Upload failed.");
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>AI Code Assistant</h1>
        <p>Understand, debug and improve your code using AI and knowledge retrieval from programming documentation.</p>
      </header>

      <div className="workspace">
        <div className="col">
          <CodeInput
            code={code}
            onCodeChange={setCode}
            language={language}
            languageOptions={LANGUAGES}
            onLanguageChange={handleLanguage}
            problem={problem}
            onProblemChange={setProblem}
            onExplain={() => run("explain")}
            onDebug={() => run("debug")}
            onClear={handleClear}
            onSample={handleSample}
            busy={busy}
          />
          <section className="card" aria-label="File upload">
            <header className="card-head"><h2>Upload a file</h2></header>
            <FileUpload
              accept={ACCEPT}
              title="Drop a source file, PDF or TXT here"
              hint="Source files load into the editor. PDF and TXT are treated as reference documents."
              maxSizeMB={2}
              file={attached}
              onFile={handleFile}
              onClear={() => setAttached(null)}
              compact
            />
          </section>
        </div>

        <AnalysisResult result={result} loading={busy} error={error} activeTab={tab} onTabChange={setTab} />
      </div>
    </div>
  );
}