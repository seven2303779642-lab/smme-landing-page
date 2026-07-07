import { scenes } from "@/data/scenes";
import SceneIndicator from "./SceneIndicator";
import SceneSection from "./SceneSection";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function FullpageLanding() {
  return (
    <div className="relative bg-black">
      <SiteHeader />

      {scenes.map((scene) => (
        <SceneSection key={scene.id} scene={scene} />
      ))}

      <SiteFooter />
      <SceneIndicator sceneCount={scenes.length} />
    </div>
  );
}
