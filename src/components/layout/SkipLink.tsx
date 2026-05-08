import styled from "styled-components";

const Anchor = styled.a`
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  z-index: 50;
  padding: 0.45rem 0.85rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  text-decoration: none;
  transform: translateY(-160%);
  transition: transform 160ms ease;

  &:focus {
    transform: translateY(0);
  }
`;

export interface SkipLinkProps {
  href: string;
  label: string;
}

export function SkipLink({ href, label }: SkipLinkProps) {
  return <Anchor data-component-id="SkipLink" href={href}>{label}</Anchor>;
}
