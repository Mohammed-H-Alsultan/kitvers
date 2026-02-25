import fs from "node:fs";
import path from "node:path";
import { PACKS, resolvePackOrder } from "./packsData.js";

// file system helpers

// find first existing file from a list of candidates
function findFile(dir, candidates) {
  for (const f of candidates) {
    const full = path.join(dir, f);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

// vite.config patcher

// finds vite.config.(ts|js|mts|mjs) in project root
function findViteConfig(targetDir) {
  return findFile(targetDir, [
    "vite.config.ts",
    "vite.config.mts",
    "vite.config.js",
    "vite.config.mjs",
  ]);
}

// patches vite.config to add a plugin import + usage
function patchViteConfig(targetDir, { importLine, pluginCall, log }) {
  const configFile = findViteConfig(targetDir);
  if (!configFile) throw new Error("vite.config not found in: " + targetDir);

  let src = read(configFile);

  if (src.includes(importLine)) {
    log(`› vite.config already has ${pluginCall}, skipping`);
    return;
  }

  // insert import after the last existing import line
  const lastImportIdx = src.lastIndexOf("\nimport ");
  const insertAt = src.indexOf("\n", lastImportIdx + 1); 
  src = src.slice(0, insertAt) + "\n" + importLine + src.slice(insertAt);

  // add plugin to plugins: [existingPlugin(), <newPlugin>]
  src = src.replace(/plugins:\s*\[([^\]]*)\]/s, (match, inner) => {
    const trimmed = inner.trim();
    // already there (double-guard)
    if (trimmed.includes(pluginCall)) return match;
    return `plugins: [${trimmed ? trimmed + ", " : ""}${pluginCall}]`;
  });

  write(configFile, src);
  log(`✓ patched ${path.basename(configFile)} with ${pluginCall}`);
}

// css file finder
// read src/main.(tsx|ts|jsx|js|vue) and extract the imported css filename
function findMainCssFile(targetDir) {
  const mainFile = findFile(path.join(targetDir, "src"), [
    "main.tsx",
    "main.ts",
    "main.jsx",
    "main.js",
  ]);

  // throw error if file is not found
  if (!mainFile) throw new Error("src/main.* not found in: " + targetDir);

  const src = read(mainFile);

  // match: import './index.css'  or  import "./style.css" etc.
  const match = src.match(
    /import\s+(?:[^'"]+\s+from\s+)?['"](\.\/[^'"]+\.css)['"]/,
  );
  if (!match) throw new Error("No css import found in " + mainFile);

  // resolve relative to src/
  return path.join(targetDir, "src", match[1].replace("./", ""));
}

function ensureCssLine(cssFile, line, { after } = {}, log) {
  let src = read(cssFile);

  if (src.includes(line)) {
    log(`› css already has "${line}", skipping`);
    return;
  }

  if (after && src.includes(after)) {
    src = src.replace(after, `${after}\n${line}`);
  } else {
    src = `${line}\n${src}`;
  }

  write(cssFile, src);
  log(`✓ added "${line}" to ${path.basename(cssFile)}`);
}

// pack appliers
const APPLIERS = {
  // tailwind (react)
  tailwind: ({ targetDir, log }) => {
    // 1. patch vite.config
    patchViteConfig(targetDir, {
      importLine: 'import tailwindcss from "@tailwindcss/vite"',
      pluginCall: "tailwindcss()",
      log,
    });

    // 2. prepend @import to main css
    const cssFile = findMainCssFile(targetDir);
    ensureCssLine(cssFile, '@import "tailwindcss";', {}, log);
  },

  // tailwind (vue) — same steps
  "tailwind-vue": ({ targetDir, log }) => {
    patchViteConfig(targetDir, {
      importLine: 'import tailwindcss from "@tailwindcss/vite"',
      pluginCall: "tailwindcss()",
      log,
    });

    const cssFile = findMainCssFile(targetDir);
    ensureCssLine(cssFile, '@import "tailwindcss";', {}, log);
  },

  // daisyui (react)
  daisyui: ({ targetDir, log }) => {
    const cssFile = findMainCssFile(targetDir);
    ensureCssLine(
      cssFile,
      '@plugin "daisyui";',
      { after: '@import "tailwindcss";' },
      log,
    );
  },

  // daisyui (vue) same
  "daisyui-vue": ({ targetDir, log }) => {
    const cssFile = findMainCssFile(targetDir);
    ensureCssLine(
      cssFile,
      '@plugin "daisyui";',
      { after: '@import "tailwindcss";' },
      log,
    );
  },
};

// public API
export async function applyPacks(payload, { log = console.log } = {}) {
  const { packs = [], targetDir } = payload;

  if (!targetDir) throw new Error("applyPacks: missing targetDir");

  const selectedIds = Array.from(packs);

  if (selectedIds.length === 0) {
    log("› no packs to apply, skipping");
    return;
  }

  // respect requires[] order — same order as install
  const ordered = resolvePackOrder(selectedIds);

  // only run appliers that exist for selected packs
  const toApply = ordered.filter((id) => APPLIERS[id]);

  if (toApply.length === 0) {
    log("› no config patches needed for selected packs");
    return;
  }

  log(`› applying config for: ${toApply.join(", ")}`);

  for (const id of toApply) {
    log(`› applying [${id}]`);
    await APPLIERS[id]({ targetDir, log });
    log(`✓ [${id}] applied`);
  }

  log("✓ all pack configs applied");
}
