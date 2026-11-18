import styled from "styled-components";
import { AccentTitle } from "./AccentTitle";

/** Order of the top-level sections in `App.tsx`; drives the numbered eyebrows. */
const SECTION_NUMBERS: Record<string, number> = {
  "about-heading": 1,
  "experience-heading": 2,
  "skills-heading": 3,
  "projects-heading": 4,
  "education-heading": 5,
  "volunteering-heading": 6,
  "publications-heading": 7,
  "youtube-heading": 8,
  "github-heading": 9,
  "support-heading": 10,
};

const HeadingWrap = styled.div`
  margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
`;

const Eyebrow = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const IndexNo = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

const Rule = styled.span`
  display: inline-block;
  width: 2.25rem;
  height: 1px;
  background: ${({ theme }) => theme.colors.muted};
  opacity: 0.6;
`;

const Title2 = styled.h2`
  margin: 0.85rem 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.1rem, 5.4vw, 3.6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.035em;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.text};
`;

const Title3 = styled.h3`
  margin: 0.65rem 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.45rem, 3.6vw, 2.3rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.text};
`;

export interface SectionHeadingProps {
  headingId: string;
  eyebrow: string;
  title: string;
  /** Use 3 for a subsection inside another section landmark (default 2). */
  level?: 2 | 3;
}

export function SectionHeading({
  headingId,
  eyebrow,
  title,
  level = 2,
}: SectionHeadingProps) {
  const number = level === 2 ? SECTION_NUMBERS[headingId] : undefined;
  return (
    <HeadingWrap data-component-id="SectionHeading">
      <Eyebrow data-component-id="Eyebrow">
        {number ? (
          <>
            <IndexNo data-component-id="IndexNo">
              {String(number).padStart(2, "0")}
            </IndexNo>
            <Rule aria-hidden />
          </>
        ) : null}
        {eyebrow}
      </Eyebrow>
      {level === 3 ? (
        <Title3 id={headingId} data-component-id="Title3">
          <AccentTitle text={title} />
        </Title3>
      ) : (
        <Title2 id={headingId} data-component-id="Title2">
          <AccentTitle text={title} />
        </Title2>
      )}
    </HeadingWrap>
  );
}
