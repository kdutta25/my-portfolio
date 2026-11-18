import { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import anime from "animejs";
import { useTranslation } from "react-i18next";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MOTION } from "../../animations/constants";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { UiverseButton } from "../ui/UiverseButton";
import { AccentTitle } from "../ui/AccentTitle";
import { RESUME_PDF_URL } from "../../constants/externalLinks";

type HeroStat = { value: string; line1: string; line2: string };

const HeroRoot = styled.section`
  position: relative;
  min-height: min(92vh, 900px);
  padding: clamp(2.5rem, 8vw, 5rem) 0 clamp(4.5rem, 9vw, 6rem);
  overflow: hidden;
  scroll-margin-top: 72px;
`;

const Watermark = styled.span`
  position: absolute;
  top: clamp(0.5rem, 4vw, 2.5rem);
  left: 50%;
  translate: -50% 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(5rem, 21vw, 22rem);
  line-height: 0.85;
  letter-spacing: -0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.watermark};
  pointer-events: none;
  user-select: none;
`;

const Inner = styled(Container)`
  position: relative;
  z-index: 1;
  max-width: 1240px;
`;

const IntroEyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.74rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};

  &::before {
    content: "";
    width: 2rem;
    height: 1px;
    background: currentColor;
  }
`;

const DisplayHeadline = styled.h1`
  margin: 1.1rem 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(3rem, 9.5vw, 6.5rem);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.05em;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.ink};
`;

const RoleLine = styled.p`
  margin: 1.4rem 0 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: clamp(1.2rem, 2.6vw, 1.55rem);
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
`;

const Tagline = styled.p`
  margin: 1rem 0 0;
  max-width: min(40rem, 100%);
  font-size: clamp(0.98rem, 2vw, 1.08rem);
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.7;
`;

const Actions = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const pill = `
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem 1.35rem;
  font-weight: 600;
  font-family: inherit;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
`;

const GhostButton = styled.button`
  ${pill};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    border-color: ${({ theme }) => theme.colors.ink};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;

const GhostLink = styled.a`
  ${pill};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.ink};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const SocialLink = styled.a`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

const PhotoStage = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  width: min(380px, 80vw);
  aspect-ratio: 1;
  margin-inline: auto;
`;

const Ring = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px dashed ${({ theme }) => theme.colors.muted};
  opacity: 0.45;
`;

const PhotoFrame = styled.figure`
  margin: 0;
  width: 84%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  border: 6px solid ${({ theme }) => theme.colors.surface};
  outline: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Photo = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FloatChip = styled.span`
  position: absolute;
  bottom: 9%;
  left: -2%;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onInk};
  font-size: 0.78rem;
  font-weight: 600;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Badge = styled.p`
  margin: 1.25rem 0 0;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: clamp(2.5rem, 6vw, 4rem);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  padding: 1.25rem 1.4rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: clamp(2.4rem, 5vw, 3.2rem);
  line-height: 1;
  color: ${({ theme }) => theme.colors.ink};
`;

const StatLabel = styled.span`
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.45;
  white-space: pre-line;
`;

const TechStrip = styled.p`
  margin: 1.5rem 0 0;
  padding: 0.85rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;

const ScrollCue = styled.button`
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  translate: -50% 0;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
  }
`;

function HeroSectionBody() {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLButtonElement>(null);

  const brand = t("nav.brand");
  const headline = t("hero.headline");
  const stats = t("hero.stats", { returnObjects: true }) as HeroStat[];

  const oneLineHeadline = useMemo(
    () => headline.replace(/\n/g, " ").trim(),
    [headline],
  );

  useEffect(() => {
    const root = containerRef.current;
    if (!root || reduced) return;

    const blocks = root.querySelectorAll("[data-hero-block]");
    anime.set(blocks, { opacity: 0, translateY: 22 });

    const tl = anime.timeline({ easing: MOTION.easing.cinematic });
    tl.add({
      targets: blocks,
      opacity: [0, 1],
      translateY: [22, 0],
      duration: MOTION.duration.medium,
      delay: anime.stagger(MOTION.stagger.normal),
    });

    return () => {
      anime.remove(blocks);
    };
  }, [reduced, headline, stats.length]);

  useEffect(() => {
    if (reduced || !scrollCueRef.current) return;
    const anim = anime({
      targets: scrollCueRef.current,
      translateY: [0, 6],
      duration: 1400,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    return () => anim.pause?.();
  }, [reduced]);

  return (
    <>
      <Watermark data-component-id="Watermark" aria-hidden>
        {brand.split(" ")[0]}
      </Watermark>
      <Inner fluid className="px-3 px-lg-4" ref={containerRef}>
        <Row className="align-items-center gy-5">
          <Col xs={12} lg={7} className="order-2 order-lg-1">
            <div data-hero-block>
              <IntroEyebrow data-component-id="IntroEyebrow">{t("hero.introEyebrow")}</IntroEyebrow>
              <DisplayHeadline
                data-component-id="DisplayHeadline"
                id="hero-title"
                aria-label={`${brand} — ${oneLineHeadline}`}
              >
                <AccentTitle text={headline} />
              </DisplayHeadline>
            </div>
            <RoleLine data-component-id="RoleLine" data-hero-block>{t("hero.roleLine")}</RoleLine>
            <Tagline data-component-id="Tagline" data-hero-block>{t("hero.tagline")}</Tagline>

            <Actions data-component-id="Actions" data-hero-block>
              <UiverseButton
                onClick={() =>
                  document.querySelector("#projects")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                {t("hero.ctaPrimary")} <span aria-hidden>→</span>
              </UiverseButton>
              <GhostButton
                data-component-id="GhostButton"
                type="button"
                onClick={() =>
                  window.open(`mailto:${t("footer.email")}`, "_self")
                }
              >
                {t("hero.ctaSecondary")}
              </GhostButton>
              <GhostLink
                data-component-id="ResumeLink"
                href={RESUME_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("nav.resume")} <span aria-hidden>↓</span>
              </GhostLink>
            </Actions>

            <SocialRow data-component-id="SocialRow" data-hero-block aria-label="Social profiles">
              <SocialLink
                data-component-id="SocialLink"
                href={t("footer.github")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={19} aria-hidden />
              </SocialLink>
              <SocialLink
                data-component-id="SocialLink"
                href={t("footer.linkedin")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={19} aria-hidden />
              </SocialLink>
              <SocialLink data-component-id="SocialLink" href={`mailto:${t("footer.email")}`}>
                <HiOutlineMail size={20} aria-hidden />
              </SocialLink>
            </SocialRow>
          </Col>
          <Col xs={12} lg={5} className="order-1 order-lg-2">
            <div data-hero-block>
              <PhotoStage data-component-id="PhotoStage">
                <Ring aria-hidden />
                <PhotoFrame data-component-id="PhotoFrame">
                  <Photo
                    data-component-id="Photo"
                    src={`${import.meta.env.BASE_URL}images/kaustubh-dutta.png`}
                    alt={t("hero.photoAlt")}
                    width={560}
                    height={560}
                    loading="eager"
                    decoding="async"
                  />
                </PhotoFrame>
                <FloatChip data-component-id="Meta">
                  <HiOutlineLocationMarker aria-hidden />
                  {t("hero.location")}
                </FloatChip>
              </PhotoStage>
              <Badge data-component-id="Badge">{t("hero.badge")}</Badge>
            </div>
          </Col>
        </Row>

        <StatsRow data-component-id="StatsRow" data-hero-block>
          {stats.map((s) => (
            <Stat data-component-id="Stat" key={`${s.value}-${s.line1}`}>
              <StatValue data-component-id="StatValue">{s.value}</StatValue>
              <StatLabel data-component-id="StatLabel">
                {s.line1}
                {"\n"}
                {s.line2}
              </StatLabel>
            </Stat>
          ))}
        </StatsRow>

        <TechStrip data-component-id="TechStrip" data-hero-block>{t("hero.techStrip")}</TechStrip>
      </Inner>

      <ScrollCue
        ref={scrollCueRef}
        data-component-id="ScrollCue"
        type="button"
        aria-label="Scroll to content"
        onClick={() =>
          document.querySelector("#about")?.scrollIntoView({
            behavior: "smooth",
          })
        }
      >
        <MdOutlineKeyboardArrowDown size={24} aria-hidden />
      </ScrollCue>
    </>
  );
}

export function HeroSection() {
  const { rootRef: fragRef, ready } = useContentFragment("hero", { loadOn: "mount" });
  const setHeroRootRef = useCallback(
    (node: HTMLElement | null) => {
      fragRef.current = node;
    },
    [fragRef],
  );

  return (
    <HeroRoot data-component-id="HeroSection" ref={setHeroRootRef} id="top" aria-labelledby="hero-title">
      {ready ? (
        <HeroSectionBody />
      ) : (
        <Inner fluid className="px-3 px-lg-4">
          <Row className="justify-content-center py-5">
            <Col xs={12} md={8}>
              <SectionSkeleton />
            </Col>
          </Row>
        </Inner>
      )}
    </HeroRoot>
  );
}
