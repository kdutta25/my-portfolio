import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useTranslation } from "react-i18next";
import { LanguageMenu } from "./LanguageMenu";
import { ThemeToggle } from "./ThemeToggle";
import { README_ON_GITHUB_URL, RESUME_PDF_URL } from "../../constants/externalLinks";

const NAV_LINKS: readonly {
  key: string;
  href: string;
  external?: true;
}[] = [
  { key: "about", href: "#about" },
  { key: "youtube", href: "#youtube" },
  { key: "experience", href: "#experience" },
  { key: "skills", href: "#skills" },
  { key: "projects", href: "#projects" },
  { key: "education", href: "#education" },
  { key: "volunteering", href: "#volunteering" },
  { key: "publications", href: "#publications" },
  { key: "github", href: "#github" },
  { key: "readme", href: README_ON_GITHUB_URL, external: true },
  { key: "support", href: "#support" },
  { key: "resume", href: RESUME_PDF_URL, external: true },
];

const SECTION_IDS = NAV_LINKS.filter((l) => !l.external).map((l) =>
  l.href.slice(1),
);

/** Tracks which section sits under the middle band of the viewport. */
function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const visible = new Map<string, boolean>();
    const observed = new Set<string>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const current = ids.find((id) => visible.get(id));
        setActive(current ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    const attach = () => {
      for (const id of ids) {
        if (observed.has(id)) continue;
        const el = document.getElementById(id);
        if (el) {
          io.observe(el);
          observed.add(id);
        }
      }
    };
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [ids]);

  return active;
}

const Banner = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem clamp(0.5rem, 2vw, 1.25rem) 0;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const glass = css`
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  background: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(24, 26, 33, 0.72)" : "rgba(255, 253, 248, 0.72)"};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const StyledNavbar = styled(Navbar)`
  padding: 0 !important;
  background: transparent !important;

  .navbar-toggler {
    ${glass};
    border-radius: ${({ theme }) => theme.radii.pill};
    padding: 0.5rem 0.75rem;
  }

  @media (max-width: 1199.98px) {
    & > .container-fluid {
      ${glass};
      border-radius: ${({ theme }) => theme.radii.lg};
      padding: 0.5rem 0.75rem;
    }
  }
`;

const Brand = styled(Navbar.Brand)`
  display: inline-flex !important;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0.9rem 0.3rem 0.3rem !important;
  margin-right: 0 !important;
  font-family: ${({ theme }) => theme.fonts.display} !important;
  font-weight: 700 !important;
  letter-spacing: -0.02em;
  font-size: 0.95rem !important;
  color: ${({ theme }) => theme.colors.text} !important;
  border-radius: ${({ theme }) => theme.radii.pill};

  @media (min-width: 1200px) {
    ${glass};
  }
`;

const Monogram = styled.span`
  display: inline-grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onInk};
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 1rem;
  font-weight: 400;
`;

const BrandName = styled.span`
  @media (min-width: 1200px) and (max-width: 1599.98px) {
    display: none;
  }
`;

const PillNav = styled(Nav)`
  gap: 0.15rem;

  @media (min-width: 1200px) {
    ${glass};
    margin-inline: auto;
    padding: 0.3rem;
    border-radius: ${({ theme }) => theme.radii.pill};
  }

  @media (max-width: 1199.98px) {
    padding-block: 0.75rem;
  }
`;

const PillLink = styled(Nav.Link)<{ $active: boolean }>`
  color: ${({ theme }) => theme.colors.muted} !important;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.45rem 0.8rem !important;
  border-radius: ${({ theme }) => theme.radii.pill};
  white-space: nowrap;
  transition:
    background-color 220ms ease,
    color 220ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text} !important;
    background: ${({ theme }) => theme.colors.accentSoft};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.colors.ink} !important;
      color: ${theme.colors.onInk} !important;
    `}

  @media (min-width: 1200px) and (max-width: 1599.98px) {
    padding: 0.45rem 0.6rem !important;
    font-size: 0.78rem;
  }

  @media (min-width: 1200px) and (max-width: 1319.98px) {
    padding: 0.45rem 0.42rem !important;
    font-size: 0.75rem;
  }
`;

const ExternalMark = styled.span`
  margin-left: 0.2rem;
  font-size: 0.7em;
  opacity: 0.7;
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  padding-bottom: 0.5rem;

  @media (min-width: 1200px) {
    padding-bottom: 0;
  }
`;

export function SiteHeader() {
  const { t } = useTranslation();
  const active = useActiveSection(SECTION_IDS);

  return (
    <Banner data-component-id="SiteHeader" role="banner">
      <StyledNavbar data-component-id="StyledNavbar" expand="xl" collapseOnSelect>
        <Container fluid className="px-2 px-xl-0">
          <Brand data-component-id="Brand" href="#top">
            <Monogram aria-hidden>KD</Monogram>
            <BrandName>{t("nav.brand")}</BrandName>
          </Brand>
          <Navbar.Toggle aria-controls="primary-nav" />
          <Navbar.Collapse id="primary-nav">
            <PillNav data-component-id="PillNav">
              {NAV_LINKS.map((l) => {
                const isActive = !l.external && active === l.href.slice(1);
                return (
                  <PillLink
                    key={l.key}
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    aria-current={isActive ? "location" : undefined}
                    $active={isActive}
                  >
                    {t(`nav.${l.key}`)}
                    {l.external ? <ExternalMark aria-hidden>↗</ExternalMark> : null}
                  </PillLink>
                );
              })}
            </PillNav>
            <NavInner data-component-id="NavInner">
              <LanguageMenu />
              <ThemeToggle />
            </NavInner>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>
    </Banner>
  );
}
