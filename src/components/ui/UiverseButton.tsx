import type { ButtonHTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

const Btn = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
  border: none;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0.8rem 1.45rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.9rem;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.onInk};
  background: ${({ theme }) => theme.colors.ink};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;

export interface UiverseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function UiverseButton({ children, ...rest }: UiverseButtonProps) {
  return (
    <Btn type="button" {...rest} data-component-id="UiverseButton">
      {children}
    </Btn>
  );
}
