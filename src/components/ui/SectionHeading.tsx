import styled from "styled-components";

const HeadingWrap = styled.div`
  margin-bottom: clamp(1.5rem, 4vw, 2.25rem);
`;

const Eyebrow = styled.span`
  display: block;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.sans};
`;

const Title2 = styled.h2`
  margin: 0.5rem 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  white-space: pre-line;
`;

const Title3 = styled.h3`
  margin: 0.5rem 0 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.35rem, 3.6vw, 2.15rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  white-space: pre-line;
`;

const Bar = styled.span`
  display: block;
  width: min(120px, 28vw);
  height: 5px;
  margin-top: 1rem;
  background: ${({ theme }) => theme.colors.text};
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
  const Title = level === 3 ? Title3 : Title2;
  return (
    <HeadingWrap>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Title id={headingId}>{title}</Title>
      <Bar aria-hidden />
    </HeadingWrap>
  );
}
