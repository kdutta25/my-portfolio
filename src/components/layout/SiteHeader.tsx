import { useRef } from "react";
import styled, { useTheme } from "styled-components";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import anime from "animejs";
import { useTranslation } from "react-i18next";
import { MOTION } from "../../animations/constants";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

const RESUME_HREF = `${import.meta.env.BASE_URL}Kaustubh-Dutta-Resume.pdf`;

const NAV_LINKS: readonly {
  key: string;
  href: string;
  external?: true;
}[] = [
  { key: "about", href: "#about" },
  { key: "experience", href: "#experience" },
  { key: "skills", href: "#skills" },
  { key: "projects", href: "#projects" },
  { key: "education", href: "#education" },
  { key: "volunteering", href: "#volunteering" },
  { key: "publications", href: "#publications" },
  { key: "github", href: "#github" },
  { key: "support", href: "#support" },
  { key: "resume", href: RESUME_HREF, external: true },
];

const StyledNavbar = styled(Navbar)`
  padding-block: 0.85rem;
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) =>
    theme.mode === "dark"
      ? "rgba(9, 9, 11, 0.72)"
      : "rgba(255, 255, 255, 0.72)"} !important;
`;

const Brand = styled(Navbar.Brand)`
  font-family: ${({ theme }) => theme.fonts.display} !important;
  font-weight: 800 !important;
  letter-spacing: -0.03em;
  font-size: 1.05rem !important;
  color: ${({ theme }) => theme.colors.text} !important;
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LinkWrap = styled.span`
  position: relative;
  display: inline-block;
`;

const Underline = styled.span`
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 2px;
  width: 100%;
  transform-origin: 0 50%;
  transform: scaleX(0);
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 2px;
  pointer-events: none;
`;

function AnimatedNavLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const theme = useTheme();
  const underlineRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  const enter = () => {
    if (reduced || !underlineRef.current) return;
    anime.remove(underlineRef.current);
    anime({
      targets: underlineRef.current,
      scaleX: [0, 1],
      duration: MOTION.duration.fast,
      easing: MOTION.easing.smooth,
    });
  };

  const leave = () => {
    if (reduced || !underlineRef.current) return;
    anime.remove(underlineRef.current);
    anime({
      targets: underlineRef.current,
      scaleX: [1, 0],
      duration: MOTION.duration.fast,
      easing: MOTION.easing.smooth,
    });
  };

  return (
    <Nav.Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="px-lg-2 py-2"
      style={{
        color: theme.colors.muted,
        fontSize: "0.875rem",
        fontWeight: 500,
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
    >
      <LinkWrap>
        {children}
        <Underline ref={underlineRef} aria-hidden />
      </LinkWrap>
    </Nav.Link>
  );
}

const Banner = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
`;

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <Banner role="banner">
      <StyledNavbar expand="lg" collapseOnSelect>
        <Container fluid className="px-3 px-lg-4">
          <Brand href="#top">{t("nav.brand")}</Brand>
          <Navbar.Toggle aria-controls="primary-nav" />
          <Navbar.Collapse id="primary-nav">
            <Nav className="mx-auto my-2 my-lg-0 gap-lg-1">
              {NAV_LINKS.map((l) => (
                <AnimatedNavLink
                  key={l.key}
                  href={l.href}
                  external={Boolean(l.external)}
                >
                  {t(`nav.${l.key}`)}
                </AnimatedNavLink>
              ))}
            </Nav>
            <NavInner>
              <LanguageToggle />
              <ThemeToggle />
            </NavInner>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>
    </Banner>
  );
}
