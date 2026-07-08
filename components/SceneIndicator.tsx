"use client";

import { getSceneAccentClasses, scenes } from "@/data/scenes";
import { useSceneScroll } from "@/context/SceneScrollContext";

type SceneIndicatorProps = {
  sceneCount: number;
};

export default function SceneIndicator({ sceneCount }: SceneIndicatorProps) {
  const { currentIndex, goTo } = useSceneScroll();

  return (
    <aside
      aria-label="Scene navigation"
      className="fixed top-0 right-0 z-40 hidden h-screen w-12 bg-black md:flex md:w-[88px]"
    >
      <nav className="flex w-full flex-col items-center justify-center gap-8">
        {Array.from({ length: sceneCount }, (_, index) => {
          const id = index + 1;
          const scene = scenes[index];
          const isActive = currentIndex === index;
          const sceneAccent = getSceneAccentClasses(scene?.accent ?? "purple");

          return (
            <button
              key={id}
              type="button"
              aria-label={`Go to scene ${String(id).padStart(2, "0")}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => goTo(index)}
              className="group flex flex-col items-center py-1 transition-transform duration-200 active:scale-95"
            >
              <span
                className={`text-[11px] font-medium tracking-[0.12em] transition-[color,transform] duration-300 group-hover:scale-105 md:text-[1.15rem] ${
                  isActive
                    ? sceneAccent.indicatorText
                    : "text-white/50 group-hover:text-white/70"
                }`}
              >
                {String(id).padStart(2, "0")}
              </span>
              <span
                aria-hidden="true"
                className={`mt-2 h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-300 group-hover:scale-110 md:h-2 md:w-2 ${
                  isActive
                    ? sceneAccent.indicatorBg
                    : "bg-white/50 group-hover:bg-white/70"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
