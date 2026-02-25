import { runCmd } from "./runner.js";
import { PACKS, resolvePackOrder } from "./packsData.js";

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

// build args for dlx call — pnpm/yarn need "dlx" prepended
function dlxArgs(pm, cmdString) {
  const parts = cmdString.trim().split(/\s+/);
  if (pm === "pnpm" || pm === "yarn") return ["dlx", ...parts];
  return parts; // npx / bunx take the cmd directly
}

// build add/addDev args per pm
function addArgs(pm, pkgs, dev = false) {
  if (pm === "npm")
    return dev ? ["install", "-D", ...pkgs] : ["install", ...pkgs];
  if (pm === "pnpm") return dev ? ["add", "-D", ...pkgs] : ["add", ...pkgs];
  if (pm === "yarn") return dev ? ["add", "-D", ...pkgs] : ["add", ...pkgs];
  if (pm === "bun") return dev ? ["add", "-d", ...pkgs] : ["add", ...pkgs];
  return ["install", ...pkgs]; // fallback npm
}

export async function installPacks(payload, { log = console.log } = {}) {
  const { packs = [], packageManager = "npm", framework, targetDir } = payload;

  if (!targetDir) throw new Error("Missing targetDir for pack install");

  const selectedIds = Array.from(packs);

  if (selectedIds.length === 0) {
    log("› no packs selected, skipping");
    return;
  }

  const byId = new Map(PACKS.map((p) => [p.id, p]));

  // validate each selected pack exists and supports the current framework
  for (const id of selectedIds) {
    const p = byId.get(id);
    if (!p) throw new Error(`Unknown pack: "${id}"`);
    if (Array.isArray(p.frameworks) && !p.frameworks.includes(framework)) {
      throw new Error(`Pack "${id}" does not support framework "${framework}"`);
    }
  }

  const ordered = resolvePackOrder(selectedIds);
  log(`› pack order: ${ordered.join(" → ")}`);

  // collect all deps/devDeps/commands across ordered packs
  const deps = new Set();
  const devDeps = new Set();
  const dlxCommands = []; // { packId, cmd }

  for (const id of ordered) {
    const { install = {} } = byId.get(id);

    for (const d of install.deps ?? []) deps.add(d);
    for (const d of install.devDeps ?? []) devDeps.add(d);

    for (const c of install.commands ?? []) {
      if (c.kind === "dlx" || c.kind === "shell") {
        dlxCommands.push({ packId: id, ...c });
      }
    }
  }

  const pm = packageManager;

  // install all regular deps in one shot
  if (deps.size > 0) {
    log(`› adding ${deps.size} dep(s): ${[...deps].join(", ")}`);
    await runCmd(pmBin(pm), addArgs(pm, [...deps], false), {
      cwd: targetDir,
      onLine: (l) => log(`› ${l}`),
      onErrorLine: (l) => log(`✗ ${l}`),
    });
    log("✓ deps done");
  }

  // install all devDeps in one shot
  if (devDeps.size > 0) {
    log(`› adding ${devDeps.size} devDep(s): ${[...devDeps].join(", ")}`);
    await runCmd(pmBin(pm), addArgs(pm, [...devDeps], true), {
      cwd: targetDir,
      onLine: (l) => log(`› ${l}`),
      onErrorLine: (l) => log(`✗ ${l}`),
    });
    log("✓ devDeps done");
  }

  // run dlx/shell commands in order
  for (const { packId, kind, cmd } of dlxCommands) {
    if (kind === "dlx") {
      log(`› [${packId}] dlx: ${cmd}`);
      await runCmd(dlxBin(pm), dlxArgs(pm, cmd), {
        cwd: targetDir,
        onLine: (l) => log(`› ${l}`),
        onErrorLine: (l) => log(`✗ ${l}`),
      });
      log(`✓ [${packId}] done`);
    }

    if (kind === "shell") {
      log(`› [${packId}] shell: ${cmd}`);
      const isWin = process.platform === "win32";
      await runCmd(isWin ? "cmd" : "sh", isWin ? ["/c", cmd] : ["-c", cmd], {
        cwd: targetDir,
        onLine: (l) => log(`› ${l}`),
        onErrorLine: (l) => log(`✗ ${l}`),
      });
      log(`✓ [${packId}] shell done`);
    }
  }

  log("✓ all packs installed");
}
