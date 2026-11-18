import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import { ExperienceGrouped } from "../experience/ExperienceGrouped";
import type { ExperienceCompany } from "../../types/content";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: clamp(4rem, 9vw, 6.5rem) 1.25rem 0;
  max-width: 1240px;
  margin: 0 auto;
`;

const IntroBlock = styled.div``;

const BodyWrap = styled.div`
  margin-top: 0.5rem;
`;

function ExperienceSectionBody() {
  const { t } = useTranslation();
  const companies = t("experience.companies", {
    returnObjects: true,
  }) as ExperienceCompany[];

  return (
    <>
      <IntroBlock data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="experience-heading"
          eyebrow={t("nav.experience")}
          title={t("experience.heading")}
        />
      </IntroBlock>
      <BodyWrap data-component-id="BodyWrap" data-animate>
        <ExperienceGrouped companies={companies} />
      </BodyWrap>
    </>
  );
}

export function ExperienceSection() {
  const { rootRef, ready } = useContentFragment("experience", { loadOn: "intersect" });

  return (
    <Section
      ref={rootRef}
      data-component-id="ExperienceSection"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <AnimeReveal stagger={52}>
        {ready ? <ExperienceSectionBody /> : <SectionSkeleton />}
      </AnimeReveal>
    </Section>
  );
}
