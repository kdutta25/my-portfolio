import styled from "styled-components";

/** Editorial surface — soft paper card with a hairline border */
export const GlowCard = styled.article`
  position: relative;
  padding: clamp(1.35rem, 3.5vw, 2.1rem);
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.muted};
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }
`;
