import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Command } from "@tauri-apps/plugin-shell";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import RunProgress from "../../components/RunProgress";
import AnimatedLink from "../../components/animatedComponents/AnimatedLink";

const STEPS = [
  { id: "scaffold", label: "Scaffolding project" },
  { id: "deps", label: "Installing dependencies" },
  { id: "configs", label: "Applying configs" },
  { id: "packs", label: "Running pack commands" },
  { id: "meta", label: "Writing metadata" },
];

const STEP_TRIGGERS = [
  { pattern: "scaffold complete", step: 1 },
  { pattern: "pack deps installed", step: 2 },
  { pattern: "all pack configs applied", step: 3 },
  { pattern: "pack command", step: 3 },
  { pattern: "wrote .kitvers", step: 4 },
];

function detectStep(line) {
  const low = line.toLowerCase();
  for (const { pattern, step } of STEP_TRIGGERS) {
    if (low.includes(pattern)) return step;
  }
  return null;
}

const IS_DEV = import.meta.env.DEV;

// strip ANSI escape codes from CLI output (colors, cursor moves, etc.)
// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-9;]*[a-zA-Z]|\x1b\].*?(?:\x07|\x1b\\)/g;
const stripAnsi = (s) => s.replace(ANSI_RE, "");

// lines the user doesn't need to see — debug dumps, normalization, engine internals
const HIDDEN_PATTERNS = [
  "[debug]", // debug-only output
  "normalized payload", // payload dump
  "engine started", // redundant — UI already shows "Creating project…"
  '"projectName"', // JSON payload lines
  '"projectPath"',
  '"framework"',
  '"language"',
  '"packageManager"',
  '"packs"',
  '"packOptions"',
  '"options"',
  '"debug"',
];

function shouldHideLine(line) {
  const low = line.toLowerCase();
  return HIDDEN_PATTERNS.some((p) => low.includes(p));
}

function runEngine({ payload, onLog, onStep, onDone, onFail }) {
  let cancelled = false;

  (async () => {
    try {
      const jsonPayload = JSON.stringify(payload);
      const cmd = IS_DEV
        ? Command.create("node", ["../engine/index.js"], { stdin: "pipe" })
        : Command.sidecar("binaries/node-engine", [], { stdin: "pipe" });

      let result = null;

      cmd.stdout.on("data", (line) => {
        if (cancelled) return;
        const trimmed = stripAnsi(line).trim();
        if (!trimmed) return;

        if (trimmed.startsWith("__KITVERS_RESULT__=")) {
          try {
            result = JSON.parse(trimmed.slice("__KITVERS_RESULT__=".length));
          } catch {
            /* ignore */
          }
          return;
        }

        // skip debug/internal lines from user-facing logs
        if (!shouldHideLine(trimmed)) {
          onLog(trimmed);
        }
        const step = detectStep(trimmed);
        if (step !== null) onStep(step);
      });

      cmd.stderr.on("data", (line) => {
        if (cancelled) return;
        const trimmed = stripAnsi(line).trim();
        if (trimmed) onLog(`✗ ${trimmed}`);
      });

      const child = await cmd.spawn();
      await child.write(jsonPayload + "\n");

      const exitCode = await new Promise((res) => {
        cmd.on("close", ({ code }) => res(code));
      });

      if (cancelled) return;

      if (exitCode === 0 && result?.ok) {
        onDone(result);
      } else {
        onFail(result?.error ?? "engine exited with code " + exitCode);
      }
    } catch (err) {
      if (!cancelled) onFail(err?.message ?? "unknown error");
    }
  })();

  return () => {
    cancelled = true;
  };
}

export default function ProjectCreation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate("/create", { replace: true });
  }, [state, navigate]);

  const payload = state;

  const [phase, setPhase] = useState("running");
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(() => new Set());
  const [logs, setLogs] = useState([]);
  const [resultDir, setResultDir] = useState(null);

  const canShow = useMemo(() => Boolean(payload), [payload]);
  const appendLog = (line) => setLogs((prev) => [...prev, line]);
  const advanceStep = (i) => {
    setActiveStep(i);
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      for (let s = 0; s < i; s++) next.add(s);
      return next;
    });
  };

  useEffect(() => {
    if (!payload) return;

    setPhase("running");
    setActiveStep(0);
    setCompletedSteps(new Set());
    setResultDir(null);
    setLogs([
      `› project:   ${payload.projectName || "untitled"}`,
      `› path:      ${payload.projectPath || "-"}`,
      `› framework: ${payload.framework}`,
      `› language:  ${payload.language}`,
      `› pm:        ${payload.packageManager}`,
      `› packs:     ${(payload.packs ?? []).join(", ") || "none"}`,
    ]);

    const stop = runEngine({
      payload,
      onLog: appendLog,
      onStep: advanceStep,
      onDone: (result) => {
        advanceStep(STEPS.length);
        setCompletedSteps(new Set(STEPS.map((_, i) => i)));
        setResultDir(result?.targetDir ?? null);
        setPhase("success");
      },
      onFail: (msg) => {
        if (msg) appendLog(`✗ ${msg}`);
        setPhase("error");
      },
    });

    return stop;
  }, [payload]);

  const onCopyLogs = async () => {
    try {
      await navigator.clipboard.writeText(logs.join("\n"));
      appendLog("✓ copied logs");
    } catch {
      appendLog("✗ failed to copy logs");
    }
  };

  const onCancel = () => {
    appendLog("✗ cancelled");
    setPhase("error");
  };

  const onOpenFolder = async () => {
    if (!resultDir) return;
    try {
      await revealItemInDir(resultDir);
    } catch {
      appendLog("✗ could not open folder");
    }
  };

  if (!canShow) return null;

  return (
    <main>
      <div className="p-6">
        <AnimatedLink to={"/create"} />
      </div>

      <RunProgress
        phase={phase}
        activeStep={activeStep}
        completedSteps={completedSteps}
        logs={logs}
        onCopyLogs={onCopyLogs}
        onCancel={onCancel}
        onOpenFolder={onOpenFolder}
      />
    </main>
  );
}
