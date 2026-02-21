import { motion, AnimatePresence } from "motion/react";

const FRAMEWORK_OPTIONS = {
  nextjs: ["eslint", "srcDir", "appRouter", "turbopack"],
  react: [],
  vue: ["jsx", "vueRouter", "pinia", "vitest", "cypress", "eslint", "prettier"],
  nuxt: ["eslint", "prettier", "renderingMode", "deployTarget", "jest"],
};

const OPTION_LABELS = {
  // shared
  eslint: "ESLint",
  prettier: "Prettier",
  // nextjs
  srcDir: "src/ directory",
  appRouter: "App Router",
  turbopack: "Turbopack",
  // vue
  jsx: "JSX Support",
  vueRouter: "Vue Router",
  pinia: "Pinia",
  vitest: "Vitest",
  cypress: "Cypress",
  // nuxt
  renderingMode: "Rendering Mode",
  deployTarget: "Deploy Target",
  jest: "Jest",
};

const OPTION_DESCRIPTIONS = {
  eslint: "Lint your code on save",
  prettier: "Opinionated code formatter",
  srcDir: "Place code inside src/",
  appRouter: "Next.js App Router (recommended)",
  turbopack: "Faster dev server (beta)",
  jsx: "Use JSX syntax in .vue files",
  vueRouter: "Client-side routing for SPA",
  pinia: "Official Vue state management",
  vitest: "Unit testing powered by Vite",
  cypress: "End-to-end testing",
  renderingMode: "SSR (Universal) or SPA",
  deployTarget: "Server-side or Static hosting",
  jest: "Unit testing framework",
};

export default function ProjectOptions({
  selectedFramework,
  selectedLanguage,
  setSelectedLanguage,
  options,
  setOptions,
}) {
  const labels = {
    nextjs: "Next.js",
    nuxt: "Nuxt",
    react: "Vite + React",
    vue: "Vite + Vue",
  };

  const visibleOptions = FRAMEWORK_OPTIONS[selectedFramework] ?? [];

  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <div className="flex flex-col w-3xl justify-center items-center">
        {/* divider title */}
        <div className="divider divider-start font-mono w-full">
          Options ·{" "}
          <motion.span
            key={selectedFramework}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", mass: 1, stiffness: 120 }}
            className="text-white"
          >
            {labels[selectedFramework]}
          </motion.span>
        </div>

        {/* card */}
        <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-6 w-full font-mono">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFramework}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                type: "spring",
                mass: 0.4,
                stiffness: 140,
                damping: 16,
              }}
            >
              {/* language toggle */}
              <div className="mb-6">
                <p className="text-xs text-zinc-500 tracking-widest uppercase mb-3">
                  Language
                </p>
                <div className="flex gap-2">
                  {["typescript", "javascript"].map((lang) => {
                    const isSelected = selectedLanguage === lang;
                    return (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`relative px-5 py-2 rounded-lg text-sm border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-zinc-400 text-white bg-zinc-800"
                            : "border-zinc-800 text-zinc-500 bg-transparent hover:border-zinc-600 hover:text-zinc-300"
                        }`}
                      >
                        {isSelected && (
                          <motion.span className="absolute inset-0 rounded-lg bg-zinc-800 -z-10" />
                        )}
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              isSelected ? "bg-white" : "bg-zinc-700"
                            }`}
                          />
                          {lang === "typescript" ? "TypeScript" : "JavaScript"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* framework-specific options */}
              {visibleOptions.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-zinc-500 tracking-widest uppercase mb-3">
                    Scaffold options
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {visibleOptions.map((key) => {
                      const isOn = !!options[key];
                      return (
                        <button
                          key={key}
                          onClick={() =>
                            setOptions((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }))
                          }
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-200 cursor-pointer group ${
                            isOn
                              ? "border-zinc-500 bg-zinc-800/60 text-white"
                              : "border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                          }`}
                        >
                          {/* toggle pill */}
                          <div
                            className={`w-8 h-4 rounded-full border flex items-center transition-all duration-200 shrink-0 ${
                              isOn
                                ? "bg-white border-white"
                                : "bg-transparent border-zinc-600"
                            }`}
                          >
                            <motion.div
                              animate={{ x: isOn ? 16 : 2 }}
                              transition={{
                                type: "spring",
                                mass: 0.5,
                                stiffness: 200,
                              }}
                              className={`w-3 h-3 rounded-full shrink-0 ${
                                isOn ? "bg-zinc-900" : "bg-zinc-600"
                              }`}
                            />
                          </div>

                          {/* label + desc */}
                          <div>
                            <div className="text-sm leading-none mb-0.5">
                              {OPTION_LABELS[key]}
                            </div>
                            <div className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">
                              {OPTION_DESCRIPTIONS[key]}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* import alias (Next.js only) */}
              {selectedFramework === "nextjs" && (
                <div>
                  <p className="text-xs text-zinc-500 tracking-widest uppercase mb-3">
                    Import alias
                  </p>
                  <div className="flex flex-col gap-3">
                    {/* toggle */}
                    <button
                      onClick={() =>
                        setOptions((prev) => ({
                          ...prev,
                          importAliasEnabled: !prev.importAliasEnabled,
                        }))
                      }
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-200 cursor-pointer group w-fit ${
                        options.importAliasEnabled
                          ? "border-zinc-500 bg-zinc-800/60 text-white"
                          : "border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                      }`}
                    >
                      <div
                        className={`w-8 h-4 rounded-full border flex items-center transition-all duration-200 shrink-0 ${
                          options.importAliasEnabled
                            ? "bg-white border-white"
                            : "bg-transparent border-zinc-600"
                        }`}
                      >
                        <motion.div
                          animate={{ x: options.importAliasEnabled ? 16 : 2 }}
                          transition={{
                            type: "spring",
                            mass: 0.5,
                            stiffness: 200,
                          }}
                          className={`w-3 h-3 rounded-full shrink-0 ${
                            options.importAliasEnabled
                              ? "bg-zinc-900"
                              : "bg-zinc-600"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="text-sm leading-none mb-0.5">
                          Customize import alias
                        </div>
                        <div className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">
                          Default is @/*
                        </div>
                      </div>
                    </button>

                    {/* text input (import alias) */}
                    <AnimatePresence>
                      {options.importAliasEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            type: "spring",
                            mass: 0.5,
                            stiffness: 140,
                          }}
                          className="flex items-center gap-3 overflow-hidden"
                        >
                          <input
                            type="text"
                            className="input input-sm bg-zinc-950 border border-zinc-700 focus:border-zinc-400 focus:outline-none text-zinc-100 rounded-lg w-40 font-mono transition-colors"
                            value={options.importAlias}
                            onChange={(e) =>
                              setOptions((prev) => ({
                                ...prev,
                                importAlias: e.target.value,
                              }))
                            }
                          />
                          <span className="text-xs text-zinc-600">
                            e.g.{" "}
                            <span className="text-zinc-400">
                              @/components/Button
                            </span>
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
              {/* empty state for frameworks with no scaffold options */}
              {visibleOptions.length === 0 &&
                selectedFramework !== "nextjs" && (
                  <div className="flex items-center gap-3 py-4">
                    <div className="w-1 h-8 rounded-full bg-zinc-800" />
                    <div>
                      <p className="text-sm text-zinc-400">
                        No scaffold options
                      </p>
                      <p className="text-xs text-zinc-600">
                        Additional features are available as packs below.
                      </p>
                    </div>
                  </div>
                )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
