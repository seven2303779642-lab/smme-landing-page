"use client";

import { useLayoutEffect, useRef } from "react";
import { scenes } from "@/data/scenes";
import { useSceneScroll } from "@/context/SceneScrollContext";

type SceneIndicatorProps = {
  sceneCount: number;
};

export default function SceneIndicator({ sceneCount }: SceneIndicatorProps) {
  const { currentIndex, goTo } = useSceneScroll();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lineTopRef = useRef(0);
  const lineRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const updateLinePosition = () => {
      const activeButton = buttonRefs.current[currentIndex];

      if (!activeButton || !lineRef.current) {
        return;
      }

      lineTopRef.current =
        activeButton.offsetTop + activeButton.offsetHeight / 2;
      lineRef.current.style.transform = `translateY(${lineTopRef.current}px)`;
    };

    updateLinePosition();
    window.addEventListener("resize", updateLinePosition);

    return () => window.removeEventListener("resize", updateLinePosition);
  }, [currentIndex]);

  const activeScene = scenes[currentIndex];
  const isActiveGold = activeScene?.accent === "gold";

  return (
    <aside
      aria-label="Scene navigation"
      className="fixed top-0 right-0 z-40 hidden h-screen w-12 bg-black md:flex md:w-[88px]"
    >
      <nav className="relative flex w-full flex-col items-center justify-center gap-8">
        <span
          ref={lineRef}
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 left-0 h-px w-5 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isActiveGold ? "bg-gold" : "bg-purple-accent"
          }`}
          style={{ transform: `translateY(${lineTopRef.current}px)` }}
        />
        {Array.from({ length: sceneCount }, (_, index) => {
          const id = index + 1;
          const scene = scenes[index];
          const isActive = currentIndex === index;
          const isGold = scene?.accent === "gold";

          return (
            <button
              key={id}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              aria-label={`Go to scene ${String(id).padStart(2, "0")}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => goTo(index)}
              className="group relative flex h-7 w-full items-center justify-center transition-transform duration-200 active:scale-95"
            >
              <span
                aria-hidden="true"
                className={`absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 opacity-0 transition-[opacity,background-color,transform] duration-300 group-hover:scale-x-110 group-hover:opacity-60 ${
                  isGold ? "bg-gold" : "bg-purple-accent"
                } ${isActive ? "hidden" : ""}`}
              />
              <span
                className={`text-[11px] font-medium tracking-[0.12em] transition-[color,transform] duration-300 group-hover:scale-105 md:text-[1.15rem] ${
                  isActive
                    ? isGold
                      ? "text-gold"
                      : "text-purple-accent"
                    : "text-white/50 group-hover:text-white/70"
                }`}
              >
                {String(id).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
