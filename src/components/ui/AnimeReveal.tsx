import { useEffect, useRef, type ReactNode } from "react";
import styled from "styled-components";
import anime from "animejs";
import { MOTION } from "../../animations/constants";

const Wrap = styled.div`
  & [data-animate] {
    opacity: 0;
    will-change: opacity, transform;
  }

  @media (prefers-reduced-motion: reduce) {
    & [data-animate] {
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

export interface AnimeRevealProps {
  children: ReactNode;
  stagger?: number;
  threshold?: number;
}

export function AnimeReveal({
  children,
  stagger = MOTION.stagger.normal,
  threshold = 0.12,
}: AnimeRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      root.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const targets = root.querySelectorAll("[data-animate]");
    if (targets.length === 0) return;

    anime.set(targets, {
      opacity: 0,
      translateY: 28,
      scale: 0.985,
    });

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      anime({
        targets,
        opacity: [0, 1],
        translateY: [28, 0],
        scale: [0.985, 1],
        duration: MOTION.duration.entrance,
        easing: MOTION.easing.smooth,
        delay: anime.stagger(stagger),
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          play();
          io.disconnect();
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(root);
    return () => io.disconnect();
  }, [stagger, threshold]);

  return <Wrap ref={ref}>{children}</Wrap>;
}
