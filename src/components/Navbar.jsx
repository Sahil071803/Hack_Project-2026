import { NavLink, Link } from "react-router-dom";
import { Menu, X, Github, FlaskConical, Radio } from "lucide-react";
import { apiConfig } from "../services/api.js";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/knowledge", label: "Knowledge Base" },
  { to: "/history", label: "History" },
];

export function Logo() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="20" height="20">
        <path d="M25 22 15 32l10 10M39 22l10 10-10 10" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Navbar({ menuOpen, onToggleMenu }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
          onClick={onToggleMenu}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>

        <Link to="/" className="brand" aria-label="CodeSage AI home">
          <Logo />
          <span className="brand-name">CodeSage <span className="brand-ai">AI</span></span>
        </Link>

        <nav className="top-nav" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `top-link${isActive ? " is-active" : ""}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-right">
          {apiConfig.demoMode ? (
            <span className="status status-demo" title="Using built-in sample data. No backend or AI model is called.">
              <FlaskConical size={14} aria-hidden="true" /> Demo Mode
            </span>
          ) : (
            <span className="status status-live" title={`Connected to ${apiConfig.baseURL || "backend"}`}>
              <Radio size={14} aria-hidden="true" /> Live
            </span>
          )}
          <a className="icon-btn" href="https://github.com/" target="_blank" rel="noreferrer noopener" aria-label="GitHub repository (placeholder link)">
            <Github size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="rgb-line" aria-hidden="true" />
    </header>
  );
}