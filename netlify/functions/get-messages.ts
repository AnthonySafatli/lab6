import type { Handler, HandlerEvent } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export const handler: Handler = async (event: HandlerEvent) => {
  const cors = {
    "Access-Control-Allow-Origin": process.env.URL ?? "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: cors, body: "Method not allowed" };
  }

  // Simple password guard 
  const expected = process.env.MESSAGES_PASSWORD;
  if (!expected) {
    return { statusCode: 503, body: "Server not configured." };
  }

  const auth = event.headers["authorization"] ?? "";
  // Expects: Authorization: Bearer <password>
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (provided !== expected) {
    return {
      statusCode: 401,
      headers: { ...cors, "WWW-Authenticate": "Bearer" },
      body: JSON.stringify({ error: "Unauthorized" }),
    };
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

  // Newest first
  messages.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify(messages),
  };
};
