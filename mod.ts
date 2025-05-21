/**
 * A [Mermaid diagram](https://mermaid.js.org/) to image library.
 *
 * ## Usage
 *
 * Use the `generate()` function to convert Mermaid diagram markdown to an SVG:
 *
 * ```ts
 * import { generate } from "@kitsonk/mdd2img";
 *
 * const mdd = `graph TD; A-->B;`;
 *
 * const svg = await generate(mdd);
 * await Deno.writeFile("output.svg", svg);
 * ```
 *
 * ## About
 *
 * This library was inspired by [Mermaid.ink](https://mermaid.ink/) and meant as a easy way to render Mermaid diagrams.
 * While there has been an effort to "server side" render Mermaid diagrams, there is a huge amount of complexity as Mermaid
 * diagrams leverage such a wide spectrum of the web platform that would have to be replicated in a pure server side
 * limitation. All current solutions, including Mermaid.ink and the Mermaid CLI use some form of headless browser to
 * actually render the diagrams.
 *
 * This library uses [Astral](https://jsr.io/@astral/astral) library to procedurally control a browser to render the
 * diagram and return the resulting image.
 *
 * @module
 */

import { launch } from "@astral/astral";
import { serve } from "./serve.ts";

const FA_VERSION = "6.7.2";
const FA_CDN = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${FA_VERSION}/css/all.min.css`;

/**
 * Generate an SVG from a Mermaid diagram markdown string.
 *
 * @example Generate an SVG from a Mermaid diagram markdown string:
 *
 * ```ts
 * import { generate } from "@kitsonk/mdd2img";
 *
 * const mdd = `graph TD; A-->B;`;
 * const svg = await generate(mdd);
 * await Deno.writeFile("output.svg", svg);
 * ```
 *
 * @param mdd The Mermaid diagram markdown to convert to an SVG.
 * @returns
 */
export async function generate(mdd: string): Promise<string> {
  const server = await serve(mdd);
  const browser = await launch();
  const page = await browser.newPage(`http://localhost:${server.addr.port}/`);
  await page.waitForSelector("#container > svg");
  const diagram = await page.evaluate((faCDN: string) => {
    const svgElement = document
      .querySelector("#container > svg")!
      .cloneNode(true) as SVGSVGElement;
    svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    const style = document.createElement("style");
    style.innerText = `@import url("${faCDN}");`;
    svgElement.prepend(style);
    const xmlSerializer = new XMLSerializer();
    return xmlSerializer.serializeToString(svgElement);
  }, { args: [FA_CDN] });
  await browser.close();
  await server.shutdown();
  return diagram;
}
