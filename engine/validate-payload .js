import { PACKS } from "./packsData.js";

const VALID_FRAMEWORKS = ["react", "vue"];
const VALID_LANGUAGES = ["javascript", "typescript"];
const VALID_PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"];
const VALID_BASE_COLORS = ["neutral", "gray", "zinc", "stone", "slate"];


function packsForFramework(framework) {
  return PACKS.filter(
    (p) => !Array.isArray(p.frameworks) || p.frameworks.includes(framework),
  ).map((p) => p.id);
}

// ── shadcn defaults

const SHADCN_DEFAULTS = {
  cliVersion: "latest",
  baseColor: "neutral",
  cssVariables: true,
  srcDir: true,
  noBaseStyle: false,
  components: [],
};

const SHADCN_VUE_DEFAULTS = {
  cliVersion: "latest",
  baseColor: "neutral",
  cssVariables: true,
  components: [],
};

// ── helpers

// throws with a clear prefix so engine catch block prints it cleanly
function fail(msg) {
  throw new Error(`[payload] ${msg}`);
}

// warn + return fallback — never throws
function warnFallback(field, got, fallback, log) {
  log(
    `⚠ payload: "${field}" invalid value "${got}", falling back to "${fallback}"`,
  );
  return fallback;
}

// ── shadcn option normalizer

// shared by shadcn + shadcn-vue — each passes its own defaults object
function normalizeShadcnOptions(raw = {}, defaults, log) {
  const o = { ...defaults };

  // cliVersion — non-empty string
  if (raw.cliVersion !== undefined) {
    if (typeof raw.cliVersion === "string" && raw.cliVersion.trim()) {
      o.cliVersion = raw.cliVersion.trim();
    } else {
      log(
        `⚠ payload: shadcn "cliVersion" must be a non-empty string, falling back to "${defaults.cliVersion}"`,
      );
    }
  }

  // baseColor — must be in allowed list
  if (raw.baseColor !== undefined) {
    o.baseColor = VALID_BASE_COLORS.includes(raw.baseColor)
      ? raw.baseColor
      : warnFallback(
          "shadcn.baseColor",
          raw.baseColor,
          defaults.baseColor,
          log,
        );
  }

  // booleans — only validate keys that exist on the defaults (srcDir not in vue defaults)
  for (const key of ["cssVariables", "srcDir", "noBaseStyle"].filter(
    (k) => k in defaults,
  )) {
    if (raw[key] !== undefined) {
      if (typeof raw[key] === "boolean") {
        o[key] = raw[key];
      } else {
        log(
          `⚠ payload: shadcn "${key}" must be boolean, falling back to ${defaults[key]}`,
        );
      }
    }
  }

  // components — one pass classify: valid trimmed strings only
  if (raw.components !== undefined) {
    if (!Array.isArray(raw.components)) {
      log(
        `⚠ payload: shadcn "components" must be an array, falling back to []`,
      );
    } else {
      const valid = [];
      const invalid = [];
      for (const c of raw.components) {
        if (typeof c === "string" && c.trim()) valid.push(c.trim());
        else invalid.push(c);
      }
      if (invalid.length)
        log(
          `⚠ payload: shadcn stripped invalid components: ${JSON.stringify(invalid)}`,
        );
      o.components = valid;
    }
  }

  return o;
}

// ── main export

export function normalizePayload(raw, { log = console.log } = {}) {

  if (!raw.projectName?.trim())
    fail('"projectName" is required and must be a non-empty string');
  if (!raw.projectPath?.trim())
    fail('"projectPath" is required and must be a non-empty string');
  if (!raw.framework) fail('"framework" is required');
  if (!raw.language) fail('"language" is required');
  if (!raw.packageManager) fail('"packageManager" is required');

  // ── enum fields

  // framework hard-fails — wrong framework = wrong scaffold, not recoverable
  const framework = VALID_FRAMEWORKS.includes(raw.framework)
    ? raw.framework
    : fail(
        `"framework" must be one of: ${VALID_FRAMEWORKS.join(", ")}. got "${raw.framework}"`,
      );

  const language = VALID_LANGUAGES.includes(raw.language)
    ? raw.language
    : warnFallback("language", raw.language, "javascript", log);

  const packageManager = VALID_PACKAGE_MANAGERS.includes(raw.packageManager)
    ? raw.packageManager
    : warnFallback("packageManager", raw.packageManager, "npm", log);

  // ── packs — deduplicate, then strip framework-incompatible packs

  const rawPacks = [
    ...new Set(
      Array.isArray(raw.packs)
        ? raw.packs.filter((p) => typeof p === "string" && p.trim())
        : [],
    ),
  ];

  // empty packs = likely a UI bug — require explicit opt-in to allow it
  if (rawPacks.length === 0 && raw.options?.allowEmptyPacks !== true) {
    fail(
      '"packs" is empty. pass at least one pack, or set options.allowEmptyPacks = true to scaffold without packs',
    );
  }

  // strip packs incompatible with the selected framework — derived from PACKS registry
  const allowed = new Set(packsForFramework(framework));
  const wrongPacks = rawPacks.filter((p) => !allowed.has(p));

  if (wrongPacks.length > 0) {
    log(
      `⚠ payload: packs [${wrongPacks.join(", ")}] are not compatible with "${framework}" and will be removed`,
    );
  }

  const packs = rawPacks.filter((p) => allowed.has(p));

  // check again after stripping — user may have sent only incompatible packs
  if (packs.length === 0 && raw.options?.allowEmptyPacks !== true) {
    fail(
      `"packs" became empty after removing incompatible packs for "${framework}". pick compatible packs or set options.allowEmptyPacks = true`,
    );
  }

  // ── packOptions — only build keys for packs we actually have
  const rawOpts =
    typeof raw.packOptions === "object" && raw.packOptions !== null
      ? raw.packOptions
      : {};
  const packOptions = {};

  if (packs.includes("shadcn")) {
    packOptions.shadcn = normalizeShadcnOptions(
      rawOpts.shadcn ?? {},
      SHADCN_DEFAULTS,
      log,
    );
  }

  if (packs.includes("shadcn-vue")) {
    packOptions["shadcn-vue"] = normalizeShadcnOptions(
      rawOpts["shadcn-vue"] ?? {},
      SHADCN_VUE_DEFAULTS,
      log,
    );
  }

  // debug: warn about unrecognized packOptions keys
  if (raw.debug === true) {
    const known = ["shadcn", "shadcn-vue"];
    const unknown = Object.keys(rawOpts).filter((k) => !known.includes(k));
    if (unknown.length)
      log(
        `› [debug] packOptions keys ignored (unsupported): ${unknown.join(", ")}`,
      );
  }

  // ── assemble — createdAt/tool are engine-internal, not part of input schema

  const normalized = {
    projectName: raw.projectName.trim(),
    projectPath: raw.projectPath.trim(),
    framework,
    language,
    packageManager,
    packs,
    packOptions,
    options:
      typeof raw.options === "object" && raw.options !== null
        ? raw.options
        : {},
    debug: raw.debug === true,
  };

  if (normalized.debug) {
    log(
      `› [debug] normalized payload:\n${JSON.stringify(normalized, null, 2)}`,
    );
  }

  return normalized;
}
