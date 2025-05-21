const MERMAID_VERSION = "11.6.0";

export async function serve(mdd: string): Promise<Deno.HttpServer<Deno.NetAddr>> {
  const { promise, resolve } = Promise.withResolvers<void>();
  const server = Deno.serve({
    port: 0,
    onListen() {
      resolve();
    },
    handler(_req) {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
  </style>
  <title></title>
</head>
<body>
  <pre id="container" class="mermaid">
${mdd}
  </pre>
  <script type="module">
    import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.esm.min.mjs";
  </script>
</body>
</html>`,
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store",
          },
        },
      );
    },
  });
  await promise;
  return server;
}
