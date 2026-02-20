import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

export default function AnimatedLink({ to }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.1, y: -1 }}
        whileTap={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, ease: "easeIn"}}
        style={{ display: "inline-flex" }}
      >
        <MdOutlineKeyboardBackspace size={35} />
      </motion.div>
    </Link>
  );
}
