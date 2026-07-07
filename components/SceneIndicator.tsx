"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { scenes } from "@/data/scenes";

type SceneIndicatorProps = {
  sceneCount: number;
};

export default function SceneIndicator({ sceneCount }: SceneIndicatorProps) {
  const [activeId, setActiveId] = useState(1);
  const [lineTop, setLineTop] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene-id]"),
    );

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) {
          return;
        }

        const id = Number(visible[0].target.getAttribute("data-scene-id"));

        if (!Number.isNaN(id)) {
          setActiveId(id);
        }
      },
      {
        root: null,
        threshold: [0.35, 0.5, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id: number) => {
    const target = document.querySelector<HTMLElement>(
      `[data-scene-id="${id}"]`,
    );

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useLayoutEffect(() => {
    const updateLinePosition = () => {
      const activeButton = buttonRefs.current[activeId - 1];

      if (!activeButton) {
        return;
      }

      setLineTop(activeButton.offsetTop + activeButton.offsetHeight / 2);
    };

    updateLinePosition();
    window.addEventListener("resize", updateLinePosition);

    return () => window.removeEventListener("resize", updateLinePosition);
  }, [activeId]);

  const activeScene = scenes[activeId - 1];
  const isActiveGold = activeScene?.accent === "gold";

  return (
    <aside
      aria-label="Scene navigation"
      className="fixed top-0 right-0 z-40 hidden h-screen w-12 bg-black md:flex md:w-[88px]"
    >
      <nav className="relative flex w-full flex-col items-center justify-center gap-8">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 left-0 h-px w-5 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isActiveGold ? "bg-gold" : "bg-purple-accent"
          }`}
          style={{ transform: `translateY(${lineTop}px)` }}
        />
        {Array.from({ length: sceneCount }, (_, index) => {
          const id = index + 1;
          const scene = scenes[index];
          const isActive = activeId === id;
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
              onClick={() => scrollToSection(id)}
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
