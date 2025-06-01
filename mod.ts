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
 * await Deno.writeTextFile("output.svg", svg);
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

import { launch, type Page } from "@astral/astral";

import { FA_CDN } from "./consts.ts";
import { serve } from "./serve.ts";

/**
 * Options for generating an image from a Mermaid diagram string.
 */
export interface GenerateOptions {
  /**
   * The format of the generated image. Defaults to "svg".
   */
  format?: "svg" | "png" | "jpeg" | "webp";
}

async function generateSvg(page: Page): Promise<string> {
  await page.waitForNetworkIdle();
  await page.waitForSelector("#container > svg");
  return page.evaluate((faCDN: string) => {
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
}

async function generateImage(
  page: Page,
  format: "png" | "jpeg" | "webp",
): Promise<Uint8Array> {
  const svg = await page.waitForSelector("#container > svg");
  return svg.screenshot({
    format,
    quality: format !== "png" ? 90 : undefined,
  });
}

/**
 * Generate an image from a Mermaid diagram markdown string.
 *
 * @example Generate an PNG from a Mermaid diagram markdown string:
 *
 * ```ts
 * import { generate } from "@kitsonk/mdd2img";
 *
 * const mdd = `graph TD; A-->B;`;
 * const img = await generate(mdd, { format: "png" });
 * await Deno.writeFile("output.png", img);
 * ```
 *
 * @param mdd The Mermaid diagram markdown to convert to an image.
 * @returns
 */
export async function generate(
  mdd: string,
  options: GenerateOptions & { format: "png" | "jpeg" | "webp" },
): Promise<Uint8Array>;
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
 * await Deno.writeTextFile("output.svg", svg);
 * ```
 *
 * @param mdd The Mermaid diagram markdown to convert to an SVG.
 * @returns
 */
export async function generate(mdd: string, options?: GenerateOptions): Promise<string>;
export async function generate(mdd: string, options: GenerateOptions = {}): Promise<string | Uint8Array> {
  const { format = "svg" } = options;
  const server = await serve(mdd);
  const browser = await launch();
  const page = await browser.newPage(`http://localhost:${server.addr.port}/`);
  const diagram = format === "svg" ? await generateSvg(page) : await generateImage(page, format);
  await browser.close();
  await server.shutdown();
  return diagram;
}
