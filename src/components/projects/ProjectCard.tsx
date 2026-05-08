import styled from "styled-components";
import type { ProjectItem } from "../../types/content";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";

const Card = styled.article`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  transition: border-color 0.25s ease, transform 0.35s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    transform: translateY(-4px);
  }
`;

const Thumb = styled.div<{ $hue: number }>`
  aspect-ratio: 16 / 10;
  width: 100%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accentSoft},
    hsl(${(p) => p.$hue}, 35%, 88%) 45%,
    ${({ theme }) => theme.colors.bg} 100%
  );

  html[data-bs-theme="dark"] & {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.accentSoft},
      hsl(${(p) => p.$hue}, 40%, 22%) 50%,
      ${({ theme }) => theme.colors.bg} 100%
    );
  }
`;

const ThumbImageWrap = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  width: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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
  padding: 1.25rem 1.35rem 1.35rem;
`;

const Title = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  line-height: 1.25;
`;

const Period = styled.p`
  margin: 0.45rem 0 0;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.muted};
  font-family: ${({ theme }) => theme.fonts.mono};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Desc = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.92rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.65;
`;

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.85rem;
`;

const Pill = styled.span`
  font-size: 0.68rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  font-family: ${({ theme }) => theme.fonts.mono};
  letter-spacing: 0.04em;
`;

const BtnRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Btn = styled.a`
  display: inline-flex;
  padding: 0.5rem 0.95rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  border: 2px solid ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.bg};
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
}

export function ProjectCard({ item }: ProjectCardProps) {
  const tags = item.tags ?? [];
  const hue = hueFromString(item.title);
  const href =
    item.url && item.linkLabel ? resolvePublicAsset(item.url) : "";
  const hrefSecondary =
    item.secondaryUrl && item.secondaryLinkLabel
      ? resolvePublicAsset(item.secondaryUrl)
      : "";

  return (
    <Card data-component-id="ProjectCard">
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
                {item.linkLabel}
              </Btn>
            ) : null}
            {hrefSecondary ? (
              <Btn
                data-component-id="Btn"
                href={hrefSecondary}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.secondaryLinkLabel}
              </Btn>
            ) : null}
          </BtnRow>
        ) : null}
      </Body>
    </Card>
  );
}
