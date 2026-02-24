#!/usr/bin/env node

process.stdin.setEncoding("utf8");

let input = "";

process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  try {
    const payload = JSON.parse(input);

    console.log("› Engine started");
    console.log(`› Project: ${payload.projectName}`);
    console.log("✓ Engine received payload");

    process.exit(0);
  } catch (err) {
    console.error("✗ Failed to parse payload");
    process.exit(1);
  }
});
