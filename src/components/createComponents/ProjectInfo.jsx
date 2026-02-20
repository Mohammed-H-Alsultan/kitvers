import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";

export default function ProjectInfo() {
  // states
  const [projectPath, setProjectPath] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("nextjs");

  // borwse function
  const handleBrowse = async () => {
    const path = await open({ directory: true, multiple: false });
    if (path) setProjectPath(path);
  };

  // radio data
  const frameworks = [
    { id: "nextjs", label: "Next.js" },
    { id: "vite", label: "Vite + React" },
    { id: "vue", label: "Vue" },
  ];

  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <div className="flex flex-col w-3xl justify-center items-center">
        <div className="divider divider-start font-mono">Project info</div>
      </div>

      <div className="card bg-base-300 border border-zinc-700 rounded-lg p-6 space-y-5 flex flex-col justify-center items-center w-3xl">
        <fieldset className="font-mono flex flex-col justify-start items-center">
          {/* project name input */}
          <label className="label w-lg mb-1">Project name</label>
          <input
            type="text"
            className="input w-lg focus:outline-none"
            name="project_name"
            placeholder="untitled project"
          />
          {/* project path input */}
          <label className="label w-lg mt-10 mb-1">Project path</label>
          <div className="join">
            <input
              type="text"
              className="input join-item w-100 focus:outline-none"
              placeholder="/Users/you/project..."
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
            />
            <button
              className="btn join-item bg-white text-black"
              onClick={handleBrowse}
            >
              Browse...
            </button>
          </div>
          {/* framework inputs */}
          <label className="label w-lg mt-10 mb-3">Framework</label>
          <div className="flex gap-3">
            {frameworks.map(({ id, label }) => {
              const isSelected = selectedFramework === id;
              return (
                <div
                  key={id}
                  onClick={() => setSelectedFramework(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all select-none text-sm ${
                    isSelected
                      ? "bg-[#2b2b2b] text-white"
                      : "bg-[#111111] border-[#292929] hover:border-zinc-500"
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
          {/* package manger inputs */}
          <label className="label w-lg mt-10">
            Package Manager
            <select
              defaultValue="npm"
              className="select outline-none focus:outline-none focus:ring-0 focus:shadow-none"
            >
              <option disabled={true}>Pick a Package Manager</option>
              <option>npm</option>
              <option>pnpm</option>
              <option>yarn</option>
              <option>bun</option>
            </select>
          </label>
        </fieldset>
      </div>
    </section>
  );
}
