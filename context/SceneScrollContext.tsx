"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const SCENE_COUNT = 5;
const SCROLL_ANIMATION_MS = 900;
const WHEEL_IDLE_MS = 300;
const WHEEL_DELTA_THRESHOLD = 12;
const SWIPE_THRESHOLD = 50;

type SceneScrollContextValue = {
  currentIndex: number;
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
};

const SceneScrollContext = createContext<SceneScrollContextValue | null>(null);

function getSectionElements(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-scene-id]"),
  ).sort(
    (a, b) =>
      Number(a.getAttribute("data-scene-id")) -
      Number(b.getAttribute("data-scene-id")),
  );
}

function shouldUseInstantScroll(fromIndex: number, targetIndex: number): boolean {
  const diff = Math.abs(targetIndex - fromIndex);
  const isWrapAround =
    (fromIndex === SCENE_COUNT - 1 && targetIndex === 0) ||
    (fromIndex === 0 && targetIndex === SCENE_COUNT - 1);

  return isWrapAround || diff > 1;
}

export function SceneScrollProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isScrollingRef = useRef(false);
  const wheelGestureActiveRef = useRef(false);
  const wheelIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationDoneRef = useRef(false);
  const wheelIdleDoneRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const clearWheelIdleTimer = useCallback(() => {
    if (wheelIdleTimerRef.current) {
      clearTimeout(wheelIdleTimerRef.current);
      wheelIdleTimerRef.current = null;
    }
  }, []);

  const clearAnimationTimeout = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);

  const tryReleaseLock = useCallback(() => {
    if (!animationDoneRef.current) {
      return;
    }

    if (wheelGestureActiveRef.current && !wheelIdleDoneRef.current) {
      return;
    }

    isScrollingRef.current = false;
    wheelGestureActiveRef.current = false;
    animationDoneRef.current = false;
    wheelIdleDoneRef.current = false;
  }, []);

  const refreshWheelIdleTimer = useCallback(() => {
    clearWheelIdleTimer();
    wheelIdleDoneRef.current = false;

    wheelIdleTimerRef.current = setTimeout(() => {
      wheelIdleDoneRef.current = true;
      tryReleaseLock();
    }, WHEEL_IDLE_MS);
  }, [clearWheelIdleTimer, tryReleaseLock]);

  const scrollToIndex = useCallback(
    (targetIndex: number, fromIndex: number) => {
      const sections = getSectionElements();
      const target = sections[targetIndex];

      if (!target) {
        animationDoneRef.current = true;
        tryReleaseLock();
        return;
      }

      const instant = shouldUseInstantScroll(fromIndex, targetIndex);

      window.scrollTo({
        top: target.offsetTop,
        behavior: instant ? "auto" : "smooth",
      });

      currentIndexRef.current = targetIndex;
      setCurrentIndex(targetIndex);
    },
    [tryReleaseLock],
  );

  const startAnimationCompletion = useCallback(
    (targetIndex: number) => {
      let completed = false;

      const completeAnimation = () => {
        if (completed) {
          return;
        }

        completed = true;
        clearAnimationTimeout();

        const sections = getSectionElements();
        const target = sections[targetIndex];

        if (target && Math.abs(window.scrollY - target.offsetTop) > 2) {
          window.scrollTo({ top: target.offsetTop, behavior: "auto" });
        }

        animationDoneRef.current = true;
        tryReleaseLock();
      };

      if ("onscrollend" in window) {
        window.addEventListener("scrollend", completeAnimation, { once: true });
      }

      animationTimeoutRef.current = setTimeout(
        completeAnimation,
        SCROLL_ANIMATION_MS,
      );
    },
    [clearAnimationTimeout, tryReleaseLock],
  );

  const beginNavigation = useCallback(
    (targetIndex: number, options: { fromWheelGesture: boolean }) => {
      const fromIndex = currentIndexRef.current;

      isScrollingRef.current = true;
      animationDoneRef.current = false;

      if (options.fromWheelGesture) {
        wheelGestureActiveRef.current = true;
        wheelIdleDoneRef.current = false;
        refreshWheelIdleTimer();
      } else {
        wheelGestureActiveRef.current = false;
        wheelIdleDoneRef.current = true;
      }

      scrollToIndex(targetIndex, fromIndex);
      startAnimationCompletion(targetIndex);
    },
    [refreshWheelIdleTimer, scrollToIndex, startAnimationCompletion],
  );

  const goTo = useCallback(
    (targetIndex: number) => {
      if (isScrollingRef.current) {
        return;
      }

      if (targetIndex < 0 || targetIndex >= SCENE_COUNT) {
        return;
      }

      if (targetIndex === currentIndexRef.current) {
        return;
      }

      beginNavigation(targetIndex, { fromWheelGesture: false });
    },
    [beginNavigation],
  );

  const goNext = useCallback(() => {
    goTo((currentIndexRef.current + 1) % SCENE_COUNT);
  }, [goTo]);

  const goPrev = useCallback(() => {
    goTo((currentIndexRef.current - 1 + SCENE_COUNT) % SCENE_COUNT);
  }, [goTo]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const clampToSceneRange = () => {
      if (isScrollingRef.current) {
        return;
      }

      const sections = getSectionElements();

      if (sections.length === 0) {
        return;
      }

      const maxSceneTop = sections[SCENE_COUNT - 1]?.offsetTop ?? 0;

      if (window.scrollY > maxSceneTop + 8) {
        window.scrollTo({
          top: sections[currentIndexRef.current]?.offsetTop ?? maxSceneTop,
          behavior: "auto",
        });
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (wheelGestureActiveRef.current) {
        refreshWheelIdleTimer();
        return;
      }

      if (isScrollingRef.current) {
        return;
      }

      if (Math.abs(event.deltaY) < WHEEL_DELTA_THRESHOLD) {
        return;
      }

      const targetIndex =
        event.deltaY > 0
          ? (currentIndexRef.current + 1) % SCENE_COUNT
          : (currentIndexRef.current - 1 + SCENE_COUNT) % SCENE_COUNT;

      beginNavigation(targetIndex, { fromWheelGesture: true });
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (isScrollingRef.current || touchStartYRef.current === null) {
        touchStartYRef.current = null;
        return;
      }

      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - endY;
      touchStartYRef.current = null;

      if (Math.abs(delta) < SWIPE_THRESHOLD) {
        return;
      }

      const targetIndex =
        delta > 0
          ? (currentIndexRef.current + 1) % SCENE_COUNT
          : (currentIndexRef.current - 1 + SCENE_COUNT) % SCENE_COUNT;

      beginNavigation(targetIndex, { fromWheelGesture: false });
    };

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isScrollingRef.current) {
        return;
      }

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          event.preventDefault();
          goNext();
          break;
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          goPrev();
          break;
        default:
          break;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", clampToSceneRange, { passive: true });

    return () => {
      clearWheelIdleTimer();
      clearAnimationTimeout();
      isScrollingRef.current = false;
      wheelGestureActiveRef.current = false;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", clampToSceneRange);
    };
  }, [
    beginNavigation,
    clearAnimationTimeout,
    clearWheelIdleTimer,
    goNext,
    goPrev,
    refreshWheelIdleTimer,
  ]);

  const value: SceneScrollContextValue = {
    currentIndex,
    goTo,
    goNext,
    goPrev,
  };

  return (
    <SceneScrollContext.Provider value={value}>
      {children}
    </SceneScrollContext.Provider>
  );
}

export function useSceneScroll(): SceneScrollContextValue {
  const context = useContext(SceneScrollContext);

  if (!context) {
    throw new Error("useSceneScroll must be used within SceneScrollProvider");
  }

  return context;
}
