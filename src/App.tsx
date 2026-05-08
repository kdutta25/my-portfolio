import { useCallback, useEffect, useRef, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import anime from "animejs";
import styled from "styled-components";
import { GlobalStyle } from "./theme/GlobalStyle";
import { AppThemeProvider } from "./theme/AppThemeProvider";
import { i18n } from "./i18n";
import { MOTION } from "./animations/constants";
import { isTestEnv } from "./utils/isTestEnv";
import { SkipLink } from "./components/layout/SkipLink";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SeoHead } from "./components/SeoHead";
import { LoadingScreen } from "./components/loading/LoadingScreen";
import { HeroSection } from "./components/sections/HeroSection";
import { AboutSection } from "./components/sections/AboutSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { SkillsSection } from "./components/sections/SkillsSection";
import { EducationSection } from "./components/sections/EducationSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { PortfolioChatbot } from "./components/chat/PortfolioChatbot";
import { GitHubSection } from "./components/sections/GitHubSection";
import { BuyMeCoffeeSection } from "./components/sections/BuyMeCoffeeSection";
import { VolunteeringSection } from "./components/sections/VolunteeringSection";
import { PublicationsSection } from "./components/sections/PublicationsSection";
import { useTranslation } from "react-i18next";

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

export default function App() {
  const { t } = useTranslation();
  const shellRef = useRef<HTMLDivElement>(null);
  const [contentReady, setContentReady] = useState(() => isTestEnv());

  const onLoadingDone = useCallback(() => {
    setContentReady(true);
  }, []);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    if (!contentReady) {
      if (!isTestEnv()) el.style.opacity = "0";
      return;
    }

    if (isTestEnv()) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      el.style.opacity = "1";
      return;
    }

    el.style.opacity = "0";
    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: MOTION.duration.entrance,
      easing: MOTION.easing.cinematic,
    });
  }, [contentReady]);

  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <AppThemeProvider>
          <GlobalStyle />
          <SeoHead />
          {!isTestEnv() && !contentReady ? (
            <LoadingScreen onReady={onLoadingDone} />
          ) : null}
          <Shell data-component-id="Shell" id="top" ref={shellRef}>
            <SkipLink href="#main-content" label={t("nav.skip")} />
            <SiteHeader />
            <Main data-component-id="Main" id="main-content" tabIndex={-1}>
              <HeroSection />
              <AboutSection />
              <ExperienceSection />
              <SkillsSection />
              <ProjectsSection />
              <EducationSection />
              <VolunteeringSection />
              <PublicationsSection />
              <GitHubSection />
              <BuyMeCoffeeSection />
            </Main>
            <SiteFooter />
          </Shell>
          <PortfolioChatbot />
        </AppThemeProvider>
      </I18nextProvider>
    </HelmetProvider>
  );
}
