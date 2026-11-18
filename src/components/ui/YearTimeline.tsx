import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import styled, { keyframes } from "styled-components";

/** First four-digit year in a period string such as "Feb 2024 — Present". */
export function startYear(period: string): string {
  return /\d{4}/.exec(period)?.[0] ?? "";
}

const Root = styled.div`
  display: grid;
  grid-template-columns: minmax(150px, 220px) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3rem);

  @media (max-width: 767.98px) {
    grid-template-columns: 1fr;
  }
`;

const YearCol = styled.div`
  @media (max-width: 767.98px) {
    display: none;
  }
`;

const swap = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

const YearSticky = styled.div`
  position: sticky;
  top: 40vh;
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const YearDot = styled.span`
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.ink};
  box-shadow: 0 0 0 6px ${({ theme }) => theme.colors.accentSoft};
  flex-shrink: 0;
`;

const YearValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(3rem, 6.5vw, 5.25rem);
  line-height: 1;
  letter-spacing: -0.05em;
  color: ${({ theme }) => theme.colors.ink};
  animation: ${swap} 420ms cubic-bezier(0.2, 0.7, 0.2, 1);
`;

const Track = styled.div`
  position: relative;
  padding-left: clamp(1.5rem, 3vw, 2.25rem);
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  display: grid;
  gap: 1.25rem;
`;

export interface YearTimelineProps {
  children: ReactNode;
}

/** Vertical timeline whose large year marker follows the entry under the viewport middle. */
export function YearTimeline({ children }: YearTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState("");
  const entryCount = Children.count(children);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const entries = Array.from(
      track.querySelectorAll<HTMLElement>("[data-timeline-year]"),
    );
    if (entries.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current = entries[0];
      for (const el of entries) {
        if (el.getBoundingClientRect().top <= line) current = el;
        else break;
      }
      setYear(current.dataset.timelineYear ?? "");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [entryCount]);

  return (
    <Root data-component-id="YearTimeline">
      <YearCol aria-hidden>
        <YearSticky>
          <YearDot />
          <YearValue key={year}>{year}</YearValue>
        </YearSticky>
      </YearCol>
      <Track ref={trackRef} data-component-id="TimelineTrack">
        {children}
      </Track>
    </Root>
  );
}

const EntryRoot = styled.div`
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 1.6rem;
    left: calc(-1 * clamp(1.5rem, 3vw, 2.25rem) - 5px);
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.bg};
    border: 2px solid ${({ theme }) => theme.colors.ink};
  }
`;

const MobileYear = styled.span`
  display: none;
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: 1.6rem;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.ink};

  @media (max-width: 767.98px) {
    display: block;
  }
`;

export function TimelineEntry({
  year,
  children,
}: {
  year: string;
  children: ReactNode;
}) {
  return (
    <EntryRoot data-timeline-year={year} data-component-id="TimelineEntry">
      <MobileYear aria-hidden>{year}</MobileYear>
      {children}
    </EntryRoot>
  );
}

/** Card surface used for timeline entries. */
export const TimelineCard = styled.div`
  padding: clamp(1.15rem, 3vw, 1.6rem);
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: border-color 0.25s ease, transform 0.25s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.muted};
    transform: translateX(4px);
  }
`;

/** Small mono tag at the top of a card ("EDUCATION", company name). */
export const CardTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.7rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;
