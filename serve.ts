/**
 * This module provides a function to serve a Mermaid diagram markdown string
 * on a local server. It uses the Deno standard library to create an HTTP server
 * and serves an HTML page that includes the Mermaid diagram.
 *
 * @module
 */

const MERMAID_VERSION = "11.6.0";
const MERMAID_CDN = `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.esm.min.mjs`;

/**
 * Host a Mermaid diagram markdown string on a local server.
 */
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
  <title></title>
</head>
<body>
  <pre id="container" class="mermaid">
${mdd}
  </pre>
  <script type="module">
    import mermaid from "${MERMAID_CDN}";
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
