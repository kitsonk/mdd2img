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

## About

This library was inspired by [Mermaid.ink](https://mermaid.ink/) and meant as a easy way to render Mermaid diagrams.
While there has been an effort to "server side" render Mermaid diagrams, there is a huge amount of complexity as Mermaid
diagrams leverage such a wide spectrum of the web platform that would have to be replicated in a pure server side
limitation. All current solutions, including Mermaid.ink and the Mermaid CLI use some form of headless browser to
actually render the diagrams.

This library uses [Astral](https://jsr.io/@astral/astral) library to procedurally control a browser to render the
diagram and return the resulting image.

---

Copyright 2025 Kitson P. Kelly. All rights reserved. MIT License.
