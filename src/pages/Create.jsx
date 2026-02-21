import { useState } from "react";
import AnimatedLink from "../components/animatedComponents/AnimatedLink";
import ProjectInfo from "../components/createComponents/ProjectInfo";
import ProjectOptions from "../components/createComponents/ProjectOptions";

export default function create() {
  const [selectedFramework, setSelectedFramework] = useState("nextjs");
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");
  const [options, setOptions] = useState({
    eslint: true,
    srcDir: false,
    appRouter: true,
    turbopack: true,
    importAlias: "@/*",
  });

  //   these defaults are just for now they could be changed later to be more specific to the framework :)
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
  };

  return (
    <main className="p-6">
      <AnimatedLink to={"/"} />
      <div className="p-5 mt-3">
        <h1 className="text-4xl font-jetbrains font-bold">
          KitVers Create Project...
        </h1>
      </div>
      <ProjectInfo
        selectedFramework={selectedFramework}
        setSelectedFramework={handleFrameworkChange}
      />
      <ProjectOptions
        selectedFramework={selectedFramework}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        options={options}
        setOptions={setOptions}
      />
    </main>
  );
}
