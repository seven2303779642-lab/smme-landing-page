export type SceneAccent = "gold" | "purple";

export type SceneItem = {
  id: number;
  label: string;
  titleLines: string[];
  subtitle: string;
  image: string;
  mobileImage?: string;
  accent: SceneAccent;
  cta?: string;
};

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
    accent: "purple",
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
    image: "/images/scenes/scene-05.jpg",
    mobileImage: "/images/scenes/mobile/scene-05-mobile.png",
    accent: "purple",
    cta: "ENTER NEXT STAGE",
  },
];
