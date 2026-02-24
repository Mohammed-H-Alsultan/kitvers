import path from "node:path";
import fs from "node:fs";
import { runCmd } from "./runner.js";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// resolves final project folder
function appDir(projectPath, projectName) {
  return path.resolve(projectPath, projectName);
}

// payload framework  (vite template string)
function viteTemplate({ framework, language }) {
  const isTS = language === "typescript";

  if (framework === "react") return isTS ? "react-ts" : "react";
  if (framework === "vue") return isTS ? "vue-ts" : "vue";

  throw new Error(`Vite scaffold does not support framework: ${framework}`);
}

// returns the correct pm binary name for the current OS
function pmCmd(pm) {
  const isWin = process.platform === "win32";
  const map = {
    npm: isWin ? "npm.cmd" : "npm",
    pnpm: isWin ? "pnpm.cmd" : "pnpm",
    yarn: isWin ? "yarn.cmd" : "yarn",
    bun: isWin ? "bun.cmd" : "bun",
  };
  return map[pm] ?? map.npm; // fallback to npm
}

export async function scaffoldVite(payload, { log = console.log } = {}) {
  const { projectName, projectPath, framework, language, packageManager } =
    payload;

  // guard: required fields
  if (!projectName?.trim()) throw new Error("Missing projectName");
  if (!projectPath?.trim()) throw new Error("Missing projectPath");

  // make sure root path exists before we do anything
  ensureDir(projectPath);

  const targetDir = appDir(projectPath, projectName);

  // refuse to scaffold into a dirty folder
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    throw new Error(`Target directory is not empty: ${targetDir}`);
  }

  const template = viteTemplate({ framework, language });

  log(`› scaffolding vite project`);
  log(`› dir: ${targetDir}`);
  log(`› template: ${template}`);
  log(`› raw projectPath: ${projectPath}`);
  log(`› exists? ${fs.existsSync(projectPath)}`);

  const pm = packageManager ?? "npm";

  // bun uses bunx create-vite, others use <pm> create vite@latest
  if (pm === "bun") {
    await runCmd(
      "bunx",
      ["create-vite@latest", projectName, "--template", template],
      {
        cwd: projectPath,
        onLine: (l) => log(`› ${l}`),
        onErrorLine: (l) => log(`✗ ${l}`),
      },
    );
  } else {
    const cmd = pmCmd(pm);
    await runCmd(
      cmd,
      ["create", "vite@latest", projectName, "--", "--template", template],
      {
        cwd: projectPath,
        onLine: (l) => log(`› ${l}`),
        onErrorLine: (l) => log(`✗ ${l}`),
      },
    );
  }

  log(`✓ scaffold complete`);

  // install inside the newly created project folder
  log(`› installing deps (${pm})`);

  await runCmd(pm === "bun" ? "bun" : pmCmd(pm), ["install"], {
    cwd: targetDir,
    onLine: (l) => log(`› ${l}`),
    onErrorLine: (l) => log(`✗ ${l}`),
  });

  log(`✓ deps installed`);
  return { targetDir, template };
}
