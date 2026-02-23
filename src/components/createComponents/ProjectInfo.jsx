import { open } from "@tauri-apps/plugin-dialog";

export default function ProjectInfo({
  projectName,
  setProjectName,
  projectPath,
  setProjectPath,
  selectedFramework,
  setSelectedFramework,
  packageManager,
  setPackageManager,
}) {
  const handleBrowse = async () => {
    const path = await open({ directory: true, multiple: false });
    if (path) setProjectPath(path);
  };

  const frameworks = [
    { id: "nextjs", label: "Next.js (React)" },
    { id: "nuxt", label: "Nuxt (Vue)" },
    { id: "react", label: "Vite + React" },
    { id: "vue", label: "Vite + Vue" },
  ];

  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <div className="flex flex-col w-3xl justify-center items-center">
        <div className="divider divider-start font-mono">Project info</div>
      </div>

      <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl p-6 space-y-5 flex flex-col justify-center items-center w-3xl">
        <fieldset className="font-mono text-sm text-zinc-400 flex flex-col justify-start items-center">
          {/* project name input */}
          <label className="label w-xl mb-2">Project name</label>
          <input
            type="text"
            className="input w-xl focus:outline-none border-zinc-500 bg-zinc-800/60"
            name="project_name"
            placeholder="untitled project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          {/* project path input */}
          <label className="label w-xl mt-10 mb-3">Project path</label>
          <div className="join">
            <input
              type="text"
              className="input join-item w-120 focus:outline-none border-zinc-500 bg-zinc-800/60"
              placeholder="/Users/you/project..."
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
            />
            <button
              type="button"
              className="btn join-item bg-white text-black"
              onClick={handleBrowse}
            >
              Browse...
            </button>
          </div>

          {/* framework inputs */}
          <label className="label w-xl mt-10 mb-3">Framework</label>
          <div className="flex flex-wrap w-xl gap-3">
            {frameworks.map(({ id, label }) => {
              const isSelected = selectedFramework === id;
              return (
                <div
                  key={id}
                  onClick={() => setSelectedFramework(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all select-none text-sm ${
                    isSelected
                      ? "border-zinc-500 bg-zinc-800/60 text-white"
                      : "border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="framework"
                    className="radio radio-xs"
                    checked={isSelected}
                    onChange={() => setSelectedFramework(id)}
                  />
                  <label className="label ml-1 cursor-pointer">{label}</label>
                </div>
              );
            })}
          </div>

          {/* package manager input */}
          <label className="label w-xl mt-10">
            Package Manager
            <select
              value={packageManager}
              onChange={(e) => setPackageManager(e.target.value)}
              className="select outline-none focus:outline-none focus:ring-0 focus:shadow-none cursor-pointer text-white"
            >
              <option disabled value="">
                Pick a Package Manager
              </option>
              <option value="npm">npm</option>
              <option value="pnpm">pnpm</option>
              <option value="yarn">yarn</option>
              <option value="bun">bun</option>
            </select>
          </label>
        </fieldset>
      </div>
    </section>
  );
}
