import styled from "styled-components";
import { FaGithub } from "react-icons/fa";
import { GitHubCalendar } from "react-github-calendar";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { GlowCard } from "../ui/GlowCard";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: clamp(4rem, 9vw, 6.5rem) 1.25rem 0;
  max-width: 1240px;
  margin: 0 auto;
`;

const IntroBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0 2rem;
`;

const IntroAside = styled.div`
  margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
  max-width: 22rem;
`;

const CalCard = styled(GlowCard)`
  padding: clamp(1.1rem, 3vw, 1.75rem);
`;

const CalWrap = styled.div`
  overflow-x: auto;
  padding-bottom: 0.25rem;

  svg {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Sub = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 1.3rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
`;

const ProfileLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onInk};
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.onInk};
    opacity: 0.92;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

function GitHubSectionBody() {
  const { t } = useTranslation();
  const theme = useTheme();
  const username = t("githubActivity.username");

  const isDark = theme.mode === "dark";

  return (
    <>
      <IntroBlock data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="github-heading"
          eyebrow={t("nav.github")}
          title={t("githubActivity.heading")}
        />
        <IntroAside>
          <Sub data-component-id="Sub">{t("githubActivity.subtitle")}</Sub>
          <ProfileLink
            data-component-id="ProfileLink"
            href={t("footer.github")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={16} aria-hidden />
            {t("githubActivity.profileLink", { user: username })}
          </ProfileLink>
        </IntroAside>
      </IntroBlock>
      <CalCard as="div" data-component-id="GlowCard" data-animate>
        <CalWrap data-component-id="CalWrap">
          <GitHubCalendar
            username={username}
            colorScheme={isDark ? "dark" : "light"}
            fontSize={12}
            blockSize={13}
            blockMargin={4}
          />
        </CalWrap>
      </CalCard>
    </>
  );
}

export function GitHubSection() {
  const { rootRef, ready } = useContentFragment("githubActivity", { loadOn: "intersect" });

  return (
    <Section
      ref={rootRef}
      data-component-id="GitHubSection"
      id="github"
      aria-labelledby="github-heading"
    >
      <AnimeReveal stagger={64}>
        {ready ? <GitHubSectionBody /> : <SectionSkeleton />}
      </AnimeReveal>
    </Section>
  );
}
