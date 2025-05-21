import { assert } from "jsr:@std/assert/assert";

import { generate } from "./mod.ts";

Deno.test({
  name: "generate",
  async fn() {
    const mdd = "graph TD; A-->B;";
    const actual = await generate(mdd);
    assert(actual.startsWith(`<svg aria-roledescription="flowchart-v2" role="graphics-document document"`));
  },
});
