import axios from "axios";
import { getMockAnalysis, knowledgeDocs } from "../data/mockAnalysis.js";

// ---------------------------------------------------------------------------
// Configuration (Vite env variables, see .env.example)
// ---------------------------------------------------------------------------
const env = import.meta.env;
const USE_MOCK = String(env.VITE_USE_MOCK ?? "true").toLowerCase() !== "false";

export const apiConfig = {
  baseURL: env.VITE_API_BASE_URL || "",
  demoMode: USE_MOCK,
  paths: {
    analyze: env.VITE_ANALYZE_PATH || "",
    documents: env.VITE_DOCUMENTS_PATH || "",
    upload: env.VITE_UPLOAD_PATH || "",
  },
};

const client = axios.create({ baseURL: apiConfig.baseURL, timeout: 30000 });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function requirePath(name) {
  const path = apiConfig.paths[name];
  if (!path) {
    throw new Error(
      `Live mode is on but no endpoint is configured for "${name}". Set the matching VITE_*_PATH value in frontend/.env, or set VITE_USE_MOCK=true.`
    );
  }
  return path;
}

function toFriendlyError(err) {
  if (err?.response) return new Error(`The server responded with status ${err.response.status}. Check the backend logs.`);
  if (err?.code === "ECONNABORTED") return new Error("The request timed out. Try again.");
  if (err?.request) return new Error("Could not reach the backend. Check that it is running and VITE_API_BASE_URL is correct.");
  return err instanceof Error ? err : new Error("Something went wrong.");
}

// ---------------------------------------------------------------------------
// Public API used by the UI
// ---------------------------------------------------------------------------

/**
 * Analyze code. mode is "explain" or "debug".
 *
 * Expected live response shape (adapt it here once your backend contract is final):
 *   explain -> { explanation: { summary, steps[], symbols[{name,kind,description}] }, sources[] }
 *   debug   -> { debug: { summary, issues[{id,severity,line,title,description,fix,snippet}], fixedCode }, sources[] }
 *   sources -> [{ id, title, type, location, excerpt, relevance }]  (empty array = nothing relevant found)
 */
export async function analyzeCode({ code, language, mode, problem = "" }) {
  if (USE_MOCK) {
    await wait(1300);
    return getMockAnalysis({ code, language, mode });
  }
  try {
    const { data } = await client.post(requirePath("analyze"), { code, language, mode, problem });
    return { mode, language, demo: false, sources: [], ...data };
  } catch (err) {
    throw toFriendlyError(err);
  }
}

/** List knowledge-base documents. */
export async function fetchDocuments() {
  if (USE_MOCK) {
    await wait(300);
    return knowledgeDocs;
  }
  try {
    const { data } = await client.get(requirePath("documents"));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw toFriendlyError(err);
  }
}

/** Upload a PDF/TXT document to the knowledge base. */
export async function uploadDocument(file) {
  if (USE_MOCK) {
    await wait(500);
    return { name: file.name, size: file.size, indexed: false };
  }
  try {
    const form = new FormData();
    form.append("file", file);
    const { data } = await client.post(requirePath("upload"), form);
    return data;
  } catch (err) {
    throw toFriendlyError(err);
  }
}
