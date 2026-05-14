import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { GlowCard } from "../ui/GlowCard";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import type { PublicationItem } from "../../types/content";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: 3rem 1.25rem 0;
  max-width: 1120px;
  margin: 0 auto;
`;

const Stack = styled.ul`
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1.25rem;
`;

const Item = styled.li``;

const IntroBlock = styled.div``;

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.65rem 1rem;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  flex: 1 1 12rem;
  min-width: 0;

  @media (max-width: 520px) {
    flex: none;
  }
`;

const MetaLine = styled.p`
  margin: 0.45rem 0 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

const MetaLabel = styled.span`
  font-weight: 650;
  color: ${({ theme }) => theme.colors.muted};
  margin-right: 0.35rem;
`;

const Link = styled.a`
  display: inline-block;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
  font-size: 0.82rem;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    border-radius: 4px;
  }

  @media (max-width: 520px) {
    align-self: flex-end;
    white-space: normal;
    text-align: right;
    max-width: 11rem;
  }
`;

function PublicationsSectionBody() {
  const { t } = useTranslation();
  const items = t("publications.items", {
    returnObjects: true,
  }) as PublicationItem[];

  return (
    <>
      <IntroBlock data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="publications-heading"
          eyebrow={t("nav.publications")}
          title={t("publications.heading")}
        />
      </IntroBlock>
      <Stack data-component-id="Stack">
        {items.map((item) => (
          <Item data-component-id="Item" key={item.title} data-animate>
            <TitleRow data-component-id="TitleRow">
              <Title data-component-id="Title">{item.title}</Title>
              <Link href={item.url} target="_blank" rel="noopener noreferrer">
                {t("publications.viewLink")}
              </Link>
            </TitleRow>
            <MetaLine data-component-id="MetaLine">
              <MetaLabel data-component-id="MetaLabel">{t("publications.referenceLabel")}</MetaLabel>
              {item.meta}
            </MetaLine>
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
        <GlowCard data-component-id="GlowCard">
          {ready ? <PublicationsSectionBody /> : <SectionSkeleton />}
        </GlowCard>
      </AnimeReveal>
    </Section>
  );
}
