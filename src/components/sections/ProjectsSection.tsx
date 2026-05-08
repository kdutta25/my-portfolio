import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { GlowCard } from "../ui/GlowCard";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import { ProjectCard } from "../projects/ProjectCard";
import type { ProjectItem } from "../../types/content";

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
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
`;

const Item = styled.li``;

const IntroBlock = styled.div``;

export function ProjectsSection() {
  const { t } = useTranslation();
  const items = t("projects.items", { returnObjects: true }) as ProjectItem[];

  return (
    <Section id="projects" aria-labelledby="projects-heading">
      <AnimeReveal stagger={56}>
        <GlowCard>
          <IntroBlock data-animate>
            <SectionHeading
              headingId="projects-heading"
              eyebrow={t("nav.projects")}
              title={t("projects.heading")}
            />
          </IntroBlock>
          <Stack>
            {items.map((item) => (
              <Item key={item.title} data-animate>
                <ProjectCard item={item} />
              </Item>
            ))}
          </Stack>
        </GlowCard>
      </AnimeReveal>
    </Section>
  );
}
