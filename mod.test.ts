import { assertEquals } from "jsr:@std/assert/equals";

import { generate } from "./mod.ts";

const GUID_RE = /mermaid-[0-9]+/g;

Deno.test({
  name: "generate",
  async fn() {
    const mdd = "graph TD; A-->B;";
    const actual = await generate(mdd);
    const expected = await Deno.readTextFile("./_fixtures/simple.svg");
    assertEquals(actual.replace(GUID_RE, "mermaid-0"), expected.replace(GUID_RE, "mermaid-0"));
  },
});
