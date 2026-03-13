#!/usr/bin/env node
import { scaffoldVite } from "./scaffold-vite.js";
import { installPacks, runPackCommands } from "./install-packs.js";
import { applyPacks } from "./apply-packs.js";
import { writeKitversMeta } from "./write-metadata.js";
import { normalizePayload } from "./validate-payload .js";

process.stdin.setEncoding("utf8");

let input = "";
let started = false;

process.stdin.on("data", (chunk) => {
  input += chunk;

  if (!started && input.includes("\n")) {
    started = true;
    process.stdin.pause();
    const firstLine = input.split("\n")[0].trim();
    run(firstLine);
  }
});

// fallback: if stdin closes normally (CLI usage via pipe), run with what we have
process.stdin.on("end", () => {
  if (!started && input.trim()) {
    started = true;
    run(input.trim());
  }
});

async function run(rawInput) {
  try {
    const raw = JSON.parse(rawInput || "{}");

    // normalize + validate — throws on bad input, warns + falls back otherwise
    const payload = normalizePayload(raw, { log: (l) => console.log(l) });

    console.log("› engine started");
    console.log(`› project:   ${payload.projectName}`);
    console.log(`› framework: ${payload.framework}`);
    console.log(`› language:  ${payload.language}`);
    console.log(`› packs:     ${payload.packs.join(", ") || "none"}`);

    // dry run — print resolved payload + planned steps, exit without touching disk
    if (payload.options?.dryRun === true) {
      console.log("› [dry run] normalized payload:");
      console.log(JSON.stringify(payload, null, 2));
      console.log("› [dry run] planned steps:");
      console.log("›   1. scaffold vite project");
      console.log(
        `›   2. install pack deps: ${payload.packs.join(", ") || "none"}`,
      );
      console.log("›   3. apply configs (vite.config, css, tsconfig alias)");
      console.log("›   4. run pack commands (shadcn init + add, etc.)");
      console.log("›   5. write .kitvers.json");
      console.log("› [dry run] no files written. remove dryRun to execute.");
      console.log(
        `__KITVERS_RESULT__=${JSON.stringify({ ok: true, dryRun: true })}`,
      );
      process.exit(0);
    }

    // 1. scaffold vite + install base node_modules
    const { targetDir } = await scaffoldVite(payload, {
      log: (l) => console.log(l),
    });

    const effectivePayload = { ...payload, targetDir };

    // 2. install pack deps + devDeps
    await installPacks(effectivePayload, { log: (l) => console.log(l) });

    // 3. patch vite.config + css
    await applyPacks(effectivePayload, { log: (l) => console.log(l) });

    // 4. run dlx/shell commands that need config to exist first
    await runPackCommands(effectivePayload, { log: (l) => console.log(l) });

    // 5. write .kitvers.json — createdAt/tool added here as engine-internal metadata
    const metaPath = writeKitversMeta(targetDir, {
      ...effectivePayload,
      createdAt: new Date().toISOString(),
      tool: { name: "kitvers", version: "0.1.0" },
    });
    console.log(`✓ wrote ${metaPath}`);

    console.log("✓ engine done");

    // machine-readable result — UI parses this line instead of scraping logs
    console.log(
      `__KITVERS_RESULT__=${JSON.stringify({ ok: true, targetDir, metaFile: metaPath })}`,
    );

    process.exit(0);
  } catch (err) {
    console.log(`✗ ${err?.message ?? "unknown error"}`);
    console.log(
      `__KITVERS_RESULT__=${JSON.stringify({ ok: false, error: err?.message ?? "unknown error" })}`,
    );
    process.exit(1);
  }
}
