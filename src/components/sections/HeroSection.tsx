import { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import anime from "animejs";
import { useTranslation } from "react-i18next";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MOTION } from "../../animations/constants";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { UiverseButton } from "../ui/UiverseButton";

type HeroStat = { value: string; line1: string; line2: string };

const HeroRoot = styled.section`
  position: relative;
  min-height: min(88vh, 840px);
  padding: clamp(3rem, 10vw, 6rem) 0 clamp(3rem, 8vw, 5rem);
  overflow: hidden;
  scroll-margin-top: 72px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const GridBg = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.35;
  background-image:
    linear-gradient(
      ${({ theme }) => theme.colors.border} 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.border} 1px,
      transparent 1px
    );
  background-size: 64px 64px;
  mask-image: radial-gradient(
    ellipse 70% 60% at 50% 30%,
    black 20%,
    transparent 75%
  );
`;

const IntroEyebrow = styled.p`
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
`;

const DisplayHeadline = styled.h1`
  margin: 1rem 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.75rem, 10vw, 5.75rem);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.045em;
  text-transform: uppercase;
  white-space: pre-line;
`;

const Tagline = styled.p`
  margin: 1.5rem 0 0;
  max-width: min(42rem, 100%);
  font-size: clamp(1rem, 2.2vw, 1.15rem);
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.65;
`;

const RoleLine = styled.p`
  margin: 1rem 0 0;
  font-size: 0.88rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.85;
`;

const Meta = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: clamp(2rem, 5vw, 3rem);
  padding-top: clamp(1.5rem, 4vw, 2rem);
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const Stat = styled.div`
  padding: 0.5rem 0;
`;

const StatValue = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
`;

const StatLabel = styled.span`
  display: block;
  margin-top: 0.45rem;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.35;
  white-space: pre-line;
`;

const TechStrip = styled.p`
  margin: clamp(1.75rem, 4vw, 2.5rem) 0 0;
  padding: 0.85rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const Actions = styled.div`
  margin-top: 1.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const GhostButton = styled.button`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.75rem 1.35rem;
  font-weight: 700;
  font-family: inherit;
  font-size: 0.9rem;
  border: 2px solid ${({ theme }) => theme.colors.text};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.bg};
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
  width: 46px;
  height: 46px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.bgElevated};
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

const PhotoFrame = styled.figure`
  margin: 0;
  width: min(280px, 78vw);
  height: min(280px, 78vw);
  max-width: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  flex-shrink: 0;
`;

const Photo = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Badge = styled.p`
  margin: 1rem 0 0;
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const ScrollCue = styled.button`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  translate: -50% 0;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgElevated};
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
      <Container
        fluid
        className="position-relative px-3 px-lg-4"
        style={{ zIndex: 1 }}
        ref={containerRef}
      >
        <Row className="align-items-center gy-5">
          <Col
            xs={12}
            lg={5}
            className="d-flex flex-column align-items-center align-items-lg-start text-center text-lg-start"
          >
            <div data-hero-block>
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
              <Badge data-component-id="Badge">{t("hero.badge")}</Badge>
            </div>
          </Col>
          <Col xs={12} lg={7}>
            <div data-hero-block>
              <IntroEyebrow data-component-id="IntroEyebrow">{t("hero.introEyebrow")}</IntroEyebrow>
              <DisplayHeadline data-component-id="DisplayHeadline" id="hero-title" aria-label={`${brand} — ${oneLineHeadline}`}>
                {headline}
              </DisplayHeadline>
            </div>
            <Tagline data-component-id="Tagline" data-hero-block>{t("hero.tagline")}</Tagline>
            <RoleLine data-component-id="RoleLine" data-hero-block>{t("hero.roleLine")}</RoleLine>
            <Meta data-component-id="Meta" data-hero-block>{t("hero.location")}</Meta>

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

            <Actions data-component-id="Actions" data-hero-block>
              <UiverseButton
                onClick={() =>
                  document.querySelector("#projects")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                {t("hero.ctaPrimary")}
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
            </Actions>

            <SocialRow data-component-id="SocialRow" data-hero-block aria-label="Social profiles">
              <SocialLink
                data-component-id="SocialLink"
                href={t("footer.github")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={20} aria-hidden />
              </SocialLink>
              <SocialLink
                data-component-id="SocialLink"
                href={t("footer.linkedin")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={20} aria-hidden />
              </SocialLink>
              <SocialLink data-component-id="SocialLink" href={`mailto:${t("footer.email")}`}>
                <HiOutlineMail size={22} aria-hidden />
              </SocialLink>
            </SocialRow>
          </Col>
        </Row>
      </Container>

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
        <MdOutlineKeyboardArrowDown size={26} aria-hidden />
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
      <GridBg data-component-id="GridBg" aria-hidden />
      {ready ? (
        <HeroSectionBody />
      ) : (
        <Container fluid className="position-relative px-3 px-lg-4" style={{ zIndex: 1 }}>
          <Row className="justify-content-center py-5">
            <Col xs={12} md={8}>
              <SectionSkeleton />
            </Col>
          </Row>
        </Container>
      )}
    </HeroRoot>
  );
}
