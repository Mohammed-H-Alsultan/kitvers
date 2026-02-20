import { motion, useAnimate } from "motion/react";
import { FaReact, FaIcons, FaVuejs } from "react-icons/fa";
import { RiNextjsLine } from "react-icons/ri";
import { TbBrandVite } from "react-icons/tb";
import { SiReactrouter } from "react-icons/si";

// handle anamiation for each card
function Card({ item }) {
  const [scope, animate] = useAnimate();

  const handleHoverStart = () => {
    animate(".icon", { rotate: 360 }, { duration: 0.5, ease: "easeInOut" });
    animate(
      scope.current,
      { scale: 1.2, y: -3, color: item.hoverColor },
      { type: "spring", stiffness: 200 },
    );
  };

  const handleHoverEnd = () => {
    animate(".icon", { rotate: 0 }, { duration: 0.5, ease: "easeInOut" });
    animate(
      scope.current,
      { scale: 1, y: 0, color: "#474747" },
      { type: "spring", stiffness: 300 },
    );
  };

  return (
    <motion.div
      ref={scope}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className="flex items-center p-2 rounded-lg cursor-pointer"
      style={{ color: "#474747" }}
    >
      {/* target for rotation, currentColor inherits from parent */}
      <span className="icon" style={{ display: "flex" }}>
        <item.Icon size={20} color="currentColor" />
      </span>
      <span className="ml-2 text-md">{item.name}</span>
    </motion.div>
  );
}

export default function FooterCards() {
  // dataset (icons are component ref not JSX)
  const data = [
    { name: "React", Icon: FaReact, hoverColor: "#61DAFB" },
    { name: "Next.js", Icon: RiNextjsLine, hoverColor: "#ffffff" },
    { name: "Vue", Icon: FaVuejs, hoverColor: "#42b883" },
    { name: "Vite", Icon: TbBrandVite, hoverColor: "#646CFF" },
    { name: "React-Icons", Icon: FaIcons, hoverColor: "#e63946" },
    { name: "React-Router", Icon: SiReactrouter, hoverColor: "#F44250" },
  ];

  return (
    <div className="flex gap-3">
      {data.map((item) => (
        <Card key={item.name} item={item} />
      ))}
    </div>
  );
}
