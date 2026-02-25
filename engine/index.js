#!/usr/bin/env node
import { scaffoldVite } from "./scaffold-vite.js";
import { installPacks } from "./install-packs.js";
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
      // 1. scaffold vite project + install base deps
      const { targetDir } = await scaffoldVite(payload, {
        log: (l) => console.log(l),
      });

      const effectivePayload = { ...payload, targetDir };

      // 2. install pack deps/devDeps/dlx commands
      await installPacks(effectivePayload, { log: (l) => console.log(l) });

      // 3. patch vite.config + css files for packs that need it
      await applyPacks(effectivePayload, { log: (l) => console.log(l) });

      // 4. write .kitvers.json metadata
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
