/** Fragment keys under `data/locales/{lng}.json` (must stay aligned with my-portfolio-api). */

export const SHELL_FRAGMENT_IDS = [
  "site",
  "nav",
  "footer",
  "chatbot",
] as const;

/** Loaded after the shell so section bodies always have copy (intersect is still used for UX). */
export const SECTION_FRAGMENT_IDS = [
  "hero",
  "about",
  "experience",
  "skills",
  "aiModels",
  "education",
  "projects",
  "volunteering",
  "publications",
  "githubActivity",
  "support",
] as const;
