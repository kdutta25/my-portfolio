import styled from "styled-components";
import type { ExperienceCompany } from "../../types/content";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const CompanyBlock = styled.section`
  padding: 1.5rem 0 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.25rem;
  margin-bottom: 1.35rem;
`;

const LogoWrap = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  min-height: 40px;

  img {
    display: block;
    max-height: 40px;
    width: auto;
    max-width: min(200px, 48vw);
    object-fit: contain;
    filter: ${({ theme }) =>
      theme.mode === "dark" ? "brightness(1.05)" : "none"};
  }
`;

const CompanyTitle = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const RolesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const RoleArticle = styled.article`
  padding-left: 1rem;
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
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
  font-size: 1.02rem;
  font-weight: 650;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.text};
`;

const Period = styled.span`
  font-size: 0.82rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.muted};
  white-space: nowrap;
`;

const Location = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const BulletList = styled.ul`
  margin: 0.65rem 0 0;
  padding-left: 1.15rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.65;
  font-size: 0.93rem;
`;

const Bullet = styled.li`
  margin: 0.35rem 0 0;

  &:first-child {
    margin-top: 0;
  }
`;

const Tech = styled.p`
  margin: 0.65rem 0 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.accent};
  font-family: ${({ theme }) => theme.fonts.mono};
  line-height: 1.5;
`;

export interface ExperienceGroupedProps {
  companies: ExperienceCompany[];
}

export function ExperienceGrouped({ companies }: ExperienceGroupedProps) {
  return (
    <Wrapper data-component-id="ExperienceGrouped">
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
              <img
                src={logoSrc}
                alt={co.name}
                height={40}
                loading="lazy"
                decoding="async"
              />
            </LogoWrap>
            <CompanyTitle data-component-id="CompanyTitle" id={`company-${co.id}-title`}>{co.name}</CompanyTitle>
          </CompanyHeader>

          <RolesList data-component-id="RolesList">
            {co.roles.map((role, idx) => (
              <RoleArticle
                key={`${co.id}-${role.period}-${idx}`}
                data-component-id="RoleArticle"
                aria-labelledby={`role-${co.id}-${idx}`}
              >
                <RoleTop data-component-id="RoleTop">
                  <JobTitle data-component-id="JobTitle" id={`role-${co.id}-${idx}`}>{role.title}</JobTitle>
                  <Period data-component-id="Period">{role.period}</Period>
                </RoleTop>
                <Location data-component-id="Location">{role.location}</Location>
                <BulletList data-component-id="BulletList">
                  {role.bullets.map((b, bi) => (
                    <Bullet data-component-id="Bullet" key={bi}>{b}</Bullet>
                  ))}
                </BulletList>
                <Tech data-component-id="Tech">{role.stack}</Tech>
              </RoleArticle>
            ))}
          </RolesList>
          </CompanyBlock>
        );
      })}
    </Wrapper>
  );
}
