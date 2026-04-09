import { getDeployStore } from "@netlify/blobs";

// Sanitization
function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .slice(0, 2000);
}

// Validators
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALPHA_RE = /^[a-zA-Z\s\-\'&]+$/;
const LETTERS_RE = /^[a-zA-Z\s&]+$/;

function validate(body: Record<string, string>): string | null {
  if (!body.name || !ALPHA_RE.test(body.name)) return "Invalid name.";
  if (!body.email || !EMAIL_RE.test(body.email)) return "Invalid email.";
  if (!body.subject || !LETTERS_RE.test(body.subject))
    return "Invalid subject.";
  if (!body.message || body.message.length < 1) return "Message is required.";
  return null;
}

// Handler
export default async (req: Request) => {
  const cors = {
    "Access-Control-Allow-Origin": process.env.URL ?? "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: cors });
  }

  // ✅ Validate BEFORE sanitizing
  const rawTyped = {
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    subject: String(raw.subject ?? ""),
    message: String(raw.message ?? ""),
  };

  const error = validate(rawTyped);
  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 422,
      headers: cors,
    });
  }

  const sanitized = {
    name: sanitize(rawTyped.name),
    email: sanitize(rawTyped.email),
    subject: sanitize(rawTyped.subject),
    message: sanitize(rawTyped.message),
    date: new Date().toISOString(),
  };

  try {
    const store = getDeployStore("messages");
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    await store.setJSON(id, sanitized);

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 201,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Storage failed", { status: 500 });
  }
};
