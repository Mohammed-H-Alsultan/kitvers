#!/usr/bin/env node
import { scaffoldVite } from "./scaffold-vite.js";
import { installPacks, runPackCommands } from "./install-packs.js";
import { applyPacks } from "./apply-packs.js";
import { writeKitversMeta } from "./write-metadata.js";

process.stdin.setEncoding("utf8");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));

process.stdin.on("end", async () => {
  try {
    const payload = JSON.parse(input || "{}");

    console.log("› engine started");
    console.log(`› project:   ${payload.projectName ?? "(missing)"}`);
    console.log(`› framework: ${payload.framework ?? "(missing)"}`);
    console.log(`› packs:     ${(payload.packs ?? []).join(", ") || "none"}`);

    if (payload.framework === "react" || payload.framework === "vue") {
      // 1. scaffold vite + install base node_modules
      const { targetDir } = await scaffoldVite(payload, {
        log: (l) => console.log(l),
      });

      const effectivePayload = { ...payload, targetDir };

      // 2. install pack deps + devDeps
      await installPacks(effectivePayload, { log: (l) => console.log(l) });

      // 3. patch vite.config + css
      await applyPacks(effectivePayload, { log: (l) => console.log(l) });

      // 4. run dlx/shell commands that need config to exist
      await runPackCommands(effectivePayload, { log: (l) => console.log(l) });

      // 5. write .kitvers.json
      const metaPath = writeKitversMeta(targetDir, effectivePayload);
      console.log(`✓ wrote ${metaPath}`);

      console.log("✓ engine done");
      process.exit(0);
    }

    console.log("✗ only vite scaffolding implemented (react/vue)");
    process.exit(1);
  } catch (err) {
    console.log(`✗ ${err?.message ?? "unknown error"}`);
    process.exit(1);
  }
});
