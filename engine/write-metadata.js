import fs from "node:fs";
import path from "node:path";

export function writeKitversMeta(targetDir, payload) {
  if (!targetDir) throw new Error("writeKitversMeta: targetDir is missing");

  if (!fs.existsSync(targetDir)) {
    throw new Error(`writeKitversMeta: targetDir does not exist: ${targetDir}`);
  }

  const meta = {
    schemaVersion: 1,
    tool: "kitvers",
    toolVersion: payload.toolVersion ?? "0.1.0",
    createdAt: new Date().toISOString(),
    framework: payload.framework,
    language: payload.language,
    packageManager: payload.packageManager,
    packs: Array.from(payload.packs ?? []),
  };

  const file = path.join(targetDir, ".kitvers.json");

  try {
    fs.writeFileSync(file, JSON.stringify(meta, null, 2), "utf8");
  } catch (e) {
    throw new Error(
      `writeKitversMeta: failed to write .kitvers.json: ${e?.message ?? e}`,
    );
  }

  return file;
}
