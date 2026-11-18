import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import {
  CardTag,
  TimelineCard,
  TimelineEntry,
  YearTimeline,
  startYear,
} from "../ui/YearTimeline";
import type { EducationItem } from "../../types/content";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: clamp(4rem, 9vw, 6.5rem) 1.25rem 0;
  max-width: 1240px;
  margin: 0 auto;
`;

const ItemInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1rem 1.25rem;
`;

const LogoWrap = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  padding: 0.45rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }
`;

const TextCol = styled.div`
  flex: 1 1 220px;
  min-width: 0;
`;

const IntroBlock = styled.div``;

const TopRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const School = styled.h3`
  margin: 0.7rem 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.015em;
`;

const Degree = styled.p`
  margin: 0.35rem 0 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.ink};
`;

const Period = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.muted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Detail = styled.p`
  margin: 0.55rem 0 0;
  color: ${({ theme }) => theme.colors.text};
`;

function EducationSectionBody() {
  const { t } = useTranslation();
  const items = t("education.items", { returnObjects: true }) as EducationItem[];

  return (
    <>
      <IntroBlock data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="education-heading"
          eyebrow={t("nav.education")}
          title={t("education.heading")}
        />
      </IntroBlock>
      <div data-animate>
        <YearTimeline>
          {items.map((item) => (
            <TimelineEntry key={item.school} year={startYear(item.period)}>
              <TimelineCard data-component-id="Item">
                <ItemInner data-component-id="ItemInner">
                  {item.logo ? (
                    <LogoWrap data-component-id="LogoWrap">
                      <img
                        src={resolvePublicAsset(item.logo)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </LogoWrap>
                  ) : null}
                  <TextCol data-component-id="TextCol">
                    <TopRow>
                      <CardTag aria-hidden>{t("nav.education")}</CardTag>
                      <Period data-component-id="Period">{item.period}</Period>
                    </TopRow>
                    <School data-component-id="School">{item.school}</School>
                    <Degree data-component-id="Degree">{item.degree}</Degree>
                    {item.detail ? <Detail data-component-id="Detail">{item.detail}</Detail> : null}
                  </TextCol>
                </ItemInner>
              </TimelineCard>
            </TimelineEntry>
          ))}
        </YearTimeline>
      </div>
    </>
  );
}

export function EducationSection() {
  const { rootRef, ready } = useContentFragment("education", { loadOn: "intersect" });

  return (
    <Section
      ref={rootRef}
      data-component-id="EducationSection"
      id="education"
      aria-labelledby="education-heading"
    >
      <AnimeReveal stagger={60}>
        {ready ? <EducationSectionBody /> : <SectionSkeleton />}
      </AnimeReveal>
    </Section>
  );
}
