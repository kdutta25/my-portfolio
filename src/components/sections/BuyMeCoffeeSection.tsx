import styled from "styled-components";
import { SiBuymeacoffee } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { GlowCard } from "../ui/GlowCard";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: 3rem 1.25rem 0;
  max-width: 1120px;
  margin: 0 auto;
`;

const Lead = styled.p`
  margin: 1rem 0 0;
  max-width: 38rem;
  font-size: 1rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.muted};
`;

const CtaRow = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const CoffeeLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 700;
  font-size: 0.92rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.bg};
  background: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.text};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;

function BuyMeCoffeeSectionBody() {
  const { t } = useTranslation();
  const url = t("support.url");

  return (
    <div data-animate>
      <SectionHeading
        headingId="support-heading"
        eyebrow={t("support.eyebrow")}
        title={t("support.heading")}
      />
      <Lead data-component-id="Lead">{t("support.lead")}</Lead>
      <CtaRow data-component-id="CtaRow">
        <CoffeeLink data-component-id="CoffeeLink" href={url} target="_blank" rel="noopener noreferrer">
          <SiBuymeacoffee size={22} aria-hidden />
          {t("support.cta")}
        </CoffeeLink>
      </CtaRow>
    </div>
  );
}

export function BuyMeCoffeeSection() {
  const { rootRef, ready } = useContentFragment("support", { loadOn: "intersect" });

  return (
    <Section
      ref={rootRef}
      data-component-id="BuyMeCoffeeSection"
      id="support"
      aria-labelledby="support-heading"
    >
      <AnimeReveal stagger={56}>
        <GlowCard data-component-id="GlowCard">
          {ready ? <BuyMeCoffeeSectionBody /> : <SectionSkeleton />}
        </GlowCard>
      </AnimeReveal>
    </Section>
  );
}
