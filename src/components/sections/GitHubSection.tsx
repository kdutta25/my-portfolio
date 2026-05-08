import styled from "styled-components";
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

export function GitHubSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const username = t("githubActivity.username");

  const isDark = theme.mode === "dark";

  return (
    <Section id="github" aria-labelledby="github-heading">
      <AnimeReveal stagger={64}>
        <GlowCard>
          <IntroBlock data-animate>
            <SectionHeading
              headingId="github-heading"
              eyebrow={t("nav.github")}
              title={t("githubActivity.heading")}
            />
            <Sub>{t("githubActivity.subtitle")}</Sub>
          </IntroBlock>
          <CalWrap data-animate>
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
