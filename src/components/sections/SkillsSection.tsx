import { useState } from "react";
import styled, { css, useTheme, type DefaultTheme } from "styled-components";
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
  SiPerl,
  SiAngular,
  SiD3,
  SiOpenlayers,
  SiFormik,
  SiCodemirror,
  SiStorybook,
  SiVitest,
  SiJest,
  SiCypress,
  SiEslint,
  SiDocker,
  SiKubernetes,
  SiHelm,
  SiGitlab,
  SiTurborepo,
  SiPnpm,
  SiMariadb,
  SiScrumalliance,
} from "react-icons/si";
import {
  TbChartAreaLine,
  TbChartBar,
  TbFilter,
  TbMath,
  TbPuzzle,
  TbRobot,
  TbSql,
  TbTable,
} from "react-icons/tb";
import type { IconType } from "react-icons/lib";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { useUiLabels, type UiLabelKey } from "../../i18n/uiLabels";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import type { AiModelItem } from "../../types/content";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";

type Family = "languages" | "web" | "data" | "testing" | "devops" | "tools" | "ai";

const FAMILIES: { id: Family; label: UiLabelKey }[] = [
  { id: "languages", label: "familyLanguages" },
  { id: "web", label: "familyWeb" },
  { id: "data", label: "familyData" },
  { id: "testing", label: "familyTesting" },
  { id: "devops", label: "familyDevops" },
  { id: "tools", label: "familyTools" },
  { id: "ai", label: "familyAi" },
];

/**
 * `labelKey` items read their label from the skills fragment; `name` items are
 * product names from the résumé that read the same in every language.
 */
type CombinedItem = {
  Icon: IconType;
  symbol: string;
  family: Family;
} & (
  | { kind: "skill" | "tool"; labelKey: string }
  | { kind: "resume"; name: string }
);

const COMBINED_ITEMS: CombinedItem[] = [
  { Icon: DiJavascript1, labelKey: "javascript", kind: "skill", symbol: "Js", family: "languages" },
  { Icon: SiTypescript, labelKey: "typescript", kind: "skill", symbol: "Ts", family: "languages" },
  { Icon: DiPython, labelKey: "python", kind: "skill", symbol: "Py", family: "languages" },
  { Icon: DiJava, labelKey: "java", kind: "skill", symbol: "Jv", family: "languages" },
  { Icon: CgCPlusPlus, labelKey: "cpp", kind: "skill", symbol: "C+", family: "languages" },
  { Icon: SiPerl, name: "Perl", kind: "resume", symbol: "Pl", family: "languages" },
  { Icon: TbSql, name: "SQL", kind: "resume", symbol: "Sl", family: "languages" },
  { Icon: TbMath, name: "DAX", kind: "resume", symbol: "Dx", family: "languages" },

  { Icon: DiReact, labelKey: "react", kind: "skill", symbol: "Re", family: "web" },
  { Icon: SiAngular, name: "Angular", kind: "resume", symbol: "An", family: "web" },
  { Icon: CgDisplayFlex, labelKey: "htmlCss", kind: "skill", symbol: "Hc", family: "web" },
  { Icon: DiNodejs, labelKey: "nodejs", kind: "skill", symbol: "No", family: "web" },
  { Icon: SiWebpack, labelKey: "webpack", kind: "tool", symbol: "Wp", family: "web" },
  { Icon: TbPuzzle, name: "Module Federation", kind: "resume", symbol: "Mf", family: "web" },
  { Icon: SiVite, labelKey: "vite", kind: "tool", symbol: "Vi", family: "web" },
  { Icon: TbTable, name: "AG Grid", kind: "resume", symbol: "Ag", family: "web" },
  { Icon: TbChartAreaLine, name: "Highcharts", kind: "resume", symbol: "Hi", family: "web" },
  { Icon: SiD3, name: "D3", kind: "resume", symbol: "D3", family: "web" },
  { Icon: SiOpenlayers, name: "OpenLayers", kind: "resume", symbol: "Ol", family: "web" },
  { Icon: SiFormik, name: "Formik", kind: "resume", symbol: "Fk", family: "web" },
  { Icon: SiCodemirror, name: "CodeMirror", kind: "resume", symbol: "Cm", family: "web" },
  { Icon: SiStorybook, name: "Storybook", kind: "resume", symbol: "Sb", family: "web" },

  { Icon: SiMysql, labelKey: "mysql", kind: "skill", symbol: "Sq", family: "data" },
  { Icon: DiMongodb, labelKey: "mongodb", kind: "skill", symbol: "Mg", family: "data" },
  { Icon: SiMariadb, name: "MariaDB", kind: "resume", symbol: "Md", family: "data" },
  { Icon: TbChartBar, name: "Power BI", kind: "resume", symbol: "Bi", family: "data" },
  { Icon: TbFilter, name: "Power Query", kind: "resume", symbol: "Pq", family: "data" },

  { Icon: SiVitest, name: "Vitest", kind: "resume", symbol: "Vt", family: "testing" },
  { Icon: SiJest, name: "Jest", kind: "resume", symbol: "Jt", family: "testing" },
  { Icon: SiCypress, name: "Cypress", kind: "resume", symbol: "Cy", family: "testing" },
  { Icon: SiEslint, name: "ESLint", kind: "resume", symbol: "Es", family: "testing" },

  { Icon: SiDocker, name: "Docker", kind: "resume", symbol: "Dk", family: "devops" },
  { Icon: SiKubernetes, name: "Kubernetes", kind: "resume", symbol: "K8", family: "devops" },
  { Icon: SiHelm, name: "Helm", kind: "resume", symbol: "Hm", family: "devops" },
  { Icon: SiJenkins, labelKey: "jenkins", kind: "tool", symbol: "Je", family: "devops" },
  { Icon: SiGitlab, name: "GitLab CI", kind: "resume", symbol: "Gl", family: "devops" },
  { Icon: SiTurborepo, name: "Turborepo", kind: "resume", symbol: "Tr", family: "devops" },
  { Icon: SiPnpm, name: "pnpm", kind: "resume", symbol: "Pn", family: "devops" },
  { Icon: SiPodman, labelKey: "podman", kind: "tool", symbol: "Pd", family: "devops" },
  { Icon: SiJfrog, labelKey: "jfrog", kind: "tool", symbol: "Jf", family: "devops" },

  { Icon: DiGit, labelKey: "git", kind: "skill", symbol: "Gt", family: "tools" },
  { Icon: SiPostman, labelKey: "postman", kind: "tool", symbol: "Pm", family: "tools" },
  { Icon: SiJira, labelKey: "jira", kind: "tool", symbol: "Ji", family: "tools" },
  { Icon: SiScrumalliance, name: "Scrum", kind: "resume", symbol: "Sc", family: "tools" },

  { Icon: TbRobot, name: "Cursor AI agents", kind: "resume", symbol: "Cu", family: "ai" },
];

const SKILLS_AND_MODEL_FRAGMENTS = ["skills", "aiModels"] as const;

function familyColors(theme: DefaultTheme, family: Family): { bg: string; fg: string } {
  const dark = theme.mode === "dark";
  switch (family) {
    case "languages":
      return dark ? { bg: "#e9e3d6", fg: "#14161d" } : { bg: "#232b45", fg: "#f7f3ea" };
    case "web":
      return dark ? { bg: "#6b5a45", fg: "#f7f0e4" } : { bg: "#b89c7d", fg: "#1f1a14" };
    case "data":
      return dark ? { bg: "#4a5266", fg: "#eef0f6" } : { bg: "#d9cdb8", fg: "#1f1a14" };
    case "testing":
      return dark ? { bg: "#3d5a4c", fg: "#eaf5ee" } : { bg: "#c7d3c3", fg: "#18241c" };
    case "devops":
      return dark ? { bg: "#3a4a6b", fg: "#eef2fb" } : { bg: "#a9b6cf", fg: "#141b2b" };
    case "tools":
      return dark ? { bg: "#2a2c35", fg: "#e9e5dc" } : { bg: "#ede5d6", fg: "#1f1a14" };
    case "ai":
      return dark ? { bg: "#5a3420", fg: "#ffe7d6" } : { bg: "#f4d3bd", fg: "#3b1a08" };
  }
}

type Selected = {
  key: string;
  number: number;
  symbol: string;
  label: string;
  family: Family;
  Icon?: IconType;
  image?: string;
};

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: clamp(4rem, 9vw, 6.5rem) 1.25rem 0;
  max-width: 1240px;
  margin: 0 auto;
`;

const IntroBlock = styled.div`
  margin-bottom: 0.5rem;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
  gap: clamp(1.25rem, 3vw, 2.5rem);
  align-items: start;

  @media (max-width: 991.98px) {
    grid-template-columns: 1fr;
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 1.25rem;
`;

const ChipsLabel = styled.span`
  margin-right: 0.35rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const Chip = styled.button<{ $swatch?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.85rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &::before {
    content: "";
    display: ${({ $swatch }) => ($swatch ? "inline-block" : "none")};
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 3px;
    background: ${({ $swatch }) => $swatch};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }

  &[aria-pressed="true"] {
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.onInk};
    border-color: ${({ theme }) => theme.colors.ink};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

const Table = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 0.5rem;

  @media (max-width: 480px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.4rem;
  }
`;

const Tile = styled.button<{ $bg: string; $fg: string; $dim: boolean; $active: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.45rem 0.55rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  opacity: ${({ $dim }) => ($dim ? 0.22 : 1)};
  transition:
    transform 0.2s ease,
    opacity 0.25s ease,
    box-shadow 0.2s ease;

  ${({ $active, theme }) =>
    $active &&
    css`
      transform: translateY(-3px) scale(1.04);
      box-shadow: ${theme.shadows.soft};
      outline: 2px solid ${theme.colors.accent};
      outline-offset: 2px;
    `}

  &:hover {
    transform: translateY(-3px) scale(1.04);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

const TileNumber = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.6rem;
  opacity: 0.75;
`;

const TileSymbol = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(1.3rem, 2.6vw, 1.75rem);
  line-height: 1;
  letter-spacing: -0.03em;
`;

const TileName = styled.span`
  font-size: 0.62rem;
  font-weight: 600;
  line-height: 1.15;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Panel = styled.aside`
  position: sticky;
  top: 6rem;
  padding: 1.4rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  min-height: 300px;

  @media (max-width: 991.98px) {
    position: relative;
    top: 0;
    min-height: 0;
  }
`;

const PanelElement = styled.div<{ $bg: string; $fg: string }>`
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  font-size: 4.25rem;

  img {
    max-width: 70%;
    max-height: 70%;
    object-fit: contain;
  }
`;

const PanelMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 1rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const PanelName = styled.p`
  margin: 0.35rem 0 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 2rem;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.ink};
`;

const PanelHint = styled.p`
  margin: 1rem 0 0;
  padding-top: 0.85rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const ModelsRegion = styled.div`
  margin-top: clamp(2rem, 5vw, 3rem);
`;

const ModelGrid = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
`;

const ModelTile = styled(Tile)`
  aspect-ratio: auto;
  min-height: 150px;
  gap: 0.5rem;
`;

const ModelImg = styled.img`
  display: block;
  width: 100%;
  max-width: 160px;
  height: 56px;
  object-fit: contain;
  object-position: left center;
`;

const ModelCaption = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
`;

function SkillsSectionBody() {
  const { t } = useTranslation();
  const label = useUiLabels();
  const theme = useTheme();
  const [family, setFamily] = useState<Family | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);

  const aiItems = t("aiModels.items", {
    returnObjects: true,
  }) as AiModelItem[];

  const tiles: Selected[] = COMBINED_ITEMS.map((item, idx) => ({
    key: `${item.kind}-${item.kind === "resume" ? item.name : item.labelKey}`,
    number: idx + 1,
    symbol: item.symbol,
    label:
      item.kind === "resume"
        ? item.name
        : item.kind === "skill"
          ? t(`skills.skillLabels.${item.labelKey}`)
          : t(`skills.toolLabels.${item.labelKey}`),
    family: item.family,
    Icon: item.Icon,
  }));

  const models: Selected[] = aiItems.map((item, idx) => ({
    key: `ai-${item.label}`,
    number: COMBINED_ITEMS.length + idx + 1,
    symbol: item.label.slice(0, 2),
    label: item.label,
    family: "ai",
    image: resolvePublicAsset(item.image),
  }));

  const familyName = (f: Family) =>
    label(FAMILIES.find((x) => x.id === f)?.label ?? "familyTools");

  const tileProps = (s: Selected) => {
    const colors = familyColors(theme, s.family);
    return {
      type: "button" as const,
      $bg: colors.bg,
      $fg: colors.fg,
      $dim: family !== null && family !== s.family,
      $active: selected?.key === s.key,
      "aria-label": `${s.label} · ${familyName(s.family)}`,
      onMouseEnter: () => setSelected(s),
      onFocus: () => setSelected(s),
      onClick: () => setSelected(s),
    };
  };

  const shown = selected ?? tiles[0];
  const panelColors = shown ? familyColors(theme, shown.family) : null;
  const PanelIcon = shown?.Icon;

  return (
    <>
      <IntroBlock data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="skills-heading"
          eyebrow={t("skills.sectionEyebrow")}
          title={t("skills.sectionHeading")}
        />
      </IntroBlock>
      <Layout data-animate>
        <div>
          <Chips role="group" aria-label={label("skillFamilies")}>
            <ChipsLabel aria-hidden>{label("skillFamilies")}</ChipsLabel>
            <Chip
              type="button"
              aria-pressed={family === null}
              onClick={() => setFamily(null)}
            >
              {label("allFamilies")}
            </Chip>
            {FAMILIES.map((f) => (
              <Chip
                key={f.id}
                type="button"
                aria-pressed={family === f.id}
                $swatch={familyColors(theme, f.id).bg}
                onClick={() => setFamily((cur) => (cur === f.id ? null : f.id))}
              >
                {label(f.label)}
              </Chip>
            ))}
          </Chips>

          <Table data-component-id="PeriodicTable">
            {tiles.map((s) => (
              <li key={s.key}>
                <Tile data-component-id="IconCard" {...tileProps(s)}>
                  <TileNumber aria-hidden>{String(s.number).padStart(2, "0")}</TileNumber>
                  <TileSymbol aria-hidden>{s.symbol}</TileSymbol>
                  <TileName data-component-id="IconCaption">{s.label}</TileName>
                </Tile>
              </li>
            ))}
          </Table>

          <ModelsRegion
            data-component-id="ModelsRegion"
            role="region"
            aria-labelledby="ai-models-heading"
          >
            <SectionHeading
              headingId="ai-models-heading"
              eyebrow={t("aiModels.sectionEyebrow")}
              title={t("aiModels.sectionHeading")}
              level={3}
            />
            <ModelGrid>
              {models.map((s) => (
                <li key={s.key}>
                  <ModelTile data-component-id="ModelCard" {...tileProps(s)}>
                    <TileNumber aria-hidden>{String(s.number).padStart(2, "0")}</TileNumber>
                    <ModelImg
                      data-component-id="ModelImg"
                      src={s.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <ModelCaption data-component-id="ModelCaption">{s.label}</ModelCaption>
                  </ModelTile>
                </li>
              ))}
            </ModelGrid>
          </ModelsRegion>
        </div>

        <Panel data-component-id="SkillPanel" aria-live="polite">
          {shown && panelColors ? (
            <>
              <PanelElement $bg={panelColors.bg} $fg={panelColors.fg} aria-hidden>
                {PanelIcon ? <PanelIcon /> : <img src={shown.image} alt="" />}
              </PanelElement>
              <PanelMeta>
                <span>{familyName(shown.family)}</span>
                <span>
                  {String(shown.number).padStart(2, "0")} · {shown.symbol}
                </span>
              </PanelMeta>
              <PanelName>{shown.label}</PanelName>
            </>
          ) : null}
          <PanelHint>{label("tileHint")}</PanelHint>
        </Panel>
      </Layout>
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
        {ready ? <SkillsSectionBody /> : <SectionSkeleton />}
      </AnimeReveal>
    </Section>
  );
}
