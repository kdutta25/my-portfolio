import styled from "styled-components";
import { FaGithub } from "react-icons/fa";
import { GitHubCalendar } from "react-github-calendar";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { GlowCard } from "../ui/GlowCard";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: 3rem 1.25rem 0;
  max-width: 1120px;
  margin: 0 auto;
`;

const IntroBlock = styled.div``;

const CalWrap = styled.div`
  margin-top: 1.25rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  svg {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Sub = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const ProfileLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.75rem;
  font-size: 0.88rem;
  font-weight: 650;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export function GitHubSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const username = t("githubActivity.username");

  const isDark = theme.mode === "dark";

  return (
    <Section data-component-id="GitHubSection" id="github" aria-labelledby="github-heading">
      <AnimeReveal stagger={64}>
        <GlowCard data-component-id="GlowCard">
          <IntroBlock data-component-id="IntroBlock" data-animate>
            <SectionHeading
              headingId="github-heading"
              eyebrow={t("nav.github")}
              title={t("githubActivity.heading")}
            />
            <Sub data-component-id="Sub">{t("githubActivity.subtitle")}</Sub>
            <ProfileLink
              data-component-id="ProfileLink"
              href={t("footer.github")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={18} aria-hidden />
              {t("githubActivity.profileLink", { user: username })}
            </ProfileLink>
          </IntroBlock>
          <CalWrap data-component-id="CalWrap" data-animate>
            <GitHubCalendar
              username={username}
              colorScheme={isDark ? "dark" : "light"}
              fontSize={12}
              blockSize={11}
              blockMargin={3}
            />
          </CalWrap>
        </GlowCard>
      </AnimeReveal>
    </Section>
  );
}
