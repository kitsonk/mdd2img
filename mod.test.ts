import { assert } from "jsr:@std/assert/assert";

import { generate } from "./mod.ts";

Deno.test({
  name: "generate",
  async fn() {
    const mdd = `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
`;
    const actual = await generate(mdd);
    assert(actual.startsWith(`<svg aria-roledescription="mindmap" role="graphics-document document"`));
  },
});
