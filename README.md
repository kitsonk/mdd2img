# @kitsonk/mdd2img

A [Mermaid diagram](https://mermaid.js.org/) to image library.

## Usage

Use the `generate()` function to convert Mermaid diagram markdown to an SVG:

```ts
import { generate } from "@kitsonk/mdd2img";

const mdd = `graph TD; A-->B;`;

const svg = await generate(mdd);
await Deno.writeFile("output.svg", svg);
```

---

Copyright 2025 Kitson P. Kelly. All rights reserved. MIT License.
