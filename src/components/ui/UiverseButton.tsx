import type { ButtonHTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

const Btn = styled.button`
  position: relative;
  cursor: pointer;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.75rem 1.35rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.bg};
  background: ${({ theme }) => theme.colors.text};
  transition: transform 180ms ease, opacity 180ms ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.92;
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
