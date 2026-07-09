export type SceneAccent = "gold" | "purple" | "magenta";

export type SceneItem = {
  id: number;
  label: string;
  titleLines: string[];
  subtitle: string;
  image: string;
  mobileImage?: string;
  accent: SceneAccent;
  cta?: string;
  ctaHref?: string;
  subtitleAccentPrefix?: string;
};

export function getSceneAccentClasses(accent: SceneAccent) {
  if (accent === "gold") {
    return {
      label: "text-gold",
      divider: "bg-gold",
      lastLine: "text-gold",
      subtitle: "text-white/55 md:text-white/65",
      ctaBorder: "border-gold/50 hover:border-gold hover:bg-gold/10",
      indicatorBg: "bg-gold",
      indicatorText: "text-gold",
      mobileDivider:
        "bg-[linear-gradient(to_bottom,rgba(196,163,90,0)_0%,rgba(196,163,90,1)_14%,rgba(196,163,90,1)_86%,rgba(196,163,90,0)_100%)]",
    };
  }

  if (accent === "magenta") {
    return {
      label: "text-magenta-accent",
      divider: "bg-magenta-accent",
      lastLine: "text-magenta-accent",
      subtitle: "text-magenta-accent",
      ctaBorder:
        "border-magenta-accent/50 hover:border-magenta-accent hover:bg-magenta-accent/10",
      indicatorBg: "bg-magenta-accent",
      indicatorText: "text-magenta-accent",
      mobileDivider:
        "bg-[linear-gradient(to_bottom,rgba(183,27,143,0)_0%,rgba(183,27,143,1)_14%,rgba(183,27,143,1)_86%,rgba(183,27,143,0)_100%)]",
    };
  }

  return {
    label: "text-purple-accent",
    divider: "bg-purple-accent",
    lastLine: "text-purple-accent",
    subtitle: "text-purple-accent",
    ctaBorder:
      "border-purple-accent/50 hover:border-purple-accent hover:bg-purple-accent/10",
    indicatorBg: "bg-purple-accent",
    indicatorText: "text-purple-accent",
    mobileDivider:
      "bg-[linear-gradient(to_bottom,rgba(168,85,247,0)_0%,rgba(168,85,247,1)_14%,rgba(168,85,247,1)_86%,rgba(168,85,247,0)_100%)]",
  };
}

export const scenes: SceneItem[] = [
  {
    id: 1,
    label: "SCENE 01",
    titleLines: ["THE STAGE", "DOESN'T", "BUILD LEGENDS.", "WE DO."],
    subtitle: "WE BUILD IT.",
    image: "/images/scenes/scene-01.jpg",
    mobileImage: "/images/scenes/mobile/scene-01-mobile.png",
    accent: "gold",
  },
  {
    id: 2,
    label: "SCENE 02",
    titleLines: ["EVERY LEGEND", "STARTED", "UNKNOWN."],
    subtitle: "EVERY STORY HAS A BEGINNING.",
    image: "/images/scenes/scene-02.jpg",
    mobileImage: "/images/scenes/mobile/scene-02-mobile.png",
    accent: "purple",
  },
  {
    id: 3,
    label: "SCENE 03",
    titleLines: ["PERFORM.", "WITHOUT LIMITS."],
    subtitle: "THIS IS WHERE WE SHINE.",
    image: "/images/scenes/scene-03.jpg",
    mobileImage: "/images/scenes/mobile/scene-03-mobile.png",
    accent: "magenta",
  },
  {
    id: 4,
    label: "SCENE 04",
    titleLines: ["NO BORDERS.", "ONLY STAGES."],
    subtitle: "THE WORLD IS OUR STAGE.",
    image: "/images/scenes/scene-04.jpg",
    mobileImage: "/images/scenes/mobile/scene-04-mobile.png",
    accent: "gold",
  },
  {
    id: 5,
    label: "SCENE 05",
    titleLines: ["YOUR STORY", "STARTS HERE."],
    subtitle: "NEXT STAGE IS WAITING FOR YOU.",
    subtitleAccentPrefix: "NEXT STAGE IS",
    image: "/images/scenes/scene-05.jpg",
    mobileImage: "/images/scenes/mobile/scene-05-mobile.png",
    accent: "purple",
    cta: "ENTER NEXT STAGE",
    ctaHref: "https://nextstage.smme.ca/",
  },
];
