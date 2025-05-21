/// <reference lib="dom" />
import { launch } from "@astral/astral";
import { serve } from "./serve.ts";

export async function generate(mdd: string): Promise<string> {
  const server = await serve(mdd);
  const browser = await launch();
  const page = await browser.newPage(`http://localhost:${server.addr.port}/`);
  const svg = await page.$("#container > svg");
  if (!svg) {
    throw new Error("Diagram not found");
  }
  const diagram = await svg.evaluate((el: SVGSVGElement) => el.outerHTML);
  await browser.close();
  await server.shutdown();
  return diagram;
}
