import styled from "styled-components";
import type { ExperienceCompany } from "../../types/content";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";
import {
  TimelineCard,
  TimelineEntry,
  YearTimeline,
  startYear,
} from "../ui/YearTimeline";

const CompanyBlock = styled.section`
  display: grid;
  gap: 1rem;
  padding-bottom: 1.25rem;
`;

const CompanyHeader = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;

  &::before {
    content: "";
    position: absolute;
    left: calc(-1 * clamp(1.5rem, 3vw, 2.25rem) - 8px);
    top: 50%;
    width: 15px;
    height: 15px;
    translate: 0 -50%;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.ink};
    box-shadow: 0 0 0 5px ${({ theme }) => theme.colors.bg};
  }
`;

const LogoWrap = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0.35rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border};

  img {
    display: block;
    max-height: 28px;
    width: auto;
    max-width: min(160px, 40vw);
    object-fit: contain;
  }
`;

const CompanyTitle = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.5rem, 3vw, 1.9rem);
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.ink};
`;

const RoleTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1rem;
  align-items: baseline;
  justify-content: space-between;
`;

const JobTitle = styled.h4`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const Period = styled.span`
  padding: 0.2rem 0.65rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.accentSoft};
  font-size: 0.74rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`;

const Location = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.86rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const BulletList = styled.ul`
  margin: 0.75rem 0 0;
  padding-left: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.65;
  font-size: 0.93rem;

  li::marker {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Bullet = styled.li`
  margin: 0.35rem 0 0;

  &:first-child {
    margin-top: 0;
  }
`;

const Tech = styled.p`
  margin: 0.85rem 0 0;
  padding-top: 0.75rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  font-size: 0.76rem;
  color: ${({ theme }) => theme.colors.muted};
  font-family: ${({ theme }) => theme.fonts.mono};
  line-height: 1.55;
`;

export interface ExperienceGroupedProps {
  companies: ExperienceCompany[];
}

export function ExperienceGrouped({ companies }: ExperienceGroupedProps) {
  return (
    <YearTimeline>
      {companies.map((co) => {
        const logoSrc = resolvePublicAsset(co.logo);
        return (
          <CompanyBlock
            key={co.id}
            data-component-id="CompanyBlock"
            aria-labelledby={`company-${co.id}-title`}
          >
            <CompanyHeader data-component-id="CompanyHeader">
              <LogoWrap data-component-id="LogoWrap">
                <img src={logoSrc} alt={co.name} height={28} loading="lazy" decoding="async" />
              </LogoWrap>
              <CompanyTitle data-component-id="CompanyTitle" id={`company-${co.id}-title`}>
                {co.name}
              </CompanyTitle>
            </CompanyHeader>

            {co.roles.map((role, idx) => (
              <TimelineEntry key={`${co.id}-${role.period}-${idx}`} year={startYear(role.period)}>
                <TimelineCard
                  as="article"
                  data-component-id="RoleArticle"
                  aria-labelledby={`role-${co.id}-${idx}`}
                >
                  <RoleTop data-component-id="RoleTop">
                    <JobTitle data-component-id="JobTitle" id={`role-${co.id}-${idx}`}>
                      {role.title}
                    </JobTitle>
                    <Period data-component-id="Period">{role.period}</Period>
                  </RoleTop>
                  <Location data-component-id="Location">{role.location}</Location>
                  <BulletList data-component-id="BulletList">
                    {role.bullets.map((b, bi) => (
                      <Bullet data-component-id="Bullet" key={bi}>
                        {b}
                      </Bullet>
                    ))}
                  </BulletList>
                  <Tech data-component-id="Tech">{role.stack}</Tech>
                </TimelineCard>
              </TimelineEntry>
            ))}
          </CompanyBlock>
        );
      })}
    </YearTimeline>
  );
}
