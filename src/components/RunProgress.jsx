// TEMP file (Just UI)

import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiCopy, FiFolder } from "react-icons/fi";
import { VscLoading } from "react-icons/vsc";
import { TbCircleDashed } from "react-icons/tb";

const STEPS = [
  { id: "scaffold", label: "Scaffolding project" },
  { id: "deps", label: "Installing dependencies" },
  { id: "configs", label: "Applying configs" },
  { id: "templates", label: "Adding templates" },
  { id: "checks", label: "Running checks" },
];

function StepIcon({ status }) {
  if (status === "done")
    return <FiCheckCircle className="text-white shrink-0" size={18} />;
  if (status === "active")
    return (
      <VscLoading className="text-zinc-300 animate-spin shrink-0" size={18} />
    );
  if (status === "error")
    return <FiXCircle className="text-error shrink-0" size={18} />;
  return <TbCircleDashed className="text-zinc-700 shrink-0" size={18} />;
}

export default function RunProgress({
  phase = "running",
  activeStep = 0,
  completedSteps,
  logs = [],
  onCopyLogs,
  onCancel,
  onOpenFolder,
}) {
  const navigate = useNavigate();

  const done = completedSteps ?? new Set();
  const lines = logs ?? [];

  const getStepStatus = (index) => {
    if (completedSteps.has(index)) return "done";
    if (index === activeStep && phase === "running") return "active";
    if (phase === "error" && index === activeStep) return "error";
    return "idle";
  };

  return (
    <div className="font-mono flex flex-col items-center justify-start pt-16 pb-32 px-4">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/*  header  */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                phase === "running"
                  ? "bg-zinc-400 animate-pulse"
                  : phase === "success"
                    ? "bg-success"
                    : "bg-error"
              }`}
            />
            <h1 className="text-xl text-zinc-100 tracking-tight">
              {phase === "running" && "Creating project…"}
              {phase === "success" && "Project created"}
              {phase === "error" && "Something failed"}
            </h1>
          </div>
          <p className="text-xs text-zinc-600 pl-5">
            {phase === "running" && "This may take a minute, hang tight."}
            {phase === "success" &&
              "Everything went smoothly. Your project is ready."}
            {phase === "error" &&
              "Check the logs below for details, then go back and try again."}
          </p>
        </div>

        {/*  steps  */}
        <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800">
            <span className="text-[10px] tracking-widest text-zinc-600 uppercase">
              Steps
            </span>
          </div>
          <div className="divide-y divide-zinc-900">
            {STEPS.map((step, i) => {
              const status = getStepStatus(i);
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    status === "active" ? "bg-zinc-900/40" : ""
                  }`}
                >
                  <StepIcon status={status} />
                  <span
                    className={`text-sm transition-colors ${
                      status === "done"
                        ? "text-zinc-300"
                        : status === "active"
                          ? "text-zinc-100"
                          : status === "error"
                            ? "text-error"
                            : "text-zinc-700"
                    }`}
                  >
                    {step.label}
                  </span>
                  {status === "active" && (
                    <span className="ml-auto text-[10px] text-zinc-600 animate-pulse">
                      in progress
                    </span>
                  )}
                  {status === "done" && (
                    <span className="ml-auto text-[10px] text-zinc-700">
                      done
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/*  log panel  */}
        <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <span className="text-[10px] tracking-widest text-zinc-600 uppercase">
              Logs
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onCopyLogs}
                className="btn btn-xs btn-ghost border border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-300 gap-1.5"
              >
                <FiCopy size={11} />
                Copy logs
              </button>
              {phase === "running" && (
                <button
                  onClick={onCancel}
                  className="btn btn-xs btn-ghost border border-zinc-800 text-zinc-600 hover:border-red-900 hover:text-error hover:bg-red-950/30 gap-1.5"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-4 space-y-1 text-xs leading-relaxed">
            {logs.length === 0 && (
              <span className="text-zinc-700">Waiting for output…</span>
            )}
            {logs.map((line, i) => (
              <div
                key={i}
                className={
                  line.startsWith("✓")
                    ? "text-success"
                    : line.startsWith("✗")
                      ? "text-error"
                      : line.startsWith("›")
                        ? "text-zinc-400"
                        : "text-zinc-600"
                }
              >
                {line}
              </div>
            ))}
            {phase === "running" && (
              <div className="flex gap-1 pt-1">
                <span className="w-1 h-1 rounded-full bg-zinc-700 animate-bounce [animation-delay:0ms]" />
                <span className="w-1 h-1 rounded-full bg-zinc-700 animate-bounce [animation-delay:150ms]" />
                <span className="w-1 h-1 rounded-full bg-zinc-700 animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>
        </div>

        {/*  success state  */}
        {phase === "success" && (
          <div className="alert bg-success/10 border border-success/30 rounded-xl">
            <FiCheckCircle className="text-success shrink-0" size={20} />
            <div>
              <p className="text-sm text-success font-mono">
                Project created successfully
              </p>
              <p className="text-xs text-success/40 font-mono">
                Your project is ready to go
              </p>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={onOpenFolder}
                className="btn btn-sm bg-white text-zinc-900 hover:bg-zinc-200 border-none gap-1.5"
              >
                <FiFolder size={14} />
                Open folder
              </button>
            </div>
          </div>
        )}

        {/* error state */}
        {phase === "error" && (
          <div className="alert bg-error/10 border border-error/30 rounded-xl">
            <FiXCircle className="text-error shrink-0" size={20} />
            <div>
              <p className="text-sm text-error font-mono">Build failed</p>
              <p className="text-xs text-error/40 font-mono">
                Check the log output above for details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
