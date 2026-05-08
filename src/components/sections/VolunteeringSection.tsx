import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { GlowCard } from "../ui/GlowCard";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import type { VolunteerItem } from "../../types/content";
import { VolunteerLogo } from "../volunteering/VolunteerLogo";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: 3rem 1.25rem 0;
  max-width: 1120px;
  margin: 0 auto;
`;

const Stack = styled.ul`
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1.25rem;
`;

const Item = styled.li``;

const ItemInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.35rem;
`;

const LogoWrap = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.35rem 0.5rem;
  max-width: min(280px, 88vw);

  img,
  svg {
    display: block;
    max-height: 44px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }
`;

const TextCol = styled.div`
  flex: 1 1 200px;
  min-width: 0;
`;

const IntroBlock = styled.div``;

const Org = styled.h3`
  margin: 0;
  font-size: 1.05rem;
`;

const Role = styled.p`
  margin: 0.35rem 0 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.95rem;
`;

const Desc = styled.p`
  margin: 0.55rem 0 0;
  color: ${({ theme }) => theme.colors.text};
`;

export function VolunteeringSection() {
  const { t } = useTranslation();
  const items = t("volunteering.items", {
    returnObjects: true,
  }) as VolunteerItem[];

  return (
    <Section data-component-id="VolunteeringSection" id="volunteering" aria-labelledby="volunteering-heading">
      <AnimeReveal stagger={58}>
        <GlowCard data-component-id="GlowCard">
          <IntroBlock data-component-id="IntroBlock" data-animate>
            <SectionHeading
              headingId="volunteering-heading"
              eyebrow={t("nav.volunteering")}
              title={t("volunteering.heading")}
            />
          </IntroBlock>
          <Stack data-component-id="Stack">
            {items.map((item) => (
              <Item data-component-id="Item" key={item.org} data-animate>
                <ItemInner data-component-id="ItemInner">
                  <LogoWrap data-component-id="LogoWrap">
                    <VolunteerLogo logo={item.logo} />
                  </LogoWrap>
                  <TextCol data-component-id="TextCol">
                    <Org data-component-id="Org">{item.org}</Org>
                    <Role data-component-id="Role">{item.role}</Role>
                    {item.description ? <Desc data-component-id="Desc">{item.description}</Desc> : null}
                  </TextCol>
                </ItemInner>
              </Item>
            ))}
          </Stack>
        </GlowCard>
      </AnimeReveal>
    </Section>
  );
}
