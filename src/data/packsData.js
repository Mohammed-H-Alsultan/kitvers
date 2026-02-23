// ── Packs ───────────────────────────────────────────────────────────────────
export const PACKS = [
  {
    id: "tanstack-query",
    name: "TanStack Query",
    desc: "Async state, caching & server data fetching",
    category: "Data Fetching",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["@tanstack/react-query"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@tanstack/react-query"],
    },
    npm: "npm i @tanstack/react-query",
  },
  {
    id: "tanstack-query-vue",
    name: "TanStack Query",
    desc: "Async state, caching & server data fetching for Vue",
    category: "Data Fetching",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["@tanstack/vue-query"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@tanstack/vue-query"],
    },
    npm: "npm i @tanstack/vue-query",
  },
  {
    id: "axios",
    name: "Axios",
    desc: "Promise-based HTTP client",
    category: "Data Fetching",
    frameworks: ["react", "nextjs", "vue", "nuxt"],
    requires: [],
    install: {
      deps: ["axios"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["axios"],
    },
    npm: "npm i axios",
  },
  {
    id: "zustand",
    name: "Zustand",
    desc: "Small, fast, scalable state management",
    category: "State",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["zustand"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["zustand"],
    },
    npm: "npm i zustand",
  },
  {
    id: "jotai",
    name: "Jotai",
    desc: "Primitive and flexible state management",
    category: "State",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["jotai"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["jotai"],
    },
    npm: "npm i jotai",
  },
  {
    id: "redux-toolkit",
    name: "Redux Toolkit",
    desc: "The official opinionated Redux toolset",
    category: "State",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["@reduxjs/toolkit", "react-redux"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@reduxjs/toolkit", "react-redux"],
    },
    npm: "npm i @reduxjs/toolkit react-redux",
  },
  {
    id: "pinia",
    name: "Pinia",
    desc: "The intuitive store for Vue",
    category: "State",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["pinia"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["pinia"],
    },
    npm: "npm i pinia",
  },
  {
    id: "vuex",
    name: "Vuex",
    desc: "State management pattern + library for Vue",
    category: "State",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["vuex"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["vuex"],
    },
    npm: "npm i vuex",
  },
  {
    id: "react-hook-form",
    name: "React Hook Form",
    desc: "Performant forms with easy validation",
    category: "Forms",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["react-hook-form"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["react-hook-form"],
    },
    npm: "npm i react-hook-form",
  },
  {
    id: "zod",
    name: "Zod",
    desc: "TypeScript-first schema validation",
    category: "Forms",
    frameworks: ["react", "nextjs", "vue", "nuxt"],
    requires: [],
    install: {
      deps: ["zod"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["zod"],
    },
    npm: "npm i zod",
  },
  {
    id: "vee-validate",
    name: "VeeValidate",
    desc: "Form validation library for Vue",
    category: "Forms",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["vee-validate"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["vee-validate"],
    },
    npm: "npm i vee-validate",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    desc: "Utility-first CSS framework",
    category: "Styling",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["tailwindcss", "@tailwindcss/vite"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["tailwindcss", "@tailwindcss/vite"],
    },
    npm: "npm i tailwindcss @tailwindcss/vite",
  },
  {
    id: "tailwind-vue",
    name: "Tailwind CSS",
    desc: "Utility-first CSS framework for Vue",
    category: "Styling",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["tailwindcss", "@tailwindcss/vite"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["tailwindcss", "@tailwindcss/vite"],
    },
    npm: "npm i tailwindcss @tailwindcss/vite",
  },
  {
    id: "motion",
    name: "Framer Motion",
    desc: "Production-ready motion library for React",
    category: "Styling",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["framer-motion"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["framer-motion"],
    },
    npm: "npm i framer-motion",
  },
  {
    id: "vueuse-motion",
    name: "VueUse Motion",
    desc: "Motion and transitions for Vue",
    category: "Styling",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["@vueuse/motion"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@vueuse/motion"],
    },
    npm: "npm i @vueuse/motion",
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    desc: "Beautifully designed accessible components",
    category: "UI",
    frameworks: ["react", "nextjs"],
    requires: ["tailwind"],
    install: {
      deps: [],
      devDeps: [],
      commands: [
        {
          kind: "dlx",
          cmd: "shadcn@latest init",
        },
      ],
    },
    detects: {},
    npm: "npx shadcn@latest init",
  },
  {
    id: "radix",
    name: "Radix UI",
    desc: "Unstyled accessible components",
    category: "UI",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["@radix-ui/react-slot"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@radix-ui/react-slot"],
    },
    npm: "npm i @radix-ui/react-slot",
  },
  {
    id: "mantine",
    name: "Mantine",
    desc: "React components library",
    category: "UI",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["@mantine/core", "@mantine/hooks"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@mantine/core", "@mantine/hooks"],
    },
    npm: "npm i @mantine/core @mantine/hooks",
  },
  {
    id: "daisyui",
    name: "daisyUI",
    desc: "Tailwind component library",
    category: "UI",
    frameworks: ["react", "nextjs"],
    requires: ["tailwind"],
    install: {
      deps: ["daisyui"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["daisyui"],
    },
    npm: "npm i daisyui",
  },
  {
    id: "daisyui-vue",
    name: "daisyUI",
    desc: "Tailwind component library for Vue",
    category: "UI",
    frameworks: ["vue", "nuxt"],
    requires: ["tailwind-vue"],
    install: {
      deps: ["daisyui"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["daisyui"],
    },
    npm: "npm i daisyui",
  },
  {
    id: "shadcn-vue",
    name: "shadcn-vue",
    desc: "shadcn/ui port for Vue",
    category: "UI",
    frameworks: ["vue", "nuxt"],
    requires: ["tailwind-vue"],
    install: {
      deps: [],
      devDeps: [],
      commands: [
        {
          kind: "dlx",
          cmd: "shadcn-vue@latest init",
        },
      ],
    },
    detects: {},
    npm: "npx shadcn-vue@latest init",
  },
  {
    id: "vuetify",
    name: "Vuetify",
    desc: "Material Design component framework for Vue",
    category: "UI",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["vuetify"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["vuetify"],
    },
    npm: "npm i vuetify",
  },
  {
    id: "primevue",
    name: "PrimeVue",
    desc: "Rich set of UI components for Vue",
    category: "UI",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["primevue"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["primevue"],
    },
    npm: "npm i primevue",
  },
  {
    id: "naive-ui",
    name: "Naive UI",
    desc: "Vue 3 component library",
    category: "UI",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["naive-ui"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["naive-ui"],
    },
    npm: "npm i naive-ui",
  },
  {
    id: "lucide",
    name: "Lucide Icons",
    desc: "Beautiful open-source icons",
    category: "Icons",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["lucide-react"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["lucide-react"],
    },
    npm: "npm i lucide-react",
  },
  {
    id: "react-icons",
    name: "React Icons",
    desc: "Popular icons for React",
    category: "Icons",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["react-icons"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["react-icons"],
    },
    npm: "npm i react-icons",
  },
  {
    id: "lucide-vue",
    name: "Lucide Icons",
    desc: "Beautiful open-source icons for Vue",
    category: "Icons",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["lucide-vue-next"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["lucide-vue-next"],
    },
    npm: "npm i lucide-vue-next",
  },
  {
    id: "unplugin-icons",
    name: "unplugin-icons",
    desc: "Use icons as components on-demand",
    category: "Icons",
    frameworks: ["react", "nextjs", "vue", "nuxt"],
    requires: [],
    install: {
      deps: ["unplugin-icons"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["unplugin-icons"],
    },
    npm: "npm i unplugin-icons",
  },
  {
    id: "recharts",
    name: "Recharts",
    desc: "Chart library built with React and D3",
    category: "Charts & Tables",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["recharts"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["recharts"],
    },
    npm: "npm i recharts",
  },
  {
    id: "tanstack-table",
    name: "TanStack Table",
    desc: "Headless table and datagrid toolkit for React",
    category: "Charts & Tables",
    frameworks: ["react", "nextjs"],
    requires: [],
    install: {
      deps: ["@tanstack/react-table"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@tanstack/react-table"],
    },
    npm: "npm i @tanstack/react-table",
  },
  {
    id: "vue-chartjs",
    name: "vue-chartjs",
    desc: "Chart.js wrapper for Vue",
    category: "Charts & Tables",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["vue-chartjs", "chart.js"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["vue-chartjs", "chart.js"],
    },
    npm: "npm i vue-chartjs chart.js",
  },
  {
    id: "tanstack-table-vue",
    name: "TanStack Table",
    desc: "Headless table and datagrid toolkit for Vue",
    category: "Charts & Tables",
    frameworks: ["vue", "nuxt"],
    requires: [],
    install: {
      deps: ["@tanstack/vue-table"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@tanstack/vue-table"],
    },
    npm: "npm i @tanstack/vue-table",
  },
  {
    id: "react-router",
    name: "React Router",
    desc: "Declarative routing for React",
    category: "Routing",
    frameworks: ["react"],
    requires: [],
    install: {
      deps: ["react-router-dom"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["react-router-dom"],
    },
    npm: "npm i react-router-dom",
  },
  {
    id: "vue-router",
    name: "Vue Router",
    desc: "Official router for Vue",
    category: "Routing",
    frameworks: ["vue"],
    requires: [],
    install: {
      deps: ["vue-router"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["vue-router"],
    },
    npm: "npm i vue-router",
  },
  {
    id: "nextauth",
    name: "NextAuth.js",
    desc: "Authentication for Next.js",
    category: "Auth",
    frameworks: ["nextjs"],
    requires: [],
    install: {
      deps: ["next-auth"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["next-auth"],
    },
    npm: "npm i next-auth",
  },
  {
    id: "clerk",
    name: "Clerk",
    desc: "Authentication & user management",
    category: "Auth",
    frameworks: ["nextjs"],
    requires: [],
    install: {
      deps: ["@clerk/nextjs"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@clerk/nextjs"],
    },
    npm: "npm i @clerk/nextjs",
  },
  {
    id: "nuxt-auth-utils",
    name: "nuxt-auth-utils",
    desc: "Auth utilities for Nuxt",
    category: "Auth",
    frameworks: ["nuxt"],
    requires: [],
    install: {
      deps: ["nuxt-auth-utils"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["nuxt-auth-utils"],
    },
    npm: "npm i nuxt-auth-utils",
  },
  {
    id: "sidebase-auth",
    name: "sidebase/nuxt-auth",
    desc: "Auth module for Nuxt",
    category: "Auth",
    frameworks: ["nuxt"],
    requires: [],
    install: {
      deps: ["@sidebase/nuxt-auth"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["@sidebase/nuxt-auth"],
    },
    npm: "npm i @sidebase/nuxt-auth",
  },
  {
    id: "prisma",
    name: "Prisma",
    desc: "Next-generation ORM for Node.js and TypeScript",
    category: "Database",
    frameworks: ["nextjs", "nuxt"],
    requires: [],
    install: {
      deps: ["prisma"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["prisma"],
    },
    npm: "npm i prisma",
  },
  {
    id: "drizzle",
    name: "Drizzle ORM",
    desc: "Lightweight ORM with SQL-like syntax",
    category: "Database",
    frameworks: ["nextjs", "nuxt"],
    requires: [],
    install: {
      deps: ["drizzle-orm"],
      devDeps: [],
      commands: [],
    },
    detects: {
      deps: ["drizzle-orm"],
    },
    npm: "npm i drizzle-orm",
  },
];

// ── Package manager command map ─────────────────────────────────────────────

const PM = {
  npm: { add: "npm i", addDev: "npm i -D", dlx: "npx" },
  pnpm: { add: "pnpm add", addDev: "pnpm add -D", dlx: "pnpm dlx" },
  yarn: { add: "yarn add", addDev: "yarn add -D", dlx: "yarn dlx" },
  bun: { add: "bun add", addDev: "bun add -d", dlx: "bunx" },
};

// ── Engine helpers ──────────────────────────────────────────────────────────

export function buildPackCommands(pack, packageManager = "npm") {
  const cfg = PM[packageManager] ?? PM.npm;
  const install = pack?.install ?? { deps: [], devDeps: [], commands: [] };

  const out = [];

  if (install.deps?.length) out.push(`${cfg.add} ${install.deps.join(" ")}`);
  if (install.devDeps?.length)
    out.push(`${cfg.addDev} ${install.devDeps.join(" ")}`);

  for (const c of install.commands ?? []) {
    if (c.kind === "dlx") out.push(`${cfg.dlx} ${c.cmd}`);
    if (c.kind === "shell") out.push(c.cmd);
  }

  return out;
}

export function resolvePackOrder(selectedPackIds) {
  const selected = new Set(selectedPackIds ?? []);
  const byId = new Map(PACKS.map((p) => [p.id, p]));

  const ordered = [];
  const visiting = new Set();
  const visited = new Set();

  function visit(id) {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      throw new Error(`Circular pack dependency detected at: ${id}`);
    }

    const pack = byId.get(id);
    if (!pack) throw new Error(`Unknown pack id: ${id}`);

    visiting.add(id);

    for (const req of pack.requires ?? []) {
      if (!selected.has(req)) {
        throw new Error(`Pack "${id}" requires "${req}"`);
      }
      visit(req);
    }

    visiting.delete(id);
    visited.add(id);
    ordered.push(id);
  }

  for (const p of PACKS) {
    if (selected.has(p.id)) visit(p.id);
  }

  return ordered;
}

// ── Legacy helper (UI compatibility) ────────────────────────────────────────

export function convertInstallCmd(cmd, pm) {
  if (pm === "npm") return cmd;

  if (cmd.startsWith("npx ")) {
    const rest = cmd.slice(4);
    if (pm === "pnpm") return `pnpm dlx ${rest}`;
    if (pm === "yarn") return `yarn dlx ${rest}`;
    if (pm === "bun") return `bunx ${rest}`;
  }

  if (cmd.startsWith("npm i ")) {
    const packages = cmd.slice(6);
    if (pm === "pnpm") return `pnpm add ${packages}`;
    if (pm === "yarn") return `yarn add ${packages}`;
    if (pm === "bun") return `bun add ${packages}`;
  }

  return cmd;
}
