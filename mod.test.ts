// deno-lint-ignore-file no-import-prefix
import { assert } from "jsr:@std/assert@1/assert";
import { timingSafeEqual } from "jsr:@std/crypto@1/timing-safe-equal";

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
    assert(actual.startsWith(`<svg id="mermaid-`));
  },
});

Deno.test({
  name: "generate: format=svg",
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
    const actual = await generate(mdd, { format: "svg" });
    assert(actual.startsWith(`<svg id="mermaid-`));
  },
});

Deno.test({
  name: "generate: format=png",
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
    const actual = await generate(mdd, { format: "png" });
    assert(timingSafeEqual(actual.slice(0, 8), new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])));
  },
});

Deno.test({
  name: "generate: format=jpeg",
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
    const actual = await generate(mdd, { format: "jpeg" });
    assert(timingSafeEqual(actual.slice(0, 2), new Uint8Array([255, 216])));
  },
});

Deno.test({
  name: "generate: format=webp",
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
    const actual = await generate(mdd, { format: "webp" });
    assert(timingSafeEqual(actual.slice(8, 12), new Uint8Array([87, 69, 66, 80])));
  },
});
