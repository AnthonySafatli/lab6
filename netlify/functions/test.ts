import { getDeployStore } from "@netlify/blobs";

export default async (req: Request, context: any) => {
  try {
    const store = getDeployStore("test");

    await store.setJSON("hello", { msg: "world" });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("error", { status: 500 });
  }
};
