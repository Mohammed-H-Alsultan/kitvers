import fs from "node:fs";
import path from "node:path";
import { resolvePackOrder } from "./packsData.js";

// ── fs helpers ───────────────────────────────────────────────────────────────

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
function write(file, data) {
  fs.writeFileSync(file, data, "utf8");
}
function readJson(file) {
  return JSON.parse(read(file));
}
function writeJson(file, o) {
  write(file, JSON.stringify(o, null, 2) + "\n");
}

// ── vite.config patcher ──────────────────────────────────────────────────────

function findViteConfig(targetDir) {
  return findFile(targetDir, [
    "vite.config.ts",
    "vite.config.mts",
    "vite.config.js",
    "vite.config.mjs",
  ]);
}

// adds an import + plugin call to vite.config, idempotent
function patchViteConfig(targetDir, { importLine, pluginCall, log }) {
  const configFile = findViteConfig(targetDir);
  if (!configFile) throw new Error("vite.config not found in: " + targetDir);

  let src = read(configFile);
  let changed = false;

  // quote-agnostic detection key
  const importKey =
    importLine.match(/from\s+['"]([^'"]+)['"]/)?.[1] ?? importLine;

  // 1) insert import after last existing import line
  if (!src.includes(importKey)) {
    const imports = [...src.matchAll(/^import .*$/gm)];
    if (imports.length) {
      const last = imports.at(-1);
      const insertAt = last.index + last[0].length;
      src = src.slice(0, insertAt) + "\n" + importLine + src.slice(insertAt);
    } else {
      src = importLine + "\n" + src;
    }
    changed = true;
  }

  // 2) add plugin to plugins array
  if (!src.includes(pluginCall)) {
    const before = src;

    src = src.replace(/plugins:\s*\[([\s\S]*?)\]/m, (match, inner) => {
      if (inner.includes(pluginCall)) return match;
      const trimmed = inner.trim();
      return `plugins: [${trimmed ? trimmed + ", " : ""}${pluginCall}]`;
    });

    // fallback: no plugins array yet
    if (src === before) {
      src = src.replace(
        /defineConfig\(\s*\{/m,
        (m) => `${m}\n  plugins: [${pluginCall}],`,
      );
    }

    changed = true;
  }

  if (!src.includes(pluginCall)) {
    throw new Error(
      `Failed to inject "${pluginCall}" into ${path.basename(configFile)}`,
    );
  }

  if (changed) {
    write(configFile, src);
    log(`✓ patched ${path.basename(configFile)} → ${pluginCall}`);
  } else {
    log(`› ${path.basename(configFile)} already has ${pluginCall}, skipping`);
  }
}

function patchViteAlias(targetDir, { aliasKey, aliasValue, log }) {
  const configFile = findViteConfig(targetDir);
  if (!configFile) throw new Error("vite.config not found in: " + targetDir);

  let src = read(configFile);

  // already patched
  if (src.includes(`"${aliasKey}"`) || src.includes(`'${aliasKey}'`)) {
    log(`› vite.config already has "${aliasKey}" alias, skipping`);
    return;
  }

  // inject: import path from "path" after the last existing import
  if (!src.includes('from "path"') && !src.includes("from 'path'")) {
    const imports = [...src.matchAll(/^import .*$/gm)];
    if (imports.length) {
      const last = imports.at(-1);
      const insertAt = last.index + last[0].length;
      src =
        src.slice(0, insertAt) +
        '\nimport path from "path"' +
        src.slice(insertAt);
    } else {
      src = 'import path from "path"\n' + src;
    }
  }

  const aliasBlock = [
    `resolve: {`,
    `    alias: {`,
    `      "${aliasKey}": path.resolve(__dirname, "${aliasValue}"),`,
    `    },`,
    `  },`,
  ].join("\n");

  src = src.replace(/defineConfig\(\s*\{/m, (m) => `${m}\n  ${aliasBlock}`);

  write(configFile, src);
  log(`✓ patched vite.config with "${aliasKey}" alias`);
}

// ── css patcher ──────────────────────────────────────────────────────────────

function findMainCssFile(targetDir) {
  const mainFile = findFile(path.join(targetDir, "src"), [
    "main.tsx",
    "main.ts",
    "main.jsx",
    "main.js",
  ]);
  if (!mainFile) throw new Error("src/main.* not found in: " + targetDir);

  const src = read(mainFile);
  const match = src.match(
    /import\s+(?:[^'"]+\s+from\s+)?['"](\.\/[^'"]+\.css)['"]/,
  );
  if (!match) throw new Error("No css import found in " + mainFile);

  return path.join(targetDir, "src", match[1].replace("./", ""));
}

// adds a css directive line, idempotent, optionally after a sibling line
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

// ── tsconfig patcher ─────────────────────────────────────────────────────────

function ensureTsconfigAlias(targetDir, log) {
  const rootConfig = path.join(targetDir, "tsconfig.json");
  const jsConfig = path.join(targetDir, "jsconfig.json");

  if (fs.existsSync(rootConfig)) {
    // always patch tsconfig.json 
    patchTsconfig(rootConfig, log);
    return;
  }

  // JS project has jsconfig.json
  let cfg = fs.existsSync(jsConfig) ? readJson(jsConfig) : {};
  cfg.compilerOptions ??= {};
  cfg.compilerOptions.baseUrl ??= ".";
  cfg.compilerOptions.paths ??= {};

  if (cfg.compilerOptions.paths["@/*"]) {
    log('› jsconfig.json already has "@/*" alias, skipping');
    return;
  }

  cfg.compilerOptions.paths["@/*"] = ["./src/*"];
  writeJson(jsConfig, cfg);
  log("✓ ensured jsconfig.json with @/* alias");
}

function patchTsconfig(file, log) {
  const raw = read(file)
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  const cfg = JSON.parse(raw);

  cfg.compilerOptions ??= {};
  cfg.compilerOptions.baseUrl ??= ".";
  cfg.compilerOptions.paths ??= {};

  if (cfg.compilerOptions.paths["@/*"]) {
    log(`› ${path.basename(file)} already has "@/*" alias, skipping`);
    return;
  }

  cfg.compilerOptions.paths["@/*"] = ["./src/*"];
  writeJson(file, cfg);
  log(`✓ patched ${path.basename(file)} with @/* alias`);
}

// ── pack APPLIERS ─────────────────────────────────────────────────────────────

const APPLIERS = {
  // tailwind (react)
  tailwind: ({ targetDir, log }) => {
    patchViteConfig(targetDir, {
      importLine: 'import tailwindcss from "@tailwindcss/vite"',
      pluginCall: "tailwindcss()",
      log,
    });
    const cssFile = findMainCssFile(targetDir);
    ensureCssLine(cssFile, '@import "tailwindcss";', {}, log);
  },

  // tailwind (vue) — same
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

  // daisyui (vue)
  "daisyui-vue": ({ targetDir, log }) => {
    const cssFile = findMainCssFile(targetDir);
    ensureCssLine(
      cssFile,
      '@plugin "daisyui";',
      { after: '@import "tailwindcss";' },
      log,
    );
  },

  // shadcn (react)
  shadcn: ({ targetDir, log }) => {
    ensureTsconfigAlias(targetDir, log);
    patchViteAlias(targetDir, { aliasKey: "@", aliasValue: "./src", log });
  },

  // shadcn (vue) — same
  "shadcn-vue": ({ targetDir, log }) => {
    ensureTsconfigAlias(targetDir, log);
    patchViteAlias(targetDir, { aliasKey: "@", aliasValue: "./src", log });
  },
};

// ── public API ───────────────────────────────────────────────────────────────

export async function applyPacks(payload, { log = console.log } = {}) {
  const { packs = [], targetDir } = payload;

  if (!targetDir) throw new Error("applyPacks: missing targetDir");

  const selectedIds = Array.from(packs);
  if (selectedIds.length === 0) {
    log("› no packs to apply, skipping");
    return;
  }

  const ordered = resolvePackOrder(selectedIds);
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
