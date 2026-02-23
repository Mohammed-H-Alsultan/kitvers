import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PACKS, convertInstallCmd } from "../../data/packsData";
import { CATEGORY_ICONS } from "../../data/packIcons";
import { LuPackageX } from "react-icons/lu";

export default function ProjectPacks({
  selectedFramework = "react",
  selectedPacks,
  setSelectedPacks,
  packageManager = "npm",
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredNpm, setHoveredNpm] = useState(null);

  // reset category filter when framework changes
  useEffect(() => {
    setActiveCategory("All");
  }, [selectedFramework]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setTimeout(() => {
      document
        .getElementById("packs-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 550);
  };

  const togglePack = (id) => {
    const pack = PACKS.find((p) => p.id === id);

    setSelectedPacks((prev) => {
      const next = new Set(prev);

      const requires = Array.isArray(pack?.requires) ? pack.requires : [];
      const isSelected = next.has(id);

      if (isSelected) {
        next.delete(id);

        PACKS.forEach((p) => {
          const reqs = Array.isArray(p.requires) ? p.requires : [];
          if (reqs.includes(id)) next.delete(p.id);
        });

        return next;
      }

      for (const req of requires) next.add(req);

      next.add(id);

      return next;
    });
  };

  const frameworkPacks = PACKS.filter((p) =>
    p.frameworks.includes(selectedFramework),
  );

  const availableCategories = [
    "All",
    ...Object.keys(CATEGORY_ICONS).filter((cat) =>
      frameworkPacks.some((p) => p.category === cat),
    ),
  ];

  const filtered = frameworkPacks.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const grouped = filtered.reduce((acc, pack) => {
    if (!acc[pack.category]) acc[pack.category] = [];
    acc[pack.category].push(pack);
    return acc;
  }, {});

  const selectedCount = selectedPacks?.size ?? 0;

  return (
    <section
      id="packs-section"
      className="flex flex-col justify-center items-center mt-10 mb-20"
    >
      <div className="flex flex-col w-3xl justify-center items-center">
        {/* header */}
        <div className="divider divider-start font-mono w-full">
          Packs
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", mass: 0.5, stiffness: 200 }}
                className="ml-2 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-xs border border-zinc-700"
              >
                {selectedCount} selected
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-[#0e0e0e] border border-zinc-800 rounded-xl w-full font-mono overflow-hidden">
          {/* search + categories */}
          <div className="p-4 border-b border-zinc-800 space-y-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10.5 10.5L13 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="search packs…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveCategory("All");
                }}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-zinc-300 placeholder-zinc-700 rounded-lg pl-9 pr-8 py-2 text-sm transition-colors"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors text-sm"
                  >
                    ✕
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* category pills */}
            <div className="flex gap-1.5 flex-wrap">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border transition-all duration-150 cursor-pointer ${
                    activeCategory === cat
                      ? "border-zinc-500 bg-zinc-800 text-zinc-200"
                      : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                  }`}
                >
                  {cat !== "All" &&
                    (() => {
                      const Icon = CATEGORY_ICONS[cat];
                      return Icon ? <Icon size={15} /> : null;
                    })()}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* pack list */}
          <div className="p-4 max-h-120 overflow-y-auto">
            <AnimatePresence mode="wait">
              {Object.keys(grouped).length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-14 gap-2"
                >
                  <LuPackageX className="text-zinc-600" size={50} />
                  <p className="text-sm text-zinc-600">No packs found</p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategory + search + selectedFramework}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    type: "spring",
                    mass: 0.4,
                    stiffness: 200,
                    damping: 20,
                  }}
                  className="space-y-5"
                >
                  {Object.entries(grouped).map(([category, packs]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-zinc-700">
                          {(() => {
                            const Icon = CATEGORY_ICONS[category];
                            return Icon ? <Icon size={15} /> : null;
                          })()}
                        </span>
                        <span className="text-xs tracking-widest text-zinc-600 uppercase">
                          {category}
                        </span>
                        <div className="flex-1 h-px bg-zinc-900" />
                      </div>

                      <div className="space-y-1">
                        {packs.map((pack) => {
                          const isSelected = selectedPacks?.has(pack.id);
                          const reqs = Array.isArray(pack.requires)
                            ? pack.requires
                            : [];
                          const isDisabled =
                            reqs.length > 0 &&
                            reqs.some((r) => !selectedPacks?.has(r));

                          return (
                            <motion.div
                              key={pack.id}
                              layout
                              onClick={() => !isDisabled && togglePack(pack.id)}
                              onMouseEnter={() => setHoveredNpm(pack.id)}
                              onMouseLeave={() => setHoveredNpm(null)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-150 group ${
                                isDisabled
                                  ? "border-zinc-900 opacity-30 cursor-not-allowed"
                                  : isSelected
                                    ? "border-zinc-600 bg-zinc-800/50 cursor-pointer"
                                    : "border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/40 cursor-pointer"
                              }`}
                            >
                              {/* checkbox */}
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? "border-zinc-300 bg-zinc-300"
                                    : "border-zinc-700"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-2.5 h-2.5 text-zinc-900"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                  >
                                    <path
                                      d="M1.5 5L4 7.5L8.5 2.5"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </div>

                              {/* text */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span
                                    className={`text-sm transition-colors ${isSelected ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-300"}`}
                                  >
                                    {pack.name}
                                  </span>
                                  {pack.popular && (
                                    <span className="text-[9px] tracking-widest text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded-md uppercase">
                                      popular
                                    </span>
                                  )}
                                  {Array.isArray(pack.requires) &&
                                    pack.requires.length > 0 && (
                                      <span className="text-[9px] tracking-widest text-sky-400 border border-sky-900 bg-sky-950/50 px-1.5 py-0.5 rounded-md uppercase">
                                        needs{" "}
                                        {pack.requires
                                          .map(
                                            (rid) =>
                                              PACKS.find((p) => p.id === rid)
                                                ?.name ?? rid,
                                          )
                                          .join(", ")}
                                      </span>
                                    )}
                                </div>
                                <div className="text-xs truncate h-4 relative overflow-hidden">
                                  <AnimatePresence mode="wait">
                                    {hoveredNpm === pack.id ? (
                                      <motion.span
                                        key="npm"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.12 }}
                                        className="text-zinc-500"
                                      >
                                        {convertInstallCmd(
                                          pack.npm,
                                          packageManager,
                                        )}
                                      </motion.span>
                                    ) : (
                                      <motion.span
                                        key="desc"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.12 }}
                                        className="text-zinc-700 group-hover:text-zinc-600"
                                      >
                                        {pack.desc}
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* selected chips footer */}
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", mass: 0.5, stiffness: 140 }}
                className="border-t border-zinc-800 px-4 py-3 flex items-center gap-2 flex-wrap overflow-hidden"
              >
                <span className="text-[10px] tracking-widest text-zinc-600 uppercase">
                  selected
                </span>
                {[...(selectedPacks ?? [])].map((id) => {
                  const pack = PACKS.find((p) => p.id === id);
                  return pack ? (
                    <motion.span
                      key={id}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ type: "spring", mass: 0.4, stiffness: 200 }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs"
                    >
                      {pack.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePack(id);
                        }}
                        className="text-zinc-600 hover:text-zinc-300 transition-colors leading-none"
                      >
                        ✕
                      </button>
                    </motion.span>
                  ) : null;
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
