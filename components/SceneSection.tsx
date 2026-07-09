"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { SceneItem } from "@/data/scenes";
import { getSceneAccentClasses } from "@/data/scenes";
import { useSceneScroll } from "@/context/SceneScrollContext";
import SceneCopyright from "./SceneCopyright";

type SceneSectionProps = {
  scene: SceneItem;
};

type SceneTextContentProps = {
  scene: SceneItem;
  accent: ReturnType<typeof getSceneAccentClasses>;
  isInView: boolean;
  lastLineIndex: number;
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const SCENE_3_IMAGE_FOCUS = {
  x: "100%",
  y: "50%",
} as const;

function getSceneImageClassName(sceneId: number) {
  if (sceneId === 3) {
    return "object-cover [object-position:var(--scene3-image-focus-x)_var(--scene3-image-focus-y)]";
  }

  return "object-cover object-center";
}

function CtaArrow() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="block shrink-0 text-purple-accent"
    >
      <path
        d="M1 7H12M12 7L7 2M12 7L7 12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SceneTextContent({
  scene,
  accent,
  isInView,
  lastLineIndex,
}: SceneTextContentProps) {
  return (
    <>
      <motion.p
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUpVariants}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-[1.05rem] font-semibold leading-none tracking-[0.18em] uppercase md:text-[1.55rem] ${accent.label}`}
      >
        {scene.label}
      </motion.p>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUpVariants}
        transition={{ duration: 0.6, delay: 0.15 }}
        className={`mt-4 mb-8 h-[2px] w-12 md:mt-4 md:mb-10 md:w-14 ${accent.divider}`}
      />

      <motion.h2
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUpVariants}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mb-4 text-[clamp(1.75rem,6vw,2.625rem)] leading-[clamp(1.625rem,5.8vw,2.5rem)] tracking-[1px] uppercase md:mb-6 md:text-[clamp(3.8rem,4.8vw,5.8rem)] md:leading-[0.88]"
      >
        {scene.titleLines.map((line, index) => (
          <span
            key={line}
            className={`block md:whitespace-nowrap ${
              index === lastLineIndex ? accent.lastLine : "text-white"
            }`}
          >
            {line}
          </span>
        ))}
      </motion.h2>

      <motion.p
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUpVariants}
        transition={{ duration: 0.7, delay: 0.35 }}
        className={`text-[1.2rem] leading-snug tracking-[3px] uppercase md:tracking-[0.22em] ${
          scene.subtitleAccentPrefix
            ? "text-white/55 md:text-white/65"
            : accent.subtitle
        }`}
      >
        {scene.subtitleAccentPrefix ? (
          <>
            <span className="text-purple-accent">
              {scene.subtitleAccentPrefix}
            </span>
            {scene.subtitle.slice(scene.subtitleAccentPrefix.length)}
          </>
        ) : (
          scene.subtitle
        )}
      </motion.p>

      {scene.cta && (
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUpVariants}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-6 md:mt-8"
        >
          <motion.a
            href={scene.ctaHref ?? "#"}
            target={scene.ctaHref ? "_blank" : undefined}
            rel={scene.ctaHref ? "noopener noreferrer" : undefined}
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="inline-flex h-12 items-center gap-3 rounded border border-purple-accent bg-transparent px-4 text-[0.95rem] leading-none tracking-[0.18em] text-white uppercase transition-colors hover:bg-purple-accent/10 md:h-14 md:gap-5 md:px-8 md:text-[1.2rem]"
          >
            <span className="inline-block translate-y-[2px] leading-none">
              {scene.cta}
            </span>
            <span className="inline-flex translate-y-[1px] items-center leading-none">
              <CtaArrow />
            </span>
          </motion.a>
        </motion.div>
      )}
    </>
  );
}

export default function SceneSection({ scene }: SceneSectionProps) {
  const { currentIndex } = useSceneScroll();
  const accent = getSceneAccentClasses(scene.accent);
  const lastLineIndex = scene.titleLines.length - 1;
  const isInView = currentIndex === scene.id - 1;
  const isScene3 = scene.id === 3;

  return (
    <section
      data-scene-id={scene.id}
      className="relative h-screen min-h-[100svh] overflow-hidden bg-black"
      style={
        isScene3
          ? ({
              "--scene3-image-focus-x": SCENE_3_IMAGE_FOCUS.x,
              "--scene3-image-focus-y": SCENE_3_IMAGE_FOCUS.y,
            } as CSSProperties)
          : undefined
      }
    >
      {/* Desktop */}
      <div className="relative hidden h-full min-h-[100svh] md:block">
        <Image
          src={scene.image}
          alt=""
          fill
          priority={scene.id <= 2}
          sizes="100vw"
          className={getSceneImageClassName(scene.id)}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-[1] h-full w-[42vw] bg-[linear-gradient(to_right,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.88)_34%,rgba(0,0,0,0.45)_68%,rgba(0,0,0,0)_100%)]"
        />

        <div className="relative z-10 flex h-full min-h-[100svh] items-center">
          <div className="ml-[5.5vw] w-[min(42vw,720px)] max-w-[720px]">
            <SceneTextContent
              scene={scene}
              accent={accent}
              isInView={isInView}
              lastLineIndex={lastLineIndex}
            />
          </div>
        </div>
      </div>

      {/* Mobile: left-right split */}
      <div className="flex h-full min-h-[100svh] w-full min-w-0 flex-row md:hidden">
        <div className="relative flex h-full min-h-[100svh] w-[42vw] min-w-0 shrink-0 items-center overflow-hidden bg-[linear-gradient(to_bottom,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.98)_50%,rgba(0,0,0,0.68)_100%)] px-7">
          <div className="min-w-0 w-full">
            <SceneTextContent
              scene={scene}
              accent={accent}
              isInView={isInView}
              lastLineIndex={lastLineIndex}
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className={`w-[2px] shrink-0 self-stretch ${accent.mobileDivider}`}
        />

        <div className="relative min-h-[100svh] min-w-0 flex-1">
          {scene.mobileImage && (
            <Image
              src={scene.mobileImage}
              alt=""
              fill
              priority={scene.id <= 2}
              sizes="100vw"
              className={getSceneImageClassName(scene.id)}
            />
          )}
        </div>
      </div>

      <SceneCopyright />
    </section>
  );
}
