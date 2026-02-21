export const PACKS = [
  // ── Data Fetching ──────────────────────────────
  {
    id: "tanstack-query",
    name: "TanStack Query",
    desc: "Async state, caching & server data fetching",
    npm: "npm i @tanstack/react-query",
    category: "Data Fetching",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "tanstack-query-vue",
    name: "TanStack Query",
    desc: "Async state, caching & server data fetching for Vue",
    npm: "npm i @tanstack/vue-query",
    category: "Data Fetching",
    frameworks: ["vue", "nuxt"],
  },
  {
    id: "axios",
    name: "Axios",
    desc: "Promise-based HTTP client",
    npm: "npm i axios",
    category: "Data Fetching",
    frameworks: ["react", "nextjs", "vue", "nuxt"],
  },

  // ── State ──────────────────────────────────────
  {
    id: "zustand",
    name: "Zustand",
    desc: "Small, fast, scalable state management",
    npm: "npm i zustand",
    category: "State",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "jotai",
    name: "Jotai",
    desc: "Primitive and flexible atomic state",
    npm: "npm i jotai",
    category: "State",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "redux-toolkit",
    name: "Redux Toolkit",
    desc: "The official opinionated Redux toolset",
    npm: "npm i @reduxjs/toolkit react-redux",
    category: "State",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "pinia",
    name: "Pinia",
    desc: "The official intuitive Vue state manager",
    npm: "npm i pinia",
    category: "State",
    frameworks: ["vue", "nuxt"],
  },
  {
    id: "vuex",
    name: "Vuex",
    desc: "Legacy state management for Vue (prefer Pinia for new projects)",
    npm: "npm i vuex",
    category: "State",
    frameworks: ["vue", "nuxt"],
  },

  // ── Forms ──────────────────────────────────────
  {
    id: "react-hook-form",
    name: "React Hook Form",
    desc: "Performant, flexible & extensible forms",
    npm: "npm i react-hook-form",
    category: "Forms",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "zod",
    name: "Zod",
    desc: "TypeScript-first schema validation",
    npm: "npm i zod",
    category: "Forms",
    frameworks: ["react", "nextjs", "vue", "nuxt"],
  },
  {
    id: "vee-validate",
    name: "VeeValidate",
    desc: "Form validation for Vue with composables API",
    npm: "npm i vee-validate",
    category: "Forms",
    frameworks: ["vue", "nuxt"],
  },

  // ── Styling ────────────────────────────────────
  {
    id: "tailwind",
    name: "Tailwind CSS",
    desc: "Utility-first CSS framework",
    npm: "npm i tailwindcss @tailwindcss/vite",
    category: "Styling",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "tailwind-vue",
    name: "Tailwind CSS",
    desc: "Utility-first CSS framework",
    npm: "npm i tailwindcss @tailwindcss/vite",
    category: "Styling",
    frameworks: ["vue", "nuxt"],
  },
  {
    id: "motion",
    name: "Motion",
    desc: "Production-ready animation library",
    npm: "npm i motion",
    category: "Styling",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "vueuse-motion",
    name: "@vueuse/motion",
    desc: "Animations & motion directives powered by Motion One",
    npm: "npm i @vueuse/motion",
    category: "Styling",
    frameworks: ["vue", "nuxt"],
  },

  // ── UI ─────────────────────────────────────────
  {
    id: "shadcn",
    name: "shadcn/ui",
    desc: "Beautifully designed accessible components",
    npm: "npx shadcn@latest init",
    category: "UI",
    frameworks: ["react", "nextjs"],
    requires: "tailwind",
  },
  {
    id: "radix",
    name: "Radix UI",
    desc: "Unstyled, accessible headless UI primitives",
    npm: "npm i @radix-ui/react-dialog",
    category: "UI",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "mantine",
    name: "Mantine",
    desc: "Full-featured React component library",
    npm: "npm i @mantine/core @mantine/hooks",
    category: "UI",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "daisyui",
    name: "daisyUI",
    desc: "Component library built on Tailwind CSS",
    npm: "npm i daisyui",
    category: "UI",
    frameworks: ["react", "nextjs"],
    requires: "tailwind",
  },
  {
    id: "daisyui-vue",
    name: "daisyUI",
    desc: "Component library built on Tailwind CSS",
    npm: "npm i daisyui",
    category: "UI",
    frameworks: ["vue", "nuxt"],
    requires: "tailwind-vue",
  },
  {
    id: "shadcn-vue",
    name: "shadcn-vue",
    desc: "Community port of shadcn/ui for Vue",
    npm: "npx shadcn-vue@latest init",
    category: "UI",
    frameworks: ["vue", "nuxt"],
    requires: "tailwind-vue",
  },
  {
    id: "vuetify",
    name: "Vuetify",
    desc: "Material Design component library for Vue",
    npm: "npm i vuetify",
    category: "UI",
    frameworks: ["vue", "nuxt"],
  },
  {
    id: "primevue",
    name: "PrimeVue",
    desc: "Rich UI component library with 90+ components",
    npm: "npm i primevue",
    category: "UI",
    frameworks: ["vue", "nuxt"],
  },
  {
    id: "naive-ui",
    name: "Naive UI",
    desc: "TypeScript-first, clean Vue component library",
    npm: "npm i naive-ui",
    category: "UI",
    frameworks: ["vue", "nuxt"],
  },

  // ── Icons ──────────────────────────────────────
  {
    id: "lucide",
    name: "lucide-react",
    desc: "Clean, consistent open-source icon set",
    npm: "npm i lucide-react",
    category: "Icons",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "react-icons",
    name: "react-icons",
    desc: "All popular icon packs as React components",
    npm: "npm i react-icons",
    category: "Icons",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "lucide-vue",
    name: "lucide-vue-next",
    desc: "Clean, consistent open-source icon set for Vue",
    npm: "npm i lucide-vue-next",
    category: "Icons",
    frameworks: ["vue", "nuxt"],
  },
  {
    id: "unplugin-icons",
    name: "unplugin-icons",
    desc: "Auto-import any icon set on demand, Nuxt-friendly",
    npm: "npm i unplugin-icons",
    category: "Icons",
    frameworks: ["vue", "nuxt"],
  },

  // ── Charts & Tables ────────────────────────────
  {
    id: "recharts",
    name: "recharts",
    desc: "Composable chart library built with D3",
    npm: "npm i recharts",
    category: "Charts & Tables",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "tanstack-table",
    name: "TanStack Table",
    desc: "Headless UI for powerful data tables",
    npm: "npm i @tanstack/react-table",
    category: "Charts & Tables",
    frameworks: ["react", "nextjs"],
  },
  {
    id: "vue-chartjs",
    name: "vue-chartjs",
    desc: "Chart.js wrapper for Vue with reactive data",
    npm: "npm i vue-chartjs chart.js",
    category: "Charts & Tables",
    frameworks: ["vue", "nuxt"],
  },
  {
    id: "tanstack-table-vue",
    name: "TanStack Table",
    desc: "Headless UI for powerful data tables",
    npm: "npm i @tanstack/vue-table",
    category: "Charts & Tables",
    frameworks: ["vue", "nuxt"],
  },

  // ── Routing ────────────────────────────────────
  {
    id: "react-router",
    name: "React Router",
    desc: "Declarative routing for React SPAs",
    npm: "npm i react-router-dom",
    category: "Routing",
    frameworks: ["react"],
  },
  {
    id: "vue-router",
    name: "Vue Router",
    desc: "Official router for Vue SPAs",
    npm: "npm i vue-router",
    category: "Routing",
    frameworks: ["vue"],
  },

  // ── Auth ───────────────────────────────────────
  {
    id: "nextauth",
    name: "Auth.js",
    desc: "Authentication for Next.js apps",
    npm: "npm i next-auth",
    category: "Auth",
    frameworks: ["nextjs"],
  },
  {
    id: "clerk",
    name: "Clerk",
    desc: "Complete hosted user management & auth",
    npm: "npm i @clerk/nextjs",
    category: "Auth",
    frameworks: ["nextjs"],
  },
  {
    id: "nuxt-auth-utils",
    name: "Nuxt Auth Utils",
    desc: "Lightweight auth helpers & session management for Nuxt",
    npm: "npm i nuxt-auth-utils",
    category: "Auth",
    frameworks: ["nuxt"],
  },
  {
    id: "sidebase-auth",
    name: "sidebase nuxt-auth",
    desc: "NextAuth-style authentication module for Nuxt",
    npm: "npm i @sidebase/nuxt-auth",
    category: "Auth",
    frameworks: ["nuxt"],
  },

  // ── Database ───────────────────────────────────
  {
    id: "prisma",
    name: "Prisma",
    desc: "Next-gen TypeScript ORM for Node.js",
    npm: "npm i prisma @prisma/client",
    category: "Database",
    frameworks: ["nextjs", "nuxt"],
  },
  {
    id: "drizzle",
    name: "Drizzle ORM",
    desc: "Lightweight ORM with SQL-like syntax",
    npm: "npm i drizzle-orm",
    category: "Database",
    frameworks: ["nextjs", "nuxt"],
  },
];

import {
  TbCloudDownload,
  TbAtom,
  TbForms,
  TbLayout,
  TbBrush,
  TbIcons,
  TbChartBar,
  TbRoute,
  TbShieldLock,
  TbDatabase,
} from "react-icons/tb";

// ── Category icons ─────────────────────────────────────────────────────────

export const CATEGORY_ICONS = {
  "Data Fetching": TbCloudDownload,
  State: TbAtom,
  Forms: TbForms,
  Styling: TbBrush,
  UI: TbLayout,
  Icons: TbIcons,
  "Charts & Tables": TbChartBar,
  Routing: TbRoute,
  Auth: TbShieldLock,
  Database: TbDatabase,
};

// ── Install command converter ──────────────────────────────────────────────

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
