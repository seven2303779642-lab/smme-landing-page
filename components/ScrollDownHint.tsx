"use client";

import { motion } from "framer-motion";
import { useSceneScroll } from "@/context/SceneScrollContext";

function DownArrow() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-[clamp(22px,2vw,30px)] w-[clamp(22px,2vw,30px)] text-white/55"
    >
      <path
        d="M8 2V13M8 13L4 9M8 13L12 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ScrollDownHint() {
  const { goNext } = useSceneScroll();

  return (
    <motion.button
      type="button"
      aria-label="Scroll down to next scene"
      onClick={() => goNext()}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: [0, 8, 0] }}
      transition={{
        opacity: { duration: 0.5 },
        y: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }}
      className="pointer-events-auto fixed bottom-[10vh] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-[clamp(14px,1.1vw,18px)] tracking-[0.24em] text-white/55 uppercase md:bottom-[7vh] md:tracking-[0.28em]"
    >
      <span>SCROLL DOWN</span>
      <DownArrow />
    </motion.button>
  );
}
