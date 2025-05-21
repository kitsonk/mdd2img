import { serve } from "./serve.ts";

Deno.test({
  name: "serve",
  async fn() {
    const server = await serve("graph TD; A-->B;");
    const addr = server.addr as Deno.NetAddr;
    const url = `http://${addr.hostname}:${addr.port}/`;
    const res = await fetch(url);
    const text = await res.text();
    if (!text.includes("graph TD; A-->B;")) {
      throw new Error("Response does not contain the expected mermaid diagram");
    }
    return server.shutdown();
  },
});
