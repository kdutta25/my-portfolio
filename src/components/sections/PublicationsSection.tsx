import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import type { PublicationItem } from "../../types/content";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: clamp(4rem, 9vw, 6.5rem) 1.25rem 0;
  max-width: 1240px;
  margin: 0 auto;
`;

const Stack = styled.ol`
  margin: 0;
  padding: 0.5rem;
  list-style: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Item = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem 1.25rem;
  padding: 1.15rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background 0.25s ease, color 0.25s ease;

  & + & {
    box-shadow: 0 -1px 0 ${({ theme }) => theme.colors.border};
  }

  &:hover,
  &:focus-within {
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.onInk};
    box-shadow: none;
  }

  &:hover + &,
  &:focus-within + & {
    box-shadow: none;
  }

  @media (max-width: 600px) {
    grid-template-columns: 3rem minmax(0, 1fr);
    padding: 1rem 0.75rem;
  }
`;

const Num = styled.span`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 2.4rem;
  line-height: 1;
  opacity: 0.8;
`;

const TextCol = styled.div`
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.35;
  color: inherit;
`;

const MetaLine = styled.p`
  margin: 0.35rem 0 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.74rem;
  line-height: 1.5;
  opacity: 0.75;
`;

const MetaLabel = styled.span`
  font-weight: 600;
  margin-right: 0.35rem;
`;

const Link = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid currentColor;
  color: inherit;
  font-weight: 600;
  font-size: 0.78rem;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: inherit;
  }

  /* Whole row is the click target; the pill stays the focusable element. */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    grid-column: 2;
    justify-self: start;
  }
`;

function PublicationsSectionBody() {
  const { t } = useTranslation();
  const items = t("publications.items", {
    returnObjects: true,
  }) as PublicationItem[];

  return (
    <>
      <div data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="publications-heading"
          eyebrow={t("nav.publications")}
          title={t("publications.heading")}
        />
      </div>
      <Stack data-component-id="Stack" data-animate>
        {items.map((item, idx) => (
          <Item data-component-id="Item" key={item.title}>
            <Num aria-hidden>{String(idx + 1).padStart(2, "0")}</Num>
            <TextCol>
              <Title data-component-id="Title">{item.title}</Title>
              <MetaLine data-component-id="MetaLine">
                <MetaLabel data-component-id="MetaLabel">{t("publications.referenceLabel")}</MetaLabel>
                {item.meta}
              </MetaLine>
            </TextCol>
            <Link href={item.url} target="_blank" rel="noopener noreferrer">
              {t("publications.viewLink")} <span aria-hidden>↗</span>
            </Link>
          </Item>
        ))}
      </Stack>
    </>
  );
}

export function PublicationsSection() {
  const { rootRef, ready } = useContentFragment("publications", { loadOn: "intersect" });

  return (
    <Section
      ref={rootRef}
      data-component-id="PublicationsSection"
      id="publications"
      aria-labelledby="publications-heading"
    >
      <AnimeReveal stagger={54}>
        {ready ? <PublicationsSectionBody /> : <SectionSkeleton />}
      </AnimeReveal>
    </Section>
  );
}
