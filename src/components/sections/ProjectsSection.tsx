import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { useUiLabels } from "../../i18n/uiLabels";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import { ProjectCard } from "../projects/ProjectCard";
import type { ProjectItem } from "../../types/content";

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

const Hint = styled.p`
  display: none;
  margin: 0 0 clamp(1.75rem, 4vw, 2.75rem);
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};

  @media (min-width: 992px) {
    display: block;
  }
`;

const Accordion = styled.div`
  display: grid;
  gap: 1.25rem;

  @media (min-width: 992px) {
    display: flex;
    gap: 0.75rem;
    height: 470px;
  }
`;

function ProjectsSectionBody() {
  const { t } = useTranslation();
  const label = useUiLabels();
  const items = t("projects.items", { returnObjects: true }) as ProjectItem[];
  const [active, setActive] = useState(0);

  return (
    <>
      <IntroBlock data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="projects-heading"
          eyebrow={t("nav.projects")}
          title={t("projects.heading")}
        />
        <Hint>{label("expandHint")}</Hint>
      </IntroBlock>
      <Accordion data-component-id="ProjectAccordion" data-animate>
        {items.map((item, idx) => (
          <ProjectCard
            key={item.title}
            item={item}
            index={idx}
            expanded={active === idx}
            onActivate={() => setActive(idx)}
          />
        ))}
      </Accordion>
    </>
  );
}

export function ProjectsSection() {
  const { rootRef, ready } = useContentFragment("projects", { loadOn: "intersect" });

  return (
    <Section
      ref={rootRef}
      data-component-id="ProjectsSection"
      id="projects"
      aria-labelledby="projects-heading"
    >
      <AnimeReveal stagger={56}>
        {ready ? <ProjectsSectionBody /> : <SectionSkeleton />}
      </AnimeReveal>
    </Section>
  );
}
