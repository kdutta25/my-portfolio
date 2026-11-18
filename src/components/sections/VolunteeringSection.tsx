import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import type { VolunteerItem } from "../../types/content";
import { VolunteerLogo } from "../volunteering/VolunteerLogo";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: clamp(4rem, 9vw, 6.5rem) 1.25rem 0;
  max-width: 1240px;
  margin: 0 auto;
`;

const Stack = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 1rem;
`;

const Item = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(28, 30, 38, 0.7)" : "rgba(255, 253, 248, 0.7)"};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }
`;

const Num = styled.span`
  position: absolute;
  top: 1.1rem;
  right: 1.3rem;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 2.2rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.accent};
  opacity: 0.85;
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border};

  img,
  svg {
    display: block;
    max-height: 100%;
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }
`;

const TextCol = styled.div`
  min-width: 0;
`;

const Org = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.3;
`;

const Role = styled.p`
  margin: 0.35rem 0 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.ink};
`;

const Desc = styled.p`
  margin: 0.55rem 0 0;
  color: ${({ theme }) => theme.colors.text};
`;

function VolunteeringSectionBody() {
  const { t } = useTranslation();
  const items = t("volunteering.items", {
    returnObjects: true,
  }) as VolunteerItem[];

  return (
    <>
      <div data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="volunteering-heading"
          eyebrow={t("nav.volunteering")}
          title={t("volunteering.heading")}
        />
      </div>
      <Stack data-component-id="Stack">
        {items.map((item, idx) => (
          <Item data-component-id="Item" key={item.org} data-animate>
            <Num aria-hidden>{String(idx + 1).padStart(2, "0")}</Num>
            <LogoWrap data-component-id="LogoWrap">
              <VolunteerLogo logo={item.logo} />
            </LogoWrap>
            <TextCol data-component-id="TextCol">
              <Org data-component-id="Org">{item.org}</Org>
              <Role data-component-id="Role">{item.role}</Role>
              {item.description ? <Desc data-component-id="Desc">{item.description}</Desc> : null}
            </TextCol>
          </Item>
        ))}
      </Stack>
    </>
  );
}

export function VolunteeringSection() {
  const { rootRef, ready } = useContentFragment("volunteering", { loadOn: "intersect" });

  return (
    <Section
      ref={rootRef}
      data-component-id="VolunteeringSection"
      id="volunteering"
      aria-labelledby="volunteering-heading"
    >
      <AnimeReveal stagger={58}>
        {ready ? <VolunteeringSectionBody /> : <SectionSkeleton />}
      </AnimeReveal>
    </Section>
  );
}
