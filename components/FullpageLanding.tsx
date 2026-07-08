"use client";

import { scenes } from "@/data/scenes";
import { SceneScrollProvider } from "@/context/SceneScrollContext";
import SceneIndicator from "./SceneIndicator";
import SceneSection from "./SceneSection";
import ScrollDownHint from "./ScrollDownHint";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function FullpageLanding() {
  return (
    <SceneScrollProvider>
      <div className="relative bg-black">
        <SiteHeader />

        {scenes.map((scene) => (
          <SceneSection key={scene.id} scene={scene} />
        ))}

        <SiteFooter />
        <SceneIndicator sceneCount={scenes.length} />
        <ScrollDownHint />
      </div>
    </SceneScrollProvider>
  );
}
