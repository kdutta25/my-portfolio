import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";
import { GlowCard } from "../ui/GlowCard";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: 3rem 1.25rem 0;
  max-width: 1120px;
  margin: 0 auto;
`;

const Body = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.text};
  max-width: 78ch;
`;

const Label = styled.strong`
  display: block;
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Muted = styled.p`
  margin: 0.35rem 0 0;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 78ch;
`;

const ActivitiesLead = styled.p`
  margin: 1rem 0 0;
  color: ${({ theme }) => theme.colors.text};
  max-width: 78ch;
`;

const ActivityList = styled.ul`
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 78ch;

  li {
    margin: 0.15rem 0;
    padding-left: 0.15rem;
  }
`;

const ConnectLabel = styled.p`
  margin: 1.25rem 0 0.65rem;
  font-size: 0.78rem;
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

export function AboutSection() {
  const { t } = useTranslation();
  const activities = t("about.activities", {
    returnObjects: true,
  }) as string[];

  return (
    <Section id="about" aria-labelledby="about-heading">
      <AnimeReveal>
        <GlowCard data-animate>
          <SectionHeading
            headingId="about-heading"
            eyebrow={t("nav.about")}
            title={t("about.heading")}
          />
          <Body>{t("about.intro")}</Body>
          <Label>{t("about.interestsLabel")}</Label>
          <Muted>{t("about.interests")}</Muted>
          <Label>{t("about.mottoLabel")}</Label>
          <Muted>{t("about.motto")}</Muted>
          <ActivitiesLead>{t("about.activitiesIntro")}</ActivitiesLead>
          <ActivityList>
            {activities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ActivityList>

          <ConnectLabel>{t("about.connectLabel")}</ConnectLabel>
          <SocialRow aria-label={t("about.connectAria")}>
            <SocialLink
              href={t("about.youtubeUrl")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("about.youtubeAria")}
            >
              <FaYoutube size={22} aria-hidden />
            </SocialLink>
            <SocialLink
              href={t("about.instagramUrl")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("about.instagramAria")}
            >
              <FaInstagram size={22} aria-hidden />
            </SocialLink>
            <SocialLink
              href={t("about.linkedinUrl")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("about.linkedinAria")}
            >
              <FaLinkedin size={22} aria-hidden />
            </SocialLink>
          </SocialRow>
        </GlowCard>
      </AnimeReveal>
    </Section>
  );
}
