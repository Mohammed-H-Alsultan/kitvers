import fs from "node:fs";
import path from "node:path";
import { runCmd } from "./runner.js";
import { PACKS, resolvePackOrder } from "./packsData.js";

// ── pm helpers ───────────────────────────────────────────────────────────────

function pmBin(pm) {
  const isWin = process.platform === "win32";
  const bins = {
    npm: isWin ? "npm.cmd" : "npm",
    pnpm: isWin ? "pnpm.cmd" : "pnpm",
    yarn: isWin ? "yarn.cmd" : "yarn",
    bun: isWin ? "bun.cmd" : "bun",
  };
  return bins[pm] ?? bins.npm;
}

function dlxBin(pm) {
  const isWin = process.platform === "win32";
  const bins = {
    npm: isWin ? "npx.cmd" : "npx",
    pnpm: isWin ? "pnpm.cmd" : "pnpm",
    yarn: isWin ? "yarn.cmd" : "yarn",
    bun: isWin ? "bunx.cmd" : "bunx",
  };
  return bins[pm] ?? bins.npm;
}

// pnpm/yarn need "dlx" prepended; npx/bunx take args directly
function dlxArgs(pm, cmdString) {
  const parts = cmdString.trim().split(/\s+/);
  if (pm === "pnpm" || pm === "yarn") return ["dlx", ...parts];
  return parts;
}

function addArgs(pm, pkgs, dev = false) {
  if (pm === "npm")
    return dev ? ["install", "-D", ...pkgs] : ["install", ...pkgs];
  if (pm === "pnpm") return dev ? ["add", "-D", ...pkgs] : ["add", ...pkgs];
  if (pm === "yarn") return dev ? ["add", "-D", ...pkgs] : ["add", ...pkgs];
  if (pm === "bun") return dev ? ["add", "-d", ...pkgs] : ["add", ...pkgs];
  return ["install", ...pkgs];
}

// ── shadcn option normalization + validation ─────────────────────────────────

const SHADCN_DEFAULTS = {
  cliVersion: "latest",
  baseColor: "neutral",
  cssVariables: true,
  srcDir: true,
  noBaseStyle: false,
  components: [],
};

const VALID_BASE_COLORS = ["neutral", "gray", "zinc", "stone", "slate"];

// validates + fills defaults for packOptions.shadcn
// warns on bad values and falls back — never throws
function normalizeShadcnOptions(raw = {}, log) {
  const o = { ...SHADCN_DEFAULTS };

  // cliVersion — string, used to pin exact CLI version
  if (raw.cliVersion !== undefined) {
    if (typeof raw.cliVersion === "string" && raw.cliVersion.trim()) {
      o.cliVersion = raw.cliVersion.trim();
    } else {
      log(
        `⚠ shadcn: invalid cliVersion, falling back to "${SHADCN_DEFAULTS.cliVersion}"`,
      );
    }
  }

  // baseColor — must be one of the allowed values
  if (raw.baseColor !== undefined) {
    if (VALID_BASE_COLORS.includes(raw.baseColor)) {
      o.baseColor = raw.baseColor;
    } else {
      log(
        `⚠ shadcn: invalid baseColor "${raw.baseColor}", valid: ${VALID_BASE_COLORS.join(", ")}. falling back to "${SHADCN_DEFAULTS.baseColor}"`,
      );
    }
  }

  // booleans — warn on wrong type, fall back to default
  for (const key of ["cssVariables", "srcDir", "noBaseStyle"]) {
    if (raw[key] !== undefined) {
      if (typeof raw[key] === "boolean") {
        o[key] = raw[key];
      } else {
        log(
          `⚠ shadcn: "${key}" must be a boolean, got ${typeof raw[key]}. falling back to ${SHADCN_DEFAULTS[key]}`,
        );
      }
    }
  }

  // components — one pass: classify valid/invalid to avoid includes() mismatch after trim
  if (raw.components !== undefined) {
    if (!Array.isArray(raw.components)) {
      log(
        `⚠ shadcn: "components" must be an array. falling back to empty list`,
      );
    } else {
      const valid = [];
      const invalid = [];

      for (const c of raw.components) {
        if (typeof c === "string" && c.trim()) valid.push(c.trim());
        else invalid.push(c);
      }

      if (invalid.length > 0) {
        log(
          `⚠ shadcn: stripped invalid component entries: ${JSON.stringify(invalid)}`,
        );
      }

      o.components = valid;
    }
  }

  return o;
}

// ── shadcn command builders ──────────────────────────────────────────────────

// builds fully non-interactive shadcn init args from normalized options
function buildShadcnInitArgs(opts) {
  const ver = opts.cliVersion ?? "latest";
  const cssVars = opts.cssVariables ? "--css-variables" : "--no-css-variables";
  const srcDir = opts.srcDir ? "--src-dir" : "--no-src-dir";

  const parts = [
    `shadcn@${ver}`,
    "init",
    "--yes",
    "--template",
    "vite",
    "--base-color",
    opts.baseColor,
    cssVars,
    srcDir,
  ];

  if (opts.noBaseStyle) parts.push("--no-base-style");

  return parts;
}

// builds shadcn add args from normalized opts — null if no components
function buildShadcnAddArgs(opts) {
  if (!opts.components?.length) return null;
  const ver = opts.cliVersion ?? "latest";
  return [`shadcn@${ver}`, "add", "--yes", ...opts.components];
}

// ── idempotency helpers ──────────────────────────────────────────────────────

// true if shadcn init has already run in this project
function shadcnInitialized(targetDir) {
  return fs.existsSync(path.join(targetDir, "components.json"));
}

// ── shadcn-vue config writer ─────────────────────────────────────────────────

function detectCssFile(targetDir) {
  const candidates = ["main.tsx", "main.ts", "main.jsx", "main.js"];
  for (const f of candidates) {
    const full = path.join(targetDir, "src", f);
    if (!fs.existsSync(full)) continue;
    const content = fs.readFileSync(full, "utf8");
    // same regex as apply-packs.js findMainCssFile
    const match = content.match(
      /import\s+(?:[^'"]+\s+from\s+)?['"](\.\/[^'"]+\.css)['"]/,
    );
    if (match) return `src/${match[1].replace("./", "")}`;
  }
  return "src/style.css";
}

// writes components.json for shadcn-vue, bypassing interactive init entirely
function writeShadcnVueConfig(targetDir, opts, log) {
  // TS project = has tsconfig.json AND a main.ts entrypoint
  const isTS =
    fs.existsSync(path.join(targetDir, "tsconfig.json")) &&
    fs.existsSync(path.join(targetDir, "src", "main.ts"));

  // detectCssFile already returns "src/style.css" format
  const cssFile = detectCssFile(targetDir);

  const config = {
    $schema: "https://shadcn-vue.com/schema.json",
    style: "new-york",
    typescript: isTS,
    tailwind: {
      config: "",
      css: cssFile,
      baseColor: opts.baseColor ?? "neutral",
      cssVariables: opts.cssVariables ?? true,
      prefix: "",
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      composables: "@/composables",
    },
  };

  fs.writeFileSync(
    path.join(targetDir, "components.json"),
    JSON.stringify(config, null, 2) + "\n",
    "utf8",
  );

  log(
    `✓ [shadcn-vue] wrote components.json (baseColor: ${config.tailwind.baseColor}, css: ${cssFile})`,
  );
}

// ── log cleaner ──────────────────────────────────────────────────────────────

// normalises noisy CLI output into clean › / ✓ / ✗ lines
function logCliLine(line, log) {
  const s = String(line ?? "").trim();
  if (!s) return;

  if (s.startsWith("✔") || s.startsWith("✓")) {
    log(`✓ ${s.replace(/^[✔✓]\s*/, "")}`);
    return;
  }
  if (s.startsWith("✖") || s.startsWith("✗")) {
    log(`✗ ${s.replace(/^[✖✗]\s*/, "")}`);
    return;
  }

  const low = s.toLowerCase();
  if (low.includes("error") || low.includes("failed")) {
    log(`✗ ${s}`);
    return;
  }

  log(`› ${s}`);
}

// ── phase 1: install deps + devDeps only (no commands) ──────────────────────

export async function installPacks(payload, { log = console.log } = {}) {
  const { packs = [], packageManager = "npm", framework, targetDir } = payload;

  if (!targetDir) throw new Error("Missing targetDir for pack install");

  const selectedIds = Array.from(packs);
  if (selectedIds.length === 0) {
    log("› no packs selected, skipping");
    return;
  }

  const byId = new Map(PACKS.map((p) => [p.id, p]));

  // validate: pack exists + supports framework
  for (const id of selectedIds) {
    const p = byId.get(id);
    if (!p) throw new Error(`Unknown pack: "${id}"`);
    if (Array.isArray(p.frameworks) && !p.frameworks.includes(framework)) {
      throw new Error(`Pack "${id}" does not support framework "${framework}"`);
    }
  }

  const ordered = resolvePackOrder(selectedIds);
  log(`› pack order: ${ordered.join(" → ")}`);

  // collect all deps + devDeps (commands are intentionally skipped here)
  const deps = new Set();
  const devDeps = new Set();

  for (const id of ordered) {
    const { install = {} } = byId.get(id);
    for (const d of install.deps ?? []) deps.add(d);
    for (const d of install.devDeps ?? []) devDeps.add(d);
  }

  const pm = packageManager;

  if (deps.size > 0) {
    log(`› adding ${deps.size} dep(s): ${[...deps].join(", ")}`);
    await runCmd(pmBin(pm), addArgs(pm, [...deps], false), {
      cwd: targetDir,
      onLine: (l) => log(`› ${l}`),
      onErrorLine: (l) => log(`✗ ${l}`),
    });
    log("✓ deps done");
  }

  if (devDeps.size > 0) {
    log(`› adding ${devDeps.size} devDep(s): ${[...devDeps].join(", ")}`);
    await runCmd(pmBin(pm), addArgs(pm, [...devDeps], true), {
      cwd: targetDir,
      onLine: (l) => log(`› ${l}`),
      onErrorLine: (l) => log(`✗ ${l}`),
    });
    log("✓ devDeps done");
  }

  log("✓ pack deps installed");
}

// ── phase 2: run dlx/shell commands (after config is patched) ───────────────

export async function runPackCommands(payload, { log = console.log } = {}) {
  const { packs = [], packageManager = "npm", targetDir } = payload;

  if (!targetDir) throw new Error("Missing targetDir for pack commands");

  const selectedIds = Array.from(packs);
  if (selectedIds.length === 0) {
    log("› no pack commands to run");
    return;
  }

  const byId = new Map(PACKS.map((p) => [p.id, p]));
  const ordered = resolvePackOrder(selectedIds);
  const pm = packageManager;

  // collect commands in topo order
  const commands = [];
  for (const id of ordered) {
    const { install = {} } = byId.get(id);
    for (const c of install.commands ?? []) {
      if (c.kind === "dlx" || c.kind === "shell") {
        commands.push({ packId: id, ...c });
      }
    }
  }

  if (commands.length === 0) {
    log("› no dlx/shell commands for selected packs");
    return;
  }

  log(`› running ${commands.length} pack command(s)`);

  for (const { packId, kind, cmd } of commands) {
    // ── shadcn init + add ────────────────────────────────────────────────────
    if (
      packId === "shadcn" &&
      kind === "dlx" &&
      cmd.startsWith("shadcn@latest init")
    ) {
      // normalize + validate — warns on bad values, fills defaults, never throws
      const opts = normalizeShadcnOptions(payload.packOptions?.shadcn, log);
      log(`› [shadcn] resolved options: ${JSON.stringify(opts)}`);

      // idempotency: components.json already exists → shadcn was already initialized
      if (shadcnInitialized(targetDir)) {
        log("› [shadcn] components.json exists, skipping init");
      } else {
        const initArgs = buildShadcnInitArgs(opts);
        log(`› [shadcn] init: npx ${initArgs.join(" ")}`);

        await runCmd(dlxBin(pm), dlxArgs(pm, initArgs.join(" ")), {
          cwd: targetDir,
          onLine: (l) => logCliLine(l, log),
          onErrorLine: (l) => logCliLine(l, log),
        });

        log("✓ [shadcn] init done");
      }

      if (opts.components.length > 0) {
        log(`› [shadcn] adding: ${opts.components.join(", ")}`);
        const addArgs_ = buildShadcnAddArgs(opts);
        await runCmd(dlxBin(pm), dlxArgs(pm, addArgs_.join(" ")), {
          cwd: targetDir,
          onLine: (l) => logCliLine(l, log),
          onErrorLine: (l) => logCliLine(l, log),
        });
        log("✓ [shadcn] components done");
      } else {
        log("› [shadcn] no components selected, skipping add");
      }

      continue;
    }

    // ── shadcn-vue ───────────────────────────────────────────────────────────
    // skip interactive init entirely — write components.json ourselves,
    if (
      packId === "shadcn-vue" &&
      kind === "dlx" &&
      cmd.startsWith("shadcn-vue@latest init")
    ) {
      const vueOpts = payload.packOptions?.["shadcn-vue"] ?? {};
      const ver = (vueOpts.cliVersion ?? "latest").trim() || "latest";

      if (shadcnInitialized(targetDir)) {
        log("› [shadcn-vue] components.json exists, skipping config write");
      } else {
        // write components.json directly — no interactive prompts
        writeShadcnVueConfig(targetDir, vueOpts, log);
      }

      // pass all components to CLI, it handles existing files gracefully
      const requested = Array.isArray(vueOpts.components)
        ? vueOpts.components.filter((c) => typeof c === "string" && c.trim())
        : [];

      if (requested.length > 0) {
        log(`› [shadcn-vue] adding: ${requested.join(", ")}`);
        await runCmd(
          dlxBin(pm),
          dlxArgs(pm, `shadcn-vue@${ver} add --yes ${requested.join(" ")}`),
          {
            cwd: targetDir,
            onLine: (l) => logCliLine(l, log),
            onErrorLine: (l) => logCliLine(l, log),
          },
        );
        log("✓ [shadcn-vue] components done");
      } else {
        log("› [shadcn-vue] no components selected, skipping add");
      }

      continue;
    }

    // ── generic dlx ─────────────────────────────────────────────────────────
    if (kind === "dlx") {
      log(`› [${packId}] dlx: ${cmd}`);
      await runCmd(dlxBin(pm), dlxArgs(pm, cmd), {
        cwd: targetDir,
        onLine: (l) => logCliLine(l, log),
        onErrorLine: (l) => logCliLine(l, log),
      });
      log(`✓ [${packId}] done`);
    }

    // ── generic shell ────────────────────────────────────────────────────────
    if (kind === "shell") {
      log(`› [${packId}] shell: ${cmd}`);
      const isWin = process.platform === "win32";
      await runCmd(isWin ? "cmd" : "sh", isWin ? ["/c", cmd] : ["-c", cmd], {
        cwd: targetDir,
        onLine: (l) => logCliLine(l, log),
        onErrorLine: (l) => logCliLine(l, log),
      });
      log(`✓ [${packId}] shell done`);
    }
  }

  log("✓ all pack commands done");
}
