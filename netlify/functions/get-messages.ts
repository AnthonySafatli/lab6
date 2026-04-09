import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

// Handler
export default async (req: Request, context: Context) => {
  const cors = {
    "Access-Control-Allow-Origin": Netlify.env.get("URL") ?? "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  // Password guard
  const expected = Netlify.env.get("MESSAGES_PASSWORD");
  if (!expected) {
    return new Response("Server not configured.", { status: 503 });
  }

  const auth = req.headers.get("authorization") ?? "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (provided !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...cors, "WWW-Authenticate": "Bearer" },
    });
  }

  // Fetch all blobs
  const store = getStore("messages");
  const { blobs } = await store.list();

  const messages = await Promise.all(
    blobs.map(async ({ key }) => {
      const data = await store.get(key, { type: "json" });
      return { id: key, ...data };
    }),
  );

  messages.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/get-messages" };
