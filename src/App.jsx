import { Component, useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import KnowledgeBase from "./pages/KnowledgeBase.jsx";
import History from "./pages/History.jsx";
import { getSeedHistory } from "./data/mockAnalysis.js";

const HISTORY_KEY = "codesage.history.v1";
const HISTORY_LIMIT = 50;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* storage unavailable or corrupted: fall back to sample history */
  }
  return getSeedHistory();
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error("UI error:", error);
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="page">
          <div className="empty danger" role="alert">
            <h3>Something went wrong</h3>
            <p className="muted">This page hit an unexpected error. Reload to try again.</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>Reload page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFound() {
  return (
    <div className="page">
      <div className="empty">
        <h3>Page not found</h3>
        <p className="muted">That address does not exist in CodeSage AI.</p>
        <Link to="/" className="btn btn-primary btn-sm">Back to dashboard</Link>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      /* ignore storage errors */
    }
  }, [history]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const addHistory = useCallback((entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, HISTORY_LIMIT));
  }, []);
  const removeHistory = useCallback((id) => setHistory((prev) => prev.filter((h) => h.id !== id)), []);
  const clearHistory = useCallback(() => setHistory([]), []);

  return (
    <ErrorBoundary key={location.pathname}>
      <div className="app">
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} />
        <div className="shell">
          <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
          {menuOpen ? <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" /> : null}
          <main id="main" className="main" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Home onSaveHistory={addHistory} />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/history" element={<History items={history} onDelete={removeHistory} onClear={clearHistory} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
