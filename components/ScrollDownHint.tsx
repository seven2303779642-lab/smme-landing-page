"use client";

import { motion } from "framer-motion";
import { useSceneScroll } from "@/context/SceneScrollContext";

function DownArrow() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-[clamp(28px,2.8vw,40px)] w-[clamp(28px,2.8vw,40px)] text-white/60"
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
  const { currentIndex, goNext } = useSceneScroll();

  if (currentIndex !== 0) {
    return null;
  }

  return (
    <motion.button
      type="button"
      aria-label="Scroll down to next scene"
      onClick={() => goNext()}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: [0, 10, 0] }}
      transition={{
        opacity: { duration: 0.5 },
        y: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }}
      className="pointer-events-auto fixed bottom-[14vh] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3 text-[clamp(18px,1.6vw,24px)] tracking-[0.32em] text-white/60 uppercase md:bottom-[12vh] md:tracking-[0.36em]"
    >
      <span>SCROLL DOWN</span>
      <DownArrow />
    </motion.button>
  );
}
