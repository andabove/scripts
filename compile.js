import { resolve } from "pathe";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

async function run() {
  const webflowScripts = resolve(fileURLToPath(import.meta.url), "./webflow");

  const examples = await fs.readdir(webflowScripts);
}

run();
