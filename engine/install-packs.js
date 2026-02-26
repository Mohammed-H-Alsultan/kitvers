import { runCmd } from "./runner.js";
import { PACKS, resolvePackOrder } from "./packsData.js";

// ── pm helpers ───────────────────────────────────────────────────────────────

// binary name per pm (windows needs .cmd)
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

// dlx binary per pm
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

// build npm install / pnpm add / yarn add / bun add args
function addArgs(pm, pkgs, dev = false) {
  if (pm === "npm")
    return dev ? ["install", "-D", ...pkgs] : ["install", ...pkgs];
  if (pm === "pnpm") return dev ? ["add", "-D", ...pkgs] : ["add", ...pkgs];
  if (pm === "yarn") return dev ? ["add", "-D", ...pkgs] : ["add", ...pkgs];
  if (pm === "bun") return dev ? ["add", "-d", ...pkgs] : ["add", ...pkgs];
  return ["install", ...pkgs];
}

// ── shadcn helpers ───────────────────────────────────────────────────────────

// builds a fully non-interactive shadcn init command from packOptions
function buildShadcnInitArgs(payload) {
  const o = payload.packOptions?.shadcn ?? {};

  const baseColor = o.baseColor ?? "neutral";
  const cssVars =
    o.cssVariables === false ? "--no-css-variables" : "--css-variables";
  const srcDir = o.srcDir === false ? "--no-src-dir" : "--src-dir";
  const baseStyle = o.noBaseStyle === true ? "--no-base-style" : "";
  const parts = [
    "shadcn@latest",
    "init",
    "--yes",
    "--template",
    "vite",
    "--base-color",
    baseColor,
    cssVars,
    srcDir,
  ];

  if (baseStyle) parts.push(baseStyle);

  return parts.filter(Boolean);
}

// builds shadcn add <component...> args — non-interactive with --yes
function buildShadcnAddArgs(components) {
  if (!Array.isArray(components) || components.length === 0) return null;
  return ["shadcn@latest", "add", "--yes", ...components];
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
    // ── shadcn init ──────────────────────────────────────────────────────────
    if (
      packId === "shadcn" &&
      kind === "dlx" &&
      cmd.startsWith("shadcn@latest init")
    ) {
      log("› [shadcn] running non-interactive init");

      const initArgs = buildShadcnInitArgs(payload);
      log(`› npx ${initArgs.join(" ")}`);

      await runCmd(dlxBin(pm), dlxArgs(pm, initArgs.join(" ")), {
        cwd: targetDir,
        onLine: (l) => logCliLine(l, log),
        onErrorLine: (l) => logCliLine(l, log),
      });

      log("✓ [shadcn] init done");

      // run shadcn add for any pre-selected components
      const components = payload.packOptions?.shadcn?.components ?? [];
      const addArgsList = buildShadcnAddArgs(components);

      if (addArgsList) {
        log(`› [shadcn] adding components: ${components.join(", ")}`);

        await runCmd(dlxBin(pm), dlxArgs(pm, addArgsList.join(" ")), {
          cwd: targetDir,
          onLine: (l) => logCliLine(l, log),
          onErrorLine: (l) => logCliLine(l, log),
        });

        log(`✓ [shadcn] components added`);
      } else {
        log("› [shadcn] no components selected, skipping add");
      }

      continue;
    }

    // ── shadcn-vue init ──────────────────────────────────────────────────────
    if (
      packId === "shadcn-vue" &&
      kind === "dlx" &&
      cmd.startsWith("shadcn-vue@latest init")
    ) {
      log("› [shadcn-vue] running non-interactive init");

      // shadcn-vue supports --yes to skip prompts
      await runCmd(dlxBin(pm), dlxArgs(pm, "shadcn-vue@latest init --yes"), {
        cwd: targetDir,
        onLine: (l) => logCliLine(l, log),
        onErrorLine: (l) => logCliLine(l, log),
      });

      log("✓ [shadcn-vue] init done");

      // add any pre-selected components
      const components = payload.packOptions?.["shadcn-vue"]?.components ?? [];
      if (components.length > 0) {
        log(`› [shadcn-vue] adding components: ${components.join(", ")}`);
        const addCmd = `shadcn-vue@latest add --yes ${components.join(" ")}`;

        await runCmd(dlxBin(pm), dlxArgs(pm, addCmd), {
          cwd: targetDir,
          onLine: (l) => logCliLine(l, log),
          onErrorLine: (l) => logCliLine(l, log),
        });

        log("✓ [shadcn-vue] components added");
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
