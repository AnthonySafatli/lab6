import { getDeployStore } from "@netlify/blobs";

export const handler = async () => {
  try {
    const store = getDeployStore("test");
    await store.set("hello", "world");

    return {
      statusCode: 200,
      body: "ok",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "error",
    };
  }
};
