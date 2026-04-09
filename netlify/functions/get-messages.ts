import type { Handler, HandlerEvent } from "@netlify/functions";
import { getDeployStore } from "@netlify/blobs";

// Sanitization (server-side, belt-and-suspenders)
function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .slice(0, 2000); // hard cap
}

// Validators
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALPHA_RE = /^[a-zA-Z\s\-'&amp;]+$/;
const LETTERS_RE = /^[a-zA-Z\s&amp;]+$/;

function validate(body: Record<string, string>): string | null {
  if (!body.name || !ALPHA_RE.test(body.name)) return "Invalid name.";
  if (!body.email || !EMAIL_RE.test(body.email)) return "Invalid email.";
  if (!body.subject || !LETTERS_RE.test(body.subject))
    return "Invalid subject.";
  if (!body.message || body.message.length < 1) return "Message is required.";
  return null;
}

// Handler
export const handler: Handler = async (event: HandlerEvent) => {
  const cors = {
    "Access-Control-Allow-Origin": process.env.URL ?? "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method not allowed" };
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, headers: cors, body: "Invalid JSON" };
  }

  const sanitized = {
    name: sanitize(raw.name),
    email: sanitize(raw.email),
    subject: sanitize(raw.subject),
    message: sanitize(raw.message),
    date: new Date().toISOString(),
  };

  const error = validate(sanitized);
  if (error) {
    return { statusCode: 422, headers: cors, body: JSON.stringify({ error }) };
  }

  const store = getDeployStore("messages");
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await store.setJSON(id, sanitized);

  return {
    statusCode: 201,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, id }),
  };
};
