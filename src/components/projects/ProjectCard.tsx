import styled, { css } from "styled-components";
import type { ProjectItem } from "../../types/content";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";

const DESKTOP = "(min-width: 992px)";

const Card = styled.article<{ $expanded: boolean }>`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;

  @media ${DESKTOP} {
    display: flex;
    min-width: 0;
    flex: ${({ $expanded }) => ($expanded ? "7 1 0" : "1 1 0")};
    transition:
      flex 600ms cubic-bezier(0.2, 0.7, 0.2, 1),
      background-color 300ms ease;
    background: ${({ $expanded, theme }) =>
      $expanded ? theme.colors.surface : theme.colors.bgElevated};
  }
`;

const Tab = styled.button<{ $expanded: boolean }>`
  display: none;

  @media ${DESKTOP} {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: ${({ $expanded }) => ($expanded ? "none" : "flex")};
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 0;
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    font-family: inherit;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.colors.accentSoft};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.focusRing};
      outline-offset: -4px;
    }
  }
`;

const TabNumber = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const TabTitle = styled.span`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 340px;
`;

const TabPlus = styled.span`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1.1rem;
`;

const Content = styled.div<{ $expanded: boolean }>`
  @media ${DESKTOP} {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    width: 100%;
    min-width: 640px;
    ${({ $expanded }) =>
      $expanded
        ? css`
            opacity: 1;
            visibility: visible;
            transition: opacity 400ms ease 200ms;
          `
        : css`
            opacity: 0;
            visibility: hidden;
          `}
  }
`;

const ThumbImageWrap = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  width: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgElevated};

  @media ${DESKTOP} {
    aspect-ratio: auto;
    height: 100%;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Thumb = styled(ThumbImageWrap)<{ $hue: number }>`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accentSoft},
    hsl(${(p) => p.$hue}, 35%, 88%) 45%,
    ${({ theme }) => theme.colors.bg} 100%
  );
`;

const ThumbImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: clamp(1.25rem, 3vw, 2rem);
`;

const Index = styled.span`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 2.6rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.accent};
`;

const Title = styled.h3`
  margin: 0.75rem 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.25rem, 2.4vw, 1.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.ink};
`;

const Period = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.74rem;
  color: ${({ theme }) => theme.colors.muted};
  font-family: ${({ theme }) => theme.fonts.mono};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Desc = styled.p`
  margin: 1rem 0 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
`;

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 1rem;
`;

const Pill = styled.span`
  font-size: 0.7rem;
  padding: 0.3rem 0.65rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const BtnRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1.25rem;
`;

const Btn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.05rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.ink};
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease;

  &:first-child {
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.onInk};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.onInk};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * (i + 1)) % 360;
  return h;
}

export interface ProjectCardProps {
  item: ProjectItem;
  index: number;
  /** Desktop accordion state; on narrow screens every card is shown open. */
  expanded: boolean;
  onActivate: () => void;
}

export function ProjectCard({ item, index, expanded, onActivate }: ProjectCardProps) {
  const tags = item.tags ?? [];
  const hue = hueFromString(item.title);
  const number = String(index + 1).padStart(2, "0");
  const contentId = `project-${index}-content`;
  const href =
    item.url && item.linkLabel ? resolvePublicAsset(item.url) : "";
  const hrefSecondary =
    item.secondaryUrl && item.secondaryLinkLabel
      ? resolvePublicAsset(item.secondaryUrl)
      : "";

  return (
    <Card
      data-component-id="ProjectCard"
      $expanded={expanded}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <Tab
        type="button"
        $expanded={expanded}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={onActivate}
      >
        <TabNumber>{number}</TabNumber>
        <TabTitle>{item.title}</TabTitle>
        <TabPlus aria-hidden>+</TabPlus>
      </Tab>
      <Content id={contentId} $expanded={expanded}>
        {item.coverImage ? (
          <ThumbImageWrap data-component-id="ThumbImageWrap">
            <ThumbImg
              data-component-id="ThumbImg"
              src={resolvePublicAsset(item.coverImage)}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </ThumbImageWrap>
        ) : (
          <Thumb data-component-id="Thumb" aria-hidden $hue={hue} />
        )}
        <Body data-component-id="Body">
          <Index aria-hidden>{number}</Index>
          <Title data-component-id="Title">{item.title}</Title>
          <Period data-component-id="Period">{item.period}</Period>
          <Desc data-component-id="Desc">{item.description}</Desc>
          {tags.length > 0 ? (
            <Pills data-component-id="Pills">
              {tags.map((tag) => (
                <Pill data-component-id="Pill" key={tag}>{tag}</Pill>
              ))}
            </Pills>
          ) : null}
          {href || hrefSecondary ? (
            <BtnRow data-component-id="BtnRow">
              {href ? (
                <Btn data-component-id="Btn" href={href} target="_blank" rel="noopener noreferrer">
                  {item.linkLabel} <span aria-hidden>↗</span>
                </Btn>
              ) : null}
              {hrefSecondary ? (
                <Btn
                  data-component-id="Btn"
                  href={hrefSecondary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.secondaryLinkLabel} <span aria-hidden>↗</span>
                </Btn>
              ) : null}
            </BtnRow>
          ) : null}
        </Body>
      </Content>
    </Card>
  );
}
