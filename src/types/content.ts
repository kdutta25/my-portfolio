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
  /** Optional second asset (e.g. slides) for the same project card */
  secondaryLinkLabel?: string;
  secondaryUrl?: string;
  /** Optional hero image under `public/` (shown when no slide embed) */
  coverImage?: string;
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

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  publishedAt: string;
  isShort: boolean;
}

/** Shape of `/v1/youtube/channel.json`, written at build time by `scripts/generate-youtube-stats.mjs`. */
export interface YouTubeChannelStats {
  fetchedAt: string;
  channel: {
    title: string;
    url: string;
    avatar: string;
    /** Base banner URL without size/crop parameters; empty when the channel has no banner. */
    banner?: string;
    subscribers: number;
    views: number;
    videoCount: number;
    /** Lifetime watch time from the YouTube Analytics API; absent when the OAuth secrets are not set. */
    watchMinutes?: number;
  };
  topVideos: YouTubeVideo[];
  topShorts: YouTubeVideo[];
}
