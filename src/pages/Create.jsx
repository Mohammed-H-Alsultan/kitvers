import { useState } from "react";
import AnimatedLink from "../components/animatedComponents/AnimatedLink";
import ProjectInfo from "../components/createComponents/ProjectInfo";
import ProjectOptions from "../components/createComponents/ProjectOptions";
import ProjectPacks from "../components/createComponents/ProjectPacks";
import ProjectFooter from "../components/createComponents/ProjecFooter";

export default function create() {
  const [selectedFramework, setSelectedFramework] = useState("nextjs");
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");
  const [packageManager, setPackageManager] = useState("npm");
  const [selectedPacks, setSelectedPacks] = useState(new Set());
  const [options, setOptions] = useState({
    eslint: true,
    srcDir: false,
    appRouter: true,
    turbopack: true,
    importAlias: "@/*",
  });

  const FRAMEWORK_DEFAULTS = {
    nextjs: {
      eslint: true,
      srcDir: false,
      appRouter: true,
      turbopack: true,
      importAliasEnabled: false,
      importAlias: "@/*",
    },
    react: {},
    vue: {
      jsx: false,
      vueRouter: false,
      pinia: false,
      vitest: false,
      cypress: false,
      eslint: true,
      prettier: false,
    },
    nuxt: {
      eslint: true,
      prettier: false,
      renderingMode: false,
      deployTarget: false,
      jest: false,
    },
  };

  const LANGUAGE_DEFAULTS = {
    nextjs: "typescript",
    react: "javascript",
    vue: "javascript",
    nuxt: "typescript",
  };

  const handleFrameworkChange = (fw) => {
    setSelectedFramework(fw);
    setOptions(FRAMEWORK_DEFAULTS[fw]);
    setSelectedLanguage(LANGUAGE_DEFAULTS[fw]);
    setSelectedPacks(new Set());
  };

  const handleReset = () => {
    setSelectedLanguage(LANGUAGE_DEFAULTS[selectedFramework]);
    setPackageManager("npm");
    setSelectedPacks(new Set());
    setOptions(FRAMEWORK_DEFAULTS[selectedFramework]);
  };

  return (
    <main>
      <div className="p-6">
        <AnimatedLink to={"/"} />
      </div>
      <div className="p-5 mt-3 text-center">
        <h1 className="text-4xl font-jetbrains font-bold">
          KitVers Create Project...
        </h1>
      </div>
      <ProjectInfo
        selectedFramework={selectedFramework}
        setSelectedFramework={handleFrameworkChange}
        packageManager={packageManager}
        setPackageManager={setPackageManager}
      />
      <ProjectOptions
        selectedFramework={selectedFramework}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        options={options}
        setOptions={setOptions}
      />

      <ProjectPacks
        selectedFramework={selectedFramework}
        selectedPacks={selectedPacks}
        setSelectedPacks={setSelectedPacks}
        packageManager={packageManager}
      />

      <ProjectFooter onReset={handleReset} />
    </main>
  );
}
