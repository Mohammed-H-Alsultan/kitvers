#!/usr/bin/env node
import { scaffoldVite } from "./scaffold-vite.js";
import { installPacks } from "./install-packs.js";

process.stdin.setEncoding("utf8");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));

process.stdin.on("end", async () => {
  try {
    const payload = JSON.parse(input || "{}");

    console.log("› engine started");
    console.log(`› project: ${payload.projectName ?? "(missing)"}`);
    console.log(`› framework: ${payload.framework ?? "(missing)"}`);

    if (payload.framework === "react" || payload.framework === "vue") {
      const { targetDir } = await scaffoldVite(payload, {
        log: (l) => console.log(l),
      });

      // pass targetDir to pack installer
      await installPacks(
        { ...payload, targetDir },
        { log: (l) => console.log(l) },
      );

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
