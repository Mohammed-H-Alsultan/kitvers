#!/usr/bin/env node
import { runCmd } from "./runner.js";

process.stdin.setEncoding("utf8");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));

process.stdin.on("end", async () => {
  try {
    const payload = JSON.parse(input || "{}");

    console.log("› engine started");
    console.log(`› project: ${payload.projectName ?? "(missing)"}`);

    console.log("› test: node -v");
    await runCmd("node", ["-v"], {
      onLine: (line) => console.log(`› ${line}`),
      onErrorLine: (line) => console.log(`✗ ${line}`),
    });

    console.log("✓ runner works");
    process.exit(0);
  } catch (err) {
    console.log(`✗ ${err?.message ?? "unknown error"}`);
    process.exit(1);
  }
});
