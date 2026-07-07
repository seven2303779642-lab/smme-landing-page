"use client";

import { useCallback, useEffect, useState } from "react";
import { scenes } from "@/data/scenes";

type SceneIndicatorProps = {
  sceneCount: number;
};

export default function SceneIndicator({ sceneCount }: SceneIndicatorProps) {
  const [activeId, setActiveId] = useState(1);

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

  return (
    <aside
      aria-label="Scene navigation"
      className="fixed top-0 right-0 z-40 hidden h-screen w-12 bg-black md:flex md:w-20"
    >
      <nav className="flex w-full flex-col items-center justify-center gap-7">
        {Array.from({ length: sceneCount }, (_, index) => {
          const id = index + 1;
          const scene = scenes[index];
          const isActive = activeId === id;
          const isGold = scene?.accent === "gold";

          return (
            <button
              key={id}
              type="button"
              aria-label={`Go to scene ${String(id).padStart(2, "0")}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToSection(id)}
              className="group relative flex h-7 w-full items-center justify-center"
            >
              {isActive && (
                <span
                  className={`absolute top-1/2 left-0 h-px w-5 -translate-y-1/2 ${
                    isGold ? "bg-gold" : "bg-purple-accent"
                  }`}
                />
              )}
              <span
                className={`text-[11px] tracking-[0.08em] transition-colors duration-300 md:text-[13px] ${
                  isActive
                    ? isGold
                      ? "text-gold"
                      : "text-purple-accent"
                    : "text-white/40 group-hover:text-white/60"
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
