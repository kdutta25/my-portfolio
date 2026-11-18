import styled from "styled-components";
import { SiBuymeacoffee } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: clamp(4rem, 9vw, 6.5rem) 1.25rem clamp(3rem, 6vw, 4.5rem);
  max-width: 1240px;
  margin: 0 auto;
`;

const Banner = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 1.5rem 3rem;
  padding: clamp(1.75rem, 5vw, 3.25rem);
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onInk};
  box-shadow: ${({ theme }) => theme.shadows.soft};

  h2,
  h2 em,
  [data-component-id="Eyebrow"],
  [data-component-id="IndexNo"] {
    color: ${({ theme }) => theme.colors.onInk};
  }

  &::after {
    content: "☕";
    position: absolute;
    right: -1rem;
    top: -2.5rem;
    font-size: 12rem;
    opacity: 0.06;
    pointer-events: none;
  }

  @media (max-width: 767.98px) {
    grid-template-columns: 1fr;
  }
`;

const Lead = styled.p`
  margin: 0;
  max-width: 38rem;
  font-size: 1rem;
  line-height: 1.65;
  opacity: 0.8;
`;

const CoffeeLink = styled.a`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.85rem 1.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 700;
  font-size: 0.92rem;
  text-decoration: none;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.onInk};
  transition: transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
    transform: translateY(-2px);
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
    <Banner data-component-id="SupportBanner" data-animate>
      <div>
        <SectionHeading
          headingId="support-heading"
          eyebrow={t("support.eyebrow")}
          title={t("support.heading")}
        />
        <Lead data-component-id="Lead">{t("support.lead")}</Lead>
      </div>
      <div data-component-id="CtaRow">
        <CoffeeLink data-component-id="CoffeeLink" href={url} target="_blank" rel="noopener noreferrer">
          <SiBuymeacoffee size={20} aria-hidden />
          {t("support.cta")}
        </CoffeeLink>
      </div>
    </Banner>
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
        {ready ? <BuyMeCoffeeSectionBody /> : <SectionSkeleton />}
      </AnimeReveal>
    </Section>
  );
}
