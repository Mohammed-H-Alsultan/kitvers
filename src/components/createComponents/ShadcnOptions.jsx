import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

// all components the user can pre-install
const AVAILABLE_COMPONENTS = [
  { id: "button", label: "Button", desc: "Core interactive element" },
  { id: "input", label: "Input", desc: "Text input field" },
  { id: "card", label: "Card", desc: "Content container" },
  { id: "dialog", label: "Dialog", desc: "Modal overlay" },
  { id: "dropdown-menu", label: "Dropdown Menu", desc: "Contextual menu" },
  { id: "toast", label: "Toast", desc: "Notification popup" },
  { id: "badge", label: "Badge", desc: "Status indicator" },
  { id: "separator", label: "Separator", desc: "Visual divider" },
  { id: "avatar", label: "Avatar", desc: "User profile image" },
  { id: "label", label: "Label", desc: "Form field label" },
];

const BASE_COLORS = ["neutral", "gray", "zinc", "stone", "slate"];

// color preview swatches
const COLOR_SWATCHES = {
  neutral: "bg-neutral-500",
  gray: "bg-gray-500",
  zinc: "bg-zinc-500",
  stone: "bg-stone-500",
  slate: "bg-slate-500",
};

export default function ShadcnOptions() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // if no payload came from /create, go back
  if (!state) {
    navigate("/create", { replace: true });
    return null;
  }

  const [baseColor, setBaseColor] = useState("neutral");
  const [cssVariables, setCssVariables] = useState(true);
  const [srcDir, setSrcDir] = useState(true);
  const [noBaseStyle, setNoBaseStyle] = useState(false);
  const [cliVersion, setCliVersion] = useState("latest");
  const [components, setComponents] = useState(new Set());

  const toggleComponent = (id) =>
    setComponents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleContinue = () => {
    const payload = {
      ...state,
      packOptions: {
        ...state.packOptions,
        shadcn: {
          cliVersion: cliVersion.trim() || "latest",
          baseColor,
          cssVariables,
          srcDir,
          noBaseStyle,
          components: Array.from(components),
        },
      },
    };
    navigate("/create/run", { state: payload });
  };

  return (
    <main>
      <div className="p-5 mt-3 text-center">
        <h1 className="text-4xl font-jetbrains font-bold">shadcn/ui config</h1>
        <p className="text-zinc-500 font-mono text-sm mt-2">
          Customize how your UI components are created and styled
        </p>
      </div>

      <section className="flex flex-col justify-center items-center mt-10 pb-32">
        <div className="flex flex-col w-3xl gap-4">
          {/* base color */}
          <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-6 font-mono">
            <p className="text-xs text-zinc-500 tracking-widest uppercase mb-4">
              Base color
            </p>
            <div className="flex gap-2 flex-wrap">
              {BASE_COLORS.map((color) => {
                const isSelected = baseColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setBaseColor(color)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-zinc-400 text-white bg-zinc-800"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${COLOR_SWATCHES[color]}`}
                    />
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* toggle */}
          <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-6 font-mono">
            <p className="text-xs text-zinc-500 tracking-widest uppercase mb-4">
              Options
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  label: "CSS Variables",
                  desc: "Use CSS vars for theming",
                  value: cssVariables,
                  set: setCssVariables,
                },
                {
                  label: "src/ directory",
                  desc: "Output inside src/",
                  value: srcDir,
                  set: setSrcDir,
                },
                {
                  label: "No base style",
                  desc: "Skip installing base shadcn style",
                  value: noBaseStyle,
                  set: setNoBaseStyle,
                },
              ].map(({ label, desc, value, set }) => (
                <button
                  key={label}
                  onClick={() => set((v) => !v)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-200 cursor-pointer group ${
                    value
                      ? "border-zinc-500 bg-zinc-800/60 text-white"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {/* toggle pill */}
                  <div
                    className={`w-8 h-4 rounded-full border flex items-center transition-all duration-200 shrink-0 ${
                      value
                        ? "bg-white border-white"
                        : "bg-transparent border-zinc-600"
                    }`}
                  >
                    <motion.div
                      animate={{ x: value ? 16 : 2 }}
                      transition={{ type: "spring", mass: 0.5, stiffness: 200 }}
                      className={`w-3 h-3 rounded-full shrink-0 ${value ? "bg-zinc-900" : "bg-zinc-600"}`}
                    />
                  </div>
                  <div>
                    <div className="text-sm leading-none mb-0.5">{label}</div>
                    <div className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">
                      {desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* cli version */}
          <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-6 font-mono">
            <p className="text-xs text-zinc-500 tracking-widest uppercase mb-4">
              CLI version
            </p>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={cliVersion}
                onChange={(e) => setCliVersion(e.target.value)}
                placeholder="latest"
                className="input input-sm bg-zinc-950 border border-zinc-700 focus:border-zinc-400 focus:outline-none text-zinc-100 rounded-lg w-40 font-mono transition-colors"
              />
              <span className="text-xs text-zinc-600">
                pin a version e.g. <span className="text-zinc-400">3.8.5</span>{" "}
                or leave as <span className="text-zinc-400">latest</span>
              </span>
            </div>
          </div>

          {/* components */}
          <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-6 font-mono">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-zinc-500 tracking-widest uppercase">
                Pre-install components
              </p>
              {components.size > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full"
                >
                  {components.size} selected
                </motion.span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_COMPONENTS.map(({ id, label, desc }) => {
                const isOn = components.has(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleComponent(id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-200 cursor-pointer group ${
                      isOn
                        ? "border-zinc-500 bg-zinc-800/60 text-white"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    }`}
                  >
                    {/* checkbox style indicator */}
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isOn
                          ? "bg-white border-white"
                          : "bg-transparent border-zinc-600"
                      }`}
                    >
                      <AnimatePresence>
                        {isOn && (
                          <motion.svg
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{
                              type: "spring",
                              mass: 0.3,
                              stiffness: 300,
                            }}
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M1.5 5L4 7.5L8.5 2.5"
                              stroke="#18181b"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <div className="text-sm leading-none mb-0.5">{label}</div>
                      <div className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">
                        {desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* empty state */}
            {components.size === 0 && (
              <p className="text-xs text-zinc-700 mt-3">
                no components selected — you can add them later with{" "}
                <span className="text-zinc-500">npx shadcn add</span>
              </p>
            )}
          </div>

          {/* continue button */}
          <div className="flex justify-end mt-2">
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-white text-zinc-900 rounded-lg font-mono text-sm font-medium hover:bg-zinc-200 transition-colors duration-200 cursor-pointer"
            >
              continue →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
