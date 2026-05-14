import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CgCPlusPlus, CgDisplayFlex } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiJava,
} from "react-icons/di";
import {
  SiMysql,
  SiTypescript,
  SiPostman,
  SiJenkins,
  SiJfrog,
  SiJira,
  SiWebpack,
  SiVite,
  SiPodman,
} from "react-icons/si";
import type { IconType } from "react-icons/lib";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { GlowCard } from "../ui/GlowCard";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import type { AiModelItem } from "../../types/content";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: 3rem 1.25rem 0;
  max-width: 1120px;
  margin: 0 auto;
`;

const IntroBlock = styled.div`
  margin-bottom: 1.5rem;
`;

const IconCard = styled.div`
  margin: 0.35rem;
  padding: 0.75rem 0.5rem 0.9rem;
  text-align: center;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgElevated};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 8rem;
  transition:
    transform 0.35s ease,
    border-color 0.35s ease;

  &:hover {
    transform: scale(1.04);
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

const IconGraphic = styled.span`
  font-size: clamp(3rem, 8vw, 4rem);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
`;

const IconCaption = styled.span`
  display: block;
  margin-top: 0.55rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.muted};
`;

const ModelsRegion = styled.div`
  margin-top: clamp(1.75rem, 4vw, 2.5rem);
  padding-top: clamp(1.25rem, 3vw, 2rem);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModelCard = styled.div`
  margin: 0.35rem;
  padding: 1rem 0.75rem 1.1rem;
  text-align: center;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgElevated};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  transition:
    transform 0.35s ease,
    border-color 0.35s ease;

  &:hover {
    transform: scale(1.03);
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

const ModelImg = styled.img`
  display: block;
  width: 100%;
  max-width: min(240px, 88vw);
  height: auto;
  object-fit: contain;
`;

const ModelCaption = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.colors.text};
`;

type SkillKind = "skill" | "tool";

type CombinedItem = {
  Icon: IconType;
  labelKey: string;
  kind: SkillKind;
};

const COMBINED_ITEMS: CombinedItem[] = [
  { Icon: DiJavascript1, labelKey: "javascript", kind: "skill" },
  { Icon: CgCPlusPlus, labelKey: "cpp", kind: "skill" },
  { Icon: SiTypescript, labelKey: "typescript", kind: "skill" },
  { Icon: DiNodejs, labelKey: "nodejs", kind: "skill" },
  { Icon: DiReact, labelKey: "react", kind: "skill" },
  { Icon: CgDisplayFlex, labelKey: "htmlCss", kind: "skill" },
  { Icon: DiMongodb, labelKey: "mongodb", kind: "skill" },
  { Icon: DiGit, labelKey: "git", kind: "skill" },
  { Icon: SiMysql, labelKey: "mysql", kind: "skill" },
  { Icon: DiPython, labelKey: "python", kind: "skill" },
  { Icon: DiJava, labelKey: "java", kind: "skill" },
  { Icon: SiPostman, labelKey: "postman", kind: "tool" },
  { Icon: SiJenkins, labelKey: "jenkins", kind: "tool" },
  { Icon: SiJfrog, labelKey: "jfrog", kind: "tool" },
  { Icon: SiJira, labelKey: "jira", kind: "tool" },
  { Icon: SiWebpack, labelKey: "webpack", kind: "tool" },
  { Icon: SiVite, labelKey: "vite", kind: "tool" },
  { Icon: SiPodman, labelKey: "podman", kind: "tool" },
];

const SKILLS_AND_MODEL_FRAGMENTS = ["skills", "aiModels"] as const;

function SkillsSectionBody() {
  const { t } = useTranslation();
  const aiItems = t("aiModels.items", {
    returnObjects: true,
  }) as AiModelItem[];

  return (
    <>
      <IntroBlock data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="skills-heading"
          eyebrow={t("skills.sectionEyebrow")}
          title={t("skills.sectionHeading")}
        />
      </IntroBlock>
      <Container fluid className="px-0">
        <Row className="justify-content-center">
          {COMBINED_ITEMS.map((item) => {
            const label =
              item.kind === "skill"
                ? t(`skills.skillLabels.${item.labelKey}`)
                : t(`skills.toolLabels.${item.labelKey}`);
            const Icon = item.Icon;
            return (
              <Col
                key={`${item.kind}-${item.labelKey}`}
                xs={4}
                md={2}
                className="d-flex justify-content-center mb-2 px-1"
              >
                <IconCard data-component-id="IconCard" data-animate>
                  <IconGraphic data-component-id="IconGraphic" aria-hidden>
                    <Icon />
                  </IconGraphic>
                  <IconCaption data-component-id="IconCaption">{label}</IconCaption>
                </IconCard>
              </Col>
            );
          })}
        </Row>
      </Container>
      <ModelsRegion data-component-id="ModelsRegion" role="region" aria-labelledby="ai-models-heading">
        <IntroBlock data-component-id="IntroBlock">
          <SectionHeading
            headingId="ai-models-heading"
            eyebrow={t("aiModels.sectionEyebrow")}
            title={t("aiModels.sectionHeading")}
            level={3}
          />
        </IntroBlock>
        <Container fluid className="px-0">
          <Row className="justify-content-center">
            {aiItems.map((item) => (
              <Col
                key={item.label}
                xs={12}
                sm={6}
                lg={4}
                className="d-flex justify-content-center mb-3 px-2"
              >
                <ModelCard data-component-id="ModelCard" data-animate>
                  <ModelImg
                    data-component-id="ModelImg"
                    src={resolvePublicAsset(item.image)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <ModelCaption data-component-id="ModelCaption">{item.label}</ModelCaption>
                </ModelCard>
              </Col>
            ))}
          </Row>
        </Container>
      </ModelsRegion>
    </>
  );
}

export function SkillsSection() {
  const { rootRef, ready } = useContentFragment(SKILLS_AND_MODEL_FRAGMENTS, {
    loadOn: "intersect",
  });

  return (
    <Section
      ref={rootRef}
      data-component-id="SkillsSection"
      id="skills"
      aria-labelledby="skills-heading"
    >
      <AnimeReveal stagger={52}>
        <GlowCard data-component-id="GlowCard">
          {ready ? <SkillsSectionBody /> : <SectionSkeleton />}
        </GlowCard>
      </AnimeReveal>
    </Section>
  );
}
