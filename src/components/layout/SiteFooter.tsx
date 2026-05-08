import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { AiFillGithub, AiOutlineTwitter, AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn, FaYoutube } from "react-icons/fa";

const FooterBar = styled.footer`
  margin-top: 4rem;
  padding: 2.75rem 1.25rem 2.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgElevated};
`;

const Inner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
`;

const ThreeCol = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-align: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: start;
    text-align: left;
  }
`;

const FooterHeading = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1rem, 2.5vw, 1.15rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.text};
`;

const SocialList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const SocialItem = styled.li``;

const SocialAnchor = styled.a`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

const BottomRow = styled.div`
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const Meta = styled.small`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.82rem;
`;

export function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <FooterBar role="contentinfo">
      <Inner>
        <ThreeCol>
          <div>
            <FooterHeading>{t("footer.line1")}</FooterHeading>
          </div>
          <div>
            <FooterHeading>{t("footer.line2", { year })}</FooterHeading>
          </div>
          <div>
            <SocialList>
              <SocialItem>
                <SocialAnchor
                  href={t("footer.github")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <AiFillGithub aria-hidden />
                </SocialAnchor>
              </SocialItem>
              <SocialItem>
                <SocialAnchor
                  href={t("footer.twitter")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                >
                  <AiOutlineTwitter aria-hidden />
                </SocialAnchor>
              </SocialItem>
              <SocialItem>
                <SocialAnchor
                  href={t("footer.linkedin")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn aria-hidden />
                </SocialAnchor>
              </SocialItem>
              <SocialItem>
                <SocialAnchor
                  href={t("footer.instagram")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <AiFillInstagram aria-hidden />
                </SocialAnchor>
              </SocialItem>
              <SocialItem>
                <SocialAnchor
                  href={t("footer.youtube")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("about.youtubeAria")}
                >
                  <FaYoutube aria-hidden />
                </SocialAnchor>
              </SocialItem>
            </SocialList>
          </div>
        </ThreeCol>
        <BottomRow>
          <Meta>{t("footer.built")}</Meta>
        </BottomRow>
      </Inner>
    </FooterBar>
  );
}
