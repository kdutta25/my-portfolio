import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import anime from "animejs";
import { MOTION } from "../../animations/constants";
import { isTestEnv } from "../../utils/isTestEnv";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const DISPLAY_NAME = "Kaustubh Dutta";

/** Overlay fade completes after 2s: sync + bar + pause + fade = 2000ms */
const PROGRESS_MS = 1300;
const TOP_IN_MS = 320;
const SYNC_START_MS = 200;
const LETTER_DURATION_MS = 280;
const PAUSE_AFTER_BAR_MS = 80;
const FADE_OUT_MS = 420;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.bg};
  background-image:
    radial-gradient(
      ellipse 80% 50% at 50% -20%,
      ${({ theme }) => theme.colors.accentSoft},
      transparent 55%
    ),
    radial-gradient(
      ellipse 70% 40% at 50% 120%,
      ${({ theme }) => theme.colors.bgElevated},
      transparent 55%
    );
`;

const Inner = styled.div`
  text-align: center;
  padding: 2rem;
  max-width: min(420px, 92vw);
  width: 100%;
`;

const Title = styled.h2`
  margin: 0 0 1.75rem;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
  opacity: 0;
`;

const Track = styled.div`
  height: 4px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  width: 0%;
  border-radius: inherit;
  transform-origin: 0 50%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.accentSoft}
  );
`;

const NameLine = styled.p`
  margin: 1.75rem 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(1.15rem, 3.8vw, 1.45rem);
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.35;
`;

const Letter = styled.span`
  display: inline-block;
  opacity: 0;
`;

export interface LoadingScreenProps {
  onReady: () => void;
}

export function LoadingScreen({ onReady }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();

  const chars = useMemo(() => Array.from(DISPLAY_NAME), []);

  const staggerMs = useMemo(() => {
    const n = chars.length;
    if (n <= 1) return 0;
    return Math.max(
      40,
      Math.floor((PROGRESS_MS - LETTER_DURATION_MS) / Math.max(n - 1, 1)),
    );
  }, [chars.length]);

  useEffect(() => {
    if (isTestEnv()) {
      onReady();
      return;
    }

    if (reduced) {
      onReady();
      return;
    }

    const overlay = overlayRef.current;
    const fill = fillRef.current;
    const title = titleRef.current;
    const letters = overlay?.querySelectorAll<HTMLElement>(".load-letter");
    if (!overlay || !fill || !title || !letters?.length) return;

    const fadeStartMs =
      SYNC_START_MS + PROGRESS_MS + PAUSE_AFTER_BAR_MS;

    const tl = anime.timeline({ autoplay: true });

    tl.add({
      targets: title,
      opacity: [0, 1],
      translateY: [-12, 0],
      duration: TOP_IN_MS,
      easing: MOTION.easing.cinematic,
    }).add(
      {
        targets: fill,
        width: ["0%", "100%"],
        duration: PROGRESS_MS,
        easing: "linear",
      },
      SYNC_START_MS,
    );

    tl.add(
      {
        targets: letters,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: LETTER_DURATION_MS,
        delay: anime.stagger(staggerMs),
        easing: MOTION.easing.cinematic,
      },
      SYNC_START_MS,
    );

    tl.add({
      targets: overlay,
      opacity: [1, 0],
      duration: FADE_OUT_MS,
      easing: MOTION.easing.smooth,
      complete: () => onReady(),
    }, fadeStartMs);

    return () => {
      tl.pause();
      anime.remove([overlay, fill, title, ...letters]);
    };
  }, [onReady, reduced, staggerMs]);

  return (
    <Overlay ref={overlayRef} aria-busy="true" aria-live="polite">
      <Inner>
        <Title ref={titleRef}>Portfolio</Title>
        <Track aria-hidden>
          <Fill ref={fillRef} />
        </Track>
        <NameLine>
          {chars.map((ch, i) => (
            <Letter key={`${ch}-${i}`} className="load-letter">
              {ch === " " ? "\u00A0" : ch}
            </Letter>
          ))}
        </NameLine>
      </Inner>
    </Overlay>
  );
}
