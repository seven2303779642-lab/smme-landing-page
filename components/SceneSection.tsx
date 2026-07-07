"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SceneItem } from "@/data/scenes";

type SceneSectionProps = {
  scene: SceneItem;
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function getAccentClasses(accent: SceneItem["accent"]) {
  if (accent === "gold") {
    return {
      label: "text-gold",
      divider: "bg-gold",
      lastLine: "text-gold",
      ctaBorder: "border-gold/50 hover:border-gold hover:bg-gold/10",
    };
  }

  return {
    label: "text-purple-accent",
    divider: "bg-purple-accent",
    lastLine: "text-purple-accent",
    ctaBorder:
      "border-purple-accent/50 hover:border-purple-accent hover:bg-purple-accent/10",
  };
}

function CtaArrow() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M1 7H12M12 7L7 2M12 7L7 12"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function SceneSection({ scene }: SceneSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const accent = getAccentClasses(scene.accent);
  const lastLineIndex = scene.titleLines.length - 1;

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scene-id={scene.id}
      className="relative h-screen min-h-[100svh] snap-always snap-start overflow-hidden"
    >
      {/* Background image: mobile below md, desktop from md up */}
      <div className="absolute inset-0">
        <Image
          src={scene.image}
          alt=""
          fill
          priority={scene.id <= 2}
          sizes="100vw"
          className={`object-cover object-center ${
            scene.mobileImage ? "hidden md:block" : ""
          }`}
        />
        {scene.mobileImage && (
          <Image
            src={scene.mobileImage}
            alt=""
            fill
            priority={scene.id <= 2}
            sizes="100vw"
            className="object-cover object-center md:hidden"
          />
        )}
      </div>

      {/* Left readability gradient — mobile */}
      <div
        className="absolute inset-y-0 left-0 w-[70%] md:hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.75) 35%, transparent 70%)",
        }}
      />

      {/* Left readability gradient — desktop: near-black left, fade by ~48vw */}
      <div
        className="absolute inset-y-0 left-0 hidden w-[52%] md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 0.97) 0%, rgba(0, 0, 0, 0.92) 18%, rgba(0, 0, 0, 0.72) 38%, rgba(0, 0, 0, 0.25) 46%, transparent 52%)",
        }}
      />

      {/* Subtle full-scene darkening — desktop, left-weighted */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-black/25 via-black/10 to-transparent md:block" />

      {/* Mobile: stronger overlay */}
      <div className="absolute inset-0 bg-black/30 md:bg-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 md:from-black/50" />

      {/* Left text block */}
      <div className="relative z-10 flex h-full items-center px-6 pt-20 pb-12 md:px-0 md:pt-20 md:pb-16">
        <div className="w-full max-w-[300px] -translate-y-6 md:absolute md:left-[5.5vw] md:max-w-[380px] md:-translate-y-10">
          <motion.p
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`mb-3 text-xs tracking-[0.3em] uppercase md:mb-5 md:text-[0.95rem] md:tracking-[0.32em] ${accent.label}`}
          >
            {scene.label}
          </motion.p>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUpVariants}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`mb-5 h-px w-[29px] md:mb-7 md:w-[36px] ${accent.divider}`}
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
                className={`block ${
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
            className="text-[8px] leading-4 tracking-[3px] text-white/55 uppercase md:text-[0.8rem] md:leading-snug md:tracking-[0.22em] md:text-white/65"
          >
            {scene.subtitle}
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
                href="#"
                whileHover={{ scale: 1.02, opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`inline-flex items-center gap-2.5 border bg-black/40 px-5 py-2.5 text-[10px] tracking-[0.2em] text-white uppercase transition-colors ${accent.ctaBorder}`}
              >
                {scene.cta}
                <CtaArrow />
              </motion.a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
