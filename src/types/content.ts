export interface ExperienceRole {
  title: string;
  period: string;
  location: string;
  bullets: string[];
  stack: string;
}

export interface ExperienceCompany {
  id: string;
  name: string;
  logo: string;
  roles: ExperienceRole[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  detail: string;
  logo?: string;
}

export interface ProjectItem {
  title: string;
  period: string;
  description: string;
  linkLabel: string;
  url: string;
  tags?: string[];
}

export interface SkillItem {
  name: string;
  percent: number;
}

export interface VolunteerItem {
  org: string;
  role: string;
  logo: string;
  description?: string;
}

export interface PublicationItem {
  title: string;
  meta: string;
  url: string;
}

export interface AiModelItem {
  label: string;
  image: string;
}
