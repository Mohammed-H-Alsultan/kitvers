import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RunProgress from "../../components/RunProgress";
import AnimatedLink from "../../components/animatedComponents/AnimatedLink";

const STEPS = [
  { id: "scaffold", label: "Scaffolding project" },
  { id: "deps", label: "Installing dependencies" },
  { id: "configs", label: "Applying configs" },
  { id: "templates", label: "Adding templates" },
  { id: "checks", label: "Running checks" },
];

// TEMP: fake run (Later I will add the real engine)
function fakeRun({ onLog, onStep, onDone, onFail }) {
  let cancelled = false;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  (async () => {
    try {
      onLog("› starting…");
      for (let i = 0; i < STEPS.length; i++) {
        if (cancelled) return;
        onStep(i);
        onLog(`› ${STEPS[i].label}`);
        await sleep(700);
        onLog("✓ done");
        await sleep(250);
      }
      if (cancelled) return;
      onLog("✓ all complete");
      onDone();
    } catch (e) {
      onLog(`✗ ${e?.message ?? "unknown error"}`);
      onFail();
    }
  })();

  return () => {
    cancelled = true;
  };
}

export default function RunProject() {
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

  const canShow = useMemo(() => Boolean(payload), [payload]);

  useEffect(() => {
    if (!payload) return;

    setPhase("running");
    setActiveStep(0);
    setCompletedSteps(new Set());
    setLogs([
      `› project: ${payload.projectName || "untitled"}`,
      `› path: ${payload.projectPath || "-"}`,
      `› framework: ${payload.framework}`,
      `› pm: ${payload.packageManager}`,
      `› packs: ${(payload.packs ?? []).join(", ") || "none"}`,
    ]);

    const stop = fakeRun({
      onLog: (line) => setLogs((prev) => [...prev, line]),
      onStep: (i) => {
        setActiveStep(i);
        setCompletedSteps((prev) => {
          const next = new Set(prev);
          if (i > 0) next.add(i - 1);
          return next;
        });
      },
      onDone: () => {
        setCompletedSteps(() => new Set(STEPS.map((_, i) => i)));
        setPhase("success");
      },
      onFail: () => setPhase("error"),
    });

    return stop;
  }, [payload]);

  const onCopyLogs = async () => {
    try {
      await navigator.clipboard.writeText(logs.join("\n"));
      setLogs((prev) => [...prev, "✓ copied logs"]);
    } catch {
      setLogs((prev) => [...prev, "✗ failed to copy logs"]);
    }
  };

  const onCancel = () => {
    setLogs((prev) => [...prev, "✗ cancelled"]);
    setPhase("error");
  };

  const onOpenFolder = () => {
    // TEMP later tauri open path
    setLogs((prev) => [...prev, "› open folder (todo)"]);
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