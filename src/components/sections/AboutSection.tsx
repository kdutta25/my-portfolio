import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useContentFragment } from "../../hooks/useContentFragment";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useUiLabels } from "../../i18n/uiLabels";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";

/** Matches the backdrop baked into kaustubh-ai-character.jpg. */
const CHARACTER_BACKDROP = "#f6e4ce";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: clamp(3.5rem, 8vw, 6rem) 1.25rem 0;
  max-width: 1240px;
  margin: 0 auto;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: start;

  @media (max-width: 991.98px) {
    grid-template-columns: 1fr;
  }
`;

const Greeting = styled.p`
  margin: -0.75rem 0 1.5rem;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(1.6rem, 3.6vw, 2.4rem);
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.ink};

  em {
    font-family: ${({ theme }) => theme.fonts.serif};
    font-weight: 400;
    font-size: 1.12em;
  }
`;

const Body = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.05rem;
  line-height: 1.75;
  max-width: 64ch;
`;

const Label = styled.strong`
  display: block;
  margin-top: 1.4rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

const Muted = styled.p`
  margin: 0.4rem 0 0;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 64ch;
`;

const Motto = styled(Muted)`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 1.35rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.text};
`;

const ActivitiesLead = styled.p`
  margin: 1.4rem 0 0;
  color: ${({ theme }) => theme.colors.text};
  max-width: 64ch;
`;

const ActivityList = styled.ul`
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 64ch;

  li {
    padding: 0.4rem 0.85rem;
    border-radius: ${({ theme }) => theme.radii.pill};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.88rem;
  }
`;

const ConnectLabel = styled.p`
  margin: 1.75rem 0 0.65rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
`;

const SocialRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
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

const Aside = styled.div`
  position: sticky;
  top: 6rem;

  @media (max-width: 991.98px) {
    position: relative;
    top: 0;
    max-width: 420px;
    margin-inline: auto;
    width: 100%;
  }
`;

const Stage = styled.div`
  position: relative;
  aspect-ratio: 3 / 4;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${CHARACTER_BACKDROP};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  filter: ${({ theme }) => (theme.mode === "dark" ? "brightness(0.9)" : "none")};
`;

const idle = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
`;

const Rise = styled.div`
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
`;

const Float = styled.div`
  width: 100%;
  height: 100%;
  animation: ${idle} 3.2s ease-in-out infinite alternate;
`;

const Character = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
`;

const IdCard = styled.div`
  position: relative;
  width: min(280px, 82%);
  margin: -5.5rem auto 0 -1rem;
  perspective: 1100px;
  rotate: -3deg;
  z-index: 1;

  @media (max-width: 991.98px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const Flipper = styled.div`
  display: grid;
  transform-style: preserve-3d;
  will-change: transform;
`;

const Face = styled.div`
  grid-area: 1 / 1;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

const FrontFace = styled(Face)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  padding: 1.1rem 1.1rem 1.25rem;
`;

const BackFace = styled(Face)`
  transform: rotateY(180deg);
`;

const Slot = styled.span`
  width: 3rem;
  height: 0.45rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const FrontPhoto = styled.img`
  width: 72%;
  aspect-ratio: 1;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.bg};
  outline: 1px solid ${({ theme }) => theme.colors.border};
`;

const FrontName = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 1.6rem;
  line-height: 1.1;
  text-align: center;
  color: ${({ theme }) => theme.colors.ink};
`;

const IdHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onInk};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

const IdBody = styled.dl`
  margin: 0;
  padding: 0.75rem 0.95rem 0.6rem;
  display: grid;
  gap: 0.45rem;

  dt {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.6rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.muted};
  }

  dd {
    margin: 0.1rem 0 0;
    font-size: 0.82rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.35;
  }
`;

const Barcode = styled.div`
  height: 26px;
  margin: 0.2rem 0.95rem 0.85rem;
  opacity: 0.75;
  background: repeating-linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.text} 0 2px,
    transparent 2px 4px,
    ${({ theme }) => theme.colors.text} 4px 5px,
    transparent 5px 8px,
    ${({ theme }) => theme.colors.text} 8px 11px,
    transparent 11px 13px
  );
`;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Scroll-driven About motion: the character rises into its stage, and the ID
 * badge turns from its front (photo, name) to its back (credentials) as it
 * travels up the viewport, turning back when scrolled up again.
 */
function useAboutScrollMotion(reduced: boolean) {
  const stageRef = useRef<HTMLDivElement>(null);
  const riseRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const rise = riseRef.current;
    const card = cardRef.current;
    const flip = flipRef.current;
    if (!stage || !rise || !card || !flip) return;
    if (reduced) {
      rise.style.opacity = "1";
      rise.style.transform = "none";
    }

    let frame = 0;
    let showingBack: boolean | null = null;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight || 1;

      if (!reduced) {
        const rect = stage.getBoundingClientRect();
        const progress = clamp01((vh - rect.top) / (vh * 0.75));
        rise.style.opacity = String(0.15 + progress * 0.85);
        rise.style.transform = `translateY(${(1 - progress) * 22}%) scale(${0.94 + progress * 0.06})`;
      }

      const cardTop = card.getBoundingClientRect().top;
      const turn = clamp01((vh * 0.55 - cardTop) / (vh * 0.3));
      const angle = reduced ? (turn >= 0.5 ? 180 : 0) : turn * 180;
      const lift = reduced ? 1 : 1 + Math.sin(turn * Math.PI) * 0.06;
      flip.style.transform = `rotateY(${angle}deg) scale(${lift})`;

      const back = angle > 90;
      if (back !== showingBack) {
        showingBack = back;
        frontRef.current?.setAttribute("aria-hidden", String(back));
        backRef.current?.setAttribute("aria-hidden", String(!back));
      }
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
  }, [reduced]);

  return { stageRef, riseRef, cardRef, flipRef, frontRef, backRef };
}

function AboutSectionBody() {
  const { t } = useTranslation();
  const label = useUiLabels();
  const reduced = usePrefersReducedMotion();
  const { stageRef, riseRef, cardRef, flipRef, frontRef, backRef } =
    useAboutScrollMotion(reduced);
  const activities = t("about.activities", {
    returnObjects: true,
  }) as string[];
  const brand = t("nav.brand");
  const firstName = brand.split(" ")[0];

  return (
    <Layout data-component-id="AboutLayout">
      <div data-animate>
        <SectionHeading
          headingId="about-heading"
          eyebrow={t("nav.about")}
          title={t("about.heading")}
        />
        <Greeting data-component-id="Greeting">
          {label("greeting")} <em>{firstName}</em>.
        </Greeting>
        <Body data-component-id="Body">{t("about.intro")}</Body>
        <Label data-component-id="Label">{t("about.interestsLabel")}</Label>
        <Muted data-component-id="Muted">{t("about.interests")}</Muted>
        <Label data-component-id="Label">{t("about.mottoLabel")}</Label>
        <Motto data-component-id="Muted">“{t("about.motto")}”</Motto>
        <ActivitiesLead data-component-id="ActivitiesLead">{t("about.activitiesIntro")}</ActivitiesLead>
        <ActivityList data-component-id="ActivityList">
          {activities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ActivityList>

        <ConnectLabel data-component-id="ConnectLabel">{t("about.connectLabel")}</ConnectLabel>
        <SocialRow data-component-id="SocialRow" aria-label={t("about.connectAria")}>
          <SocialLink
            data-component-id="SocialLink"
            href={t("about.youtubeUrl")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("about.youtubeAria")}
          >
            <FaYoutube size={20} aria-hidden />
          </SocialLink>
          <SocialLink
            data-component-id="SocialLink"
            href={t("about.instagramUrl")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("about.instagramAria")}
          >
            <FaInstagram size={20} aria-hidden />
          </SocialLink>
          <SocialLink
            data-component-id="SocialLink"
            href={t("about.linkedinUrl")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("about.linkedinAria")}
          >
            <FaLinkedin size={20} aria-hidden />
          </SocialLink>
        </SocialRow>
      </div>

      <Aside data-component-id="AboutAside">
        <Stage ref={stageRef} data-component-id="CharacterStage">
          <Rise ref={riseRef}>
            <Float>
              <Character
                data-component-id="AiCharacter"
                src={`${import.meta.env.BASE_URL}images/kaustubh-ai-character.jpg`}
                alt=""
                width={864}
                height={1152}
                loading="lazy"
                decoding="async"
              />
            </Float>
          </Rise>
        </Stage>
        <IdCard
          ref={cardRef}
          data-component-id="DeveloperId"
          aria-label={label("developerId")}
          role="group"
        >
          <Flipper ref={flipRef}>
            <FrontFace ref={frontRef} data-component-id="DeveloperIdFront">
              <Slot aria-hidden />
              <FrontPhoto
                src={`${import.meta.env.BASE_URL}images/kaustubh-dutta.png`}
                alt=""
                width={200}
                height={200}
                loading="lazy"
              />
              <FrontName>{brand}</FrontName>
            </FrontFace>
            <BackFace ref={backRef} data-component-id="DeveloperIdBack">
              <IdHeader>{label("developerId")}</IdHeader>
              <IdBody>
                <div>
                  <dt>{label("role")}</dt>
                  <dd>{t("hero.roleLine")}</dd>
                </div>
                <div>
                  <dt>{label("based")}</dt>
                  <dd>{t("hero.location")}</dd>
                </div>
                <div>
                  <dt>{label("credentials")}</dt>
                  <dd>{t("hero.badge")}</dd>
                </div>
              </IdBody>
              <Barcode aria-hidden />
            </BackFace>
          </Flipper>
        </IdCard>
      </Aside>
    </Layout>
  );
}

export function AboutSection() {
  const { rootRef, ready } = useContentFragment(["about", "hero"], {
    loadOn: "intersect",
  });

  return (
    <Section
      ref={rootRef}
      data-component-id="AboutSection"
      id="about"
      aria-labelledby="about-heading"
    >
      <AnimeReveal>{ready ? <AboutSectionBody /> : <SectionSkeleton />}</AnimeReveal>
    </Section>
  );
}
