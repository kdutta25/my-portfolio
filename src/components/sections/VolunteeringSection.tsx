import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { GlowCard } from "../ui/GlowCard";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";
import type { VolunteerItem } from "../../types/content";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";

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

  img {
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
    <Section id="volunteering" aria-labelledby="volunteering-heading">
      <AnimeReveal stagger={58}>
        <GlowCard>
          <IntroBlock data-animate>
            <SectionHeading
              headingId="volunteering-heading"
              eyebrow={t("nav.volunteering")}
              title={t("volunteering.heading")}
            />
          </IntroBlock>
          <Stack>
            {items.map((item) => (
              <Item key={item.org} data-animate>
                <ItemInner>
                  <LogoWrap>
                    <img
                      src={resolvePublicAsset(item.logo)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </LogoWrap>
                  <TextCol>
                    <Org>{item.org}</Org>
                    <Role>{item.role}</Role>
                    {item.description ? <Desc>{item.description}</Desc> : null}
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
