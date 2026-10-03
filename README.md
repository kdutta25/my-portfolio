# my-portfolio

Repository for **Kaustubh Dutta**’s portfolio site: projects, experience, publications, résumé links, and bilingual (English / French) content.

<h2 align="center">
  Portfolio Website<br/>
  <a href="https://kaustubhdutta.com/" target="_blank">Kaustubh Dutta</a>
</h2>

<div align="center">
  <img alt="Portfolio homepage — hero with navigation, profile, headline, stats, and CTAs" src="./Images/readme-hero.png" />
</div>

<br/>

<h3 align="center">
    🔹
    <a href="https://github.com/kdutta25/my-portfolio/issues">Report Bug</a> &nbsp; &nbsp;
    🔹
    <a href="https://github.com/kdutta25/my-portfolio/issues">Request Feature</a>
</h3>

---

## Tech stack

- **Runtime:** React 18, TypeScript, **Vite 5**
- **Styling:** styled-components 6, Bootstrap 5 + react-bootstrap (layout grid / utilities)
- **Motion:** anime.js (entrance animation, micro-interactions)
- **i18n:** i18next + react-i18next — copy is merged at runtime from **`GET /v1/fragments/{lng}/{key}`** (static JSON baked from **my-portfolio-api** `data/` into `public/v1` for GitHub Pages), bootstrapped before the first paint (see **Content API and environment** below). Configure the content origin with **`VITE_CONTENT_API_BASE_URL`** (or legacy **`VITE_SITE_CONTENT_URL`**).
- **SEO:** react-helmet-async (`SeoHead`)
- **Extras:** react-icons, react-github-calendar, floating **Portfolio** chat panel with lightweight FAQ matching (`src/chat/matchKnowledge.ts` + résumé / LinkedIn text from the content API)

---

## Application views (single-page sections)

The UI is one **long-scroll landing page** (`src/App.tsx`). There is no client-side router; **“views”** are scroll targets (`id` anchors) wired from the sticky header and the chatbot.

| Anchor | Section component | Role |
|--------|-------------------|------|
| `#top` | `HeroSection` | Above-the-fold identity: photo, headline, tagline, primary CTAs (scroll / external links). |
| `#about` | `AboutSection` | Bio / positioning narrative (`aria-labelledby="about-heading"`). |
| `#experience` | `ExperienceSection` | Timeline-style work history (`ExperienceGrouped` + locale-driven copy). |
| `#skills` | `SkillsSection` | **Professional skillset** grid (languages, frameworks, tools including image-based entries). Nested **Models & assistants** region lists AI tooling cards (Composer, GPT Codex, Claude Opus) with artwork under `public/images/ai-models/`. |
| `#projects` | `ProjectsSection` | Featured projects as **`ProjectCard`** tiles (see below). |
| `#education` | `EducationSection` | Degrees and institutions. |
| `#volunteering` | `VolunteeringSection` | Volunteer roles. |
| `#publications` | `PublicationsSection` | Papers / publications list. |
| `#github` | `GitHubSection` | Contribution calendar (`react-github-calendar`) and GitHub presence. |
| `#support` | `BuyMeCoffeeSection` | Support / “Buy Me a Coffee” call-to-action. |

**Global chrome (not section anchors):**

- **`SiteHeader`** — Sticky nav; in-page hash links + theme / language toggles; **README** opens this repo on GitHub and **résumé** opens the PDF — both in a new tab, like external docs.
- **`SiteFooter`** — Attribution, copyright, social links, “Built with React, TypeScript and Vite”.
- **`SkipLink`** — Skip to `#main-content`.
- **`LoadingScreen`** — Full-screen loader until ready (skipped in test env via `isTestEnv()`).
- **`PortfolioChatbot`** — Fixed panel: section chips, regex/heuristic replies, optional scroll-to-hash; resume corpus matching for FAQ-style answers.

### Project cards (`ProjectCard`)

Project copy and metadata come from **`projects.items`** in the English and French locale objects served by the content API (`ProjectItem` in `src/types/content.ts`).

| Feature | Details |
|---------|---------|
| **Cover image** | Optional **`coverImage`** path under `public/` (16×10 header). Placeholder SVGs live in **`public/images/projects/`** — e.g. `hyperledger-blockchain.svg`, `ct-reconstruction.svg`, `wireless-spybot.svg`, `dawn-dusk-lamp.svg`. If omitted, the card uses a hue-based gradient. |
| **Links** | Optional **`linkLabel` / `url`** and **`secondaryLinkLabel` / `secondaryUrl`** (PDF, PPTX, etc.). Hrefs are built with **`resolvePublicAsset`** so deployments respect Vite **`BASE_URL`**. |
| **Hyperledger** | Literature review PDF (`Kaustubh-Dutta-Literature-Review.pdf`), blockchain presentation PPTX (`Kaustubh-Dutta-Hyperledger-Blockchain-Presentation.pptx`), and the Hyperledger cover SVG — served as static files from **`public/`**. |

Other shared assets include **`public/Kaustubh-Dutta-Resume.pdf`** (header résumé link), skill/company logos, and **`public/images/ai-models/`** artwork for the skills section. Locale JSON and résumé / LinkedIn corpora for the assistant live in **my-portfolio-api** (`data/`), not in this repository.

---

## UI architecture

- **Composition root:** `App` wraps **HelmetProvider** → **I18nextProvider** → **AppThemeProvider** → `GlobalStyle` + page shell.
- **Theme:** `AppThemeProvider` toggles **light/dark** `AppTheme` tokens (`src/theme/theme.ts`) — colors, typography stacks (`Syne` / `DM Sans` / `JetBrains Mono`), radii, shadows — persisted in `localStorage` and synced to `document.documentElement` / Bootstrap `data-bs-theme`.
- **Section pattern:** Most sections use a styled `<section>` with `scroll-margin-top` for sticky header offset, **`SectionHeading`** (eyebrow + title + bar), optional **`GlowCard`** wrapper, **`AnimeReveal`** for staggered entrance, and **react-bootstrap** `Container` / `Row` / `Col` for responsive grids. **`ProjectsSection`** maps locale **`projects.items`** to **`ProjectCard`** (cover image or gradient, tags, external asset links).
- **Content:** `main.tsx` awaits shell and section **fragment** loads from **`/v1`** (see **Content API and environment**); résumé / LinkedIn knowledge for the chatbot is fetched in parallel and does not block the page. Static assets stay under `public/` (images, PDF). The production site does **not** run Express.
- **Accessibility:** Landmark regions, labelled headings, skip link, reduced-motion respected where wired (e.g. hero / nav animations).

```mermaid
flowchart TB
  subgraph providers["Provider stack"]
    HP[HelmetProvider]
    IP[I18nextProvider]
    ATP[AppThemeProvider]
    GS[GlobalStyle]
    HP --> IP --> ATP --> GS
  end

  subgraph shell["Page shell"]
    SEO[SeoHead]
    LS[LoadingScreen]
    SK[SkipLink]
    HDR[SiteHeader]
    MN[Main id=main-content]
    FTR[SiteFooter]
    CHAT[PortfolioChatbot]
  end

  providers --> shell

  subgraph sections["Main sections order"]
    H[HeroSection]
    A[AboutSection]
    E[ExperienceSection]
    S[SkillsSection]
    P[ProjectsSection]
    ED[EducationSection]
    V[VolunteeringSection]
    PU[PublicationsSection]
    G[GitHubSection]
    B[BuyMeCoffeeSection]
  end

  MN --> H --> A --> E --> S --> P --> ED --> V --> PU --> G --> B
```

```mermaid
flowchart LR
  subgraph nav["SiteHeader nav hashes"]
    N1["#about"]
    N2["#experience"]
    N3["#skills"]
    N4["#projects"]
    N5["#education"]
    N6["#volunteering"]
    N7["#publications"]
    N8["#github"]
    N9["#support"]
  end

  subgraph page["Scroll targets"]
    S1[AboutSection]
    S2[ExperienceSection]
    S3[SkillsSection]
    S4[ProjectsSection]
    S5[EducationSection]
    S6[VolunteeringSection]
    S7[PublicationsSection]
    S8[GitHubSection]
    S9[BuyMeCoffeeSection]
  end

  N1 --> S1
  N2 --> S2
  N3 --> S3
  N4 --> S4
  N5 --> S5
  N6 --> S6
  N7 --> S7
  N8 --> S8
  N9 --> S9
```

```mermaid
flowchart TB
  subgraph presentation["Presentation layer"]
    SEC[Section components]
    PC[ProjectCard]
    LAY[Layout: Header / Footer / SkipLink]
    UI[GlowCard / SectionHeading / AnimeReveal / UiverseButton]
  end

  subgraph styling["Styling"]
    SC[styled-components themes]
    BS[Bootstrap + react-bootstrap grid]
  end

  subgraph content["Content & behavior"]
    L10n[i18n en / fr merged from fragments]
    CHAT[PortfolioChatbot + matchKnowledge]
    API[static /v1 JSON on GitHub Pages]
    MOTION[anime.js + MOTION constants]
  end

  presentation --> styling
  presentation --> content
  CHAT --> API
  SEC --> L10n
  PC --> L10n
  L10n --> API
```

---

## Test report

### Vitest (unit / component)

**Command:** `npm test` or `npm run test:run`

**Last structured run:** 21 test files, **29 tests**, all passing (Vitest 2, jsdom, `src/setupTests.ts`).

| Area | File | What it covers |
|------|------|----------------|
| App shell | `App.test.tsx` | Banner, main, contentinfo landmarks |
| Site content bootstrap | `src/setupTests.ts`, `src/test/fixtures/site-content.json` | Applies `applySiteContent` so i18n and chat corpus match the bundled fixture before component tests |
| SEO | `SeoHead.test.tsx` | Document title from i18n |
| Layout | `SiteHeader.test.tsx`, `SiteFooter.test.tsx`, `SkipLink.test.tsx` | Nav landmark, footer “built with” line, skip control |
| Theme / i18n | `ThemeToggle.test.tsx`, `LanguageToggle.test.tsx` | Mode toggle, language switch label |
| UI primitives | `GlowCard.test.tsx`, `SectionHeading.test.tsx`, `AnimeReveal.test.tsx`, `UiverseButton.test.tsx` | Render / interaction contracts |
| Sections | `HeroSection`, `AboutSection`, `ExperienceSection`, `SkillsSection`, `ProjectsSection`, `EducationSection`, `VolunteeringSection`, `PublicationsSection`, `GitHubSection` | Key visible copy or regions |

Configuration: `vite.config.ts` → `test` block (`include: src/**/*.test.{ts,tsx}`).

### Cypress

| Suite | Location | Scope |
|-------|----------|--------|
| E2E | `cypress/e2e/portfolio.cy.ts` | Stubs `GET …/v1/fragments/*/*` (and knowledge URLs), loads home, checks header/main/footer, headings, `#publications`, language toggle → French nav label |
| Component | `cypress/component/all.cy.tsx` | Mounts App and individual sections/components with shared provider helper (`support/mountUi.tsx`) |

**Commands:** `npm run cypress:open`, `npm run cypress:run`, `npm run cypress:component`

---

## Scripts

| Script | Purpose |
|--------|---------|
| `npm start` / `npm run dev` | Vite dev server (**default port `4044`** — see `vite.config.ts`). `prestart` / `predev` snapshot content into `public/v1` when `../my-portfolio-api/data` exists. |
| `npm run generate:static-content` | Write fragment + knowledge JSON under `public/v1` from **my-portfolio-api** `data/` (`CONTENT_DATA_DIR`). |
| `npm run build` | `prebuild` generates `/v1`, then Vite production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest watch |
| `npm run test:run` | Vitest single run (CI-friendly) |
| `npm run deploy` | `gh-pages` deploy from `dist/` (after `predeploy` build) |

---

## Content API and environment

This app **does not ship** `src/locales/*.json`, résumé text, or LinkedIn snapshot JSON as source files. Those live in **[my-portfolio-api](https://github.com/kdutta25/my-portfolio-api)** under `data/`. For **GitHub Pages**, `scripts/generate-static-content.mjs` snapshots that data into **`public/v1/`** (gitignored) so the SPA can `fetch` the same `/v1/fragments/...` and `/v1/knowledge/...` URLs **without a live Express process**. Local Express (`npm start` in the API repo) is optional for editing/previewing JSON over HTTP.

### What changed (REST-first loading)

| Area | Behavior |
|------|----------|
| **Bootstrap** | `src/main.tsx` initializes an empty i18n shell (`initI18nShell`), then **awaits** two batches of `GET /v1/fragments/{lng}/{key}` (English and French in parallel per key) before `createRoot().render()`. If any required request fails, the user sees an inline error instead of a broken layout. |
| **Shell fragments** | `SHELL_FRAGMENT_IDS` in `src/siteContent/fragmentIds.ts`: `site`, `nav`, `footer`, `chatbot` — enough for SEO, skip link, header/footer, and chat chrome. |
| **Section fragments** | `SECTION_FRAGMENT_IDS`: `hero`, `about`, `experience`, `skills`, `aiModels`, `education`, `projects`, `volunteering`, `publications`, `githubActivity`, `support`. These keys must match top-level objects in the API’s `data/locales/en.json` and `fr.json`. |
| **Merging** | `src/siteContent/ensureFragments.ts` fetches each key for `en` and `fr`, then `mergeTranslationFragment` in `src/i18n/index.ts` deep-merges `{ [key]: data }` into the `translation` namespace. A small in-memory cache avoids duplicate network work. |
| **Sections** | Each section uses `src/hooks/useContentFragment.ts` with `loadOn: "intersect"` (or `"mount"` for the hero). After bootstrap, copy is usually **already cached**, so `areAllFragmentsLoaded` sets `ready` immediately; otherwise the hook still loads on intersection / geometry as a fallback. Until `ready`, sections show `src/components/loading/SectionSkeleton.tsx` inside `GlowCard`. |
| **Chat knowledge** | **`GET /v1/knowledge/resume`** and **`GET /v1/knowledge/linkedin`** run from bootstrap via **`void ensureKnowledgeLoaded()`** — **not** awaited with the experience section — so a knowledge outage does not blank **Experience**. Failures are logged; the assistant may answer with reduced context until a reload. |
| **Tests / CI** | Vitest uses `applySiteContent` + `src/test/fixtures/site-content.json` in `src/setupTests.ts`. Cypress stubs `**/v1/fragments/*/*` and knowledge routes using `cypress/fixtures/site-content.json`. |
| **Legacy bundle** | The API still exposes `GET /v1/site-content` (full payload). This repo no longer depends on it at runtime; fragments are the source of truth for the SPA. |

```mermaid
flowchart TB
  subgraph pages["GitHub Pages dist"]
    FG["GET /v1/fragments/{lng}/{key}"]
    KR["GET /v1/knowledge/resume"]
    KL["GET /v1/knowledge/linkedin"]
  end

  INIT["initI18nShell"] --> SH["ensureFragmentsLoaded SHELL_FRAGMENT_IDS"]
  SH --> SEC["ensureFragmentsLoaded SECTION_FRAGMENT_IDS"]
  SEC --> RND["createRoot render App"]
  SEC -.->|void| KNOW["ensureKnowledgeLoaded"]

  EF["ensureFragments.ts"] --> CB["getContentApiBase"]
  EF --> FG
  EF --> MF["mergeTranslationFragment"]
  KNOW --> KR
  KNOW --> KL

  SH --> EF
  SEC --> EF
  RND --> UCF["useContentFragment in sections"]
  MF --> UCF
  UCF --> SK["SectionSkeleton or real body"]
```

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant Main as main.tsx
  participant I18n as i18n shell
  participant Static as static /v1 JSON
  participant React as React tree

  User->>Main: Open site
  Main->>I18n: initI18nShell empty bundles
  loop Each shell + section fragment key
    Main->>Static: GET /v1/fragments/en/key and /fr/key
    Static-->>Main: JSON data
    Main->>I18n: mergeTranslationFragment
  end
  Main->>Main: void ensureKnowledgeLoaded (not awaited)
  Main->>React: createRoot render when bootstrap resolves
  React-->>User: Sections with copy from i18n cache
  Note over Main,Static: Knowledge GETs may finish after first paint. The chat uses corpora once they arrive.
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CONTENT_API_BASE_URL` | Recommended | Content base: **origin**, or **origin + path prefix** before `/v1`. On GitHub Pages this is the SPA origin (`https://www.kaustubhdutta.com`); Vite **`BASE_URL`** is appended when you use Project Pages (`VITE_BASE_PATH`). |
| `VITE_SITE_CONTENT_URL` | Optional fallback | Any URL on that origin (for example a legacy `…/v1/site-content` URL). If `VITE_CONTENT_API_BASE_URL` is unset, **only the origin** is parsed from this value. |

- **Local dev:** `.env.development` sets `VITE_CONTENT_API_BASE_URL=http://localhost:4044`. Clone **my-portfolio-api** next to this repo (or set **`CONTENT_DATA_DIR`**), then `npm start` — `prestart` generates `public/v1` and Vite serves it. **Shell wins over `.env*`:** if you `export VITE_CONTENT_API_BASE_URL=https://www.kaustubhdutta.com` (or legacy `VITE_SITE_CONTENT_URL` to that site), the app falls back to **`http://localhost:4044`** with a console warning. Override with **`VITE_DEV_DEFAULT_CONTENT_API_BASE`**, or set **`VITE_DEV_ALLOW_BARE_PORTFOLIO_ORIGIN_API=true`** to hit production `/v1`. To use live Express instead, point the env at `http://localhost:3001` and run the API.
- **Production:** The Pages workflow generates `/v1` from the API repo’s `data/` and sets `VITE_CONTENT_API_BASE_URL` to **`https://www.kaustubhdutta.com`** with **`VITE_ALLOW_SAME_ORIGIN_CONTENT_API=true`** (set **`VITE_ALLOW_SAME_ORIGIN_CONTENT_API=false`** to opt out). No reverse proxy or AWS host is required.

Copy `.env.example` if you need a template beyond `.env.development`.

### GitHub Pages (GitHub Actions)

1. **Repository → Settings → Pages → Build and deployment:** set **Source** to **GitHub Actions** (not “Deploy from a branch” unless you only use `npm run deploy` locally).
2. **Repository → Settings → Secrets and variables → Actions:**  
   - **`VITE_CONTENT_API_BASE_URL`** (optional) — defaults to **`https://www.kaustubhdutta.com`**. Leave unset for same-origin static `/v1`. Only set this if content should load from another origin.
3. Push to **`master`** (or run workflow **Deploy Pages** manually). Workflow: **`.github/workflows/deploy-pages.yml`** — checks out **my-portfolio-api** into `_content-api`, runs `npm ci`, generates `public/v1`, builds, then publishes **`dist/`** to Pages. If the API repo is **private**, add a PAT with `contents: read` and pass it as `token` on that checkout step.
4. **Optional — Project Pages** (`https://USER.github.io/REPO/`): add a repository **variable** **`VITE_BASE_PATH`** set to your repo path with slashes, e.g. **`/my-portfolio/`**. `getContentApiBase` appends Vite **`BASE_URL`** so fetches hit `/my-portfolio/v1/...`. Custom domain at site root can omit it (defaults to **`/`**).

## Getting started

1. **Install:** `npm install`
2. **Content data:** Clone **[my-portfolio-api](https://github.com/kdutta25/my-portfolio-api)** as a sibling of this repo (or set **`CONTENT_DATA_DIR`** to its `data/` folder).
3. **Develop:** `npm start` — open **http://localhost:4044** (generates `public/v1` when data is present).
4. **Edit content:** Change locale JSON and corpora in the API repo under `data/` (see that README), then regenerate (`npm run generate:static-content` or restart Vite). Adjust section layout under `src/components/sections/`, `src/components/projects/` (`ProjectCard.tsx`), and `src/components/experience/`.
5. **Static files:** Add PDFs, thumbnails, and other binaries under **`public/`** in this repo and reference them from content-driven copy or components with paths relative to the site root (see **Project cards** above).

Continuous delivery: **`.github/workflows/release.yml`** (semantic-release) and **`.github/workflows/deploy-pages.yml`** (GitHub Pages).

### Show your support

Give a ⭐ if you like this website!

<a href="https://buymeacoffee.com/kaustubhdutta" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" height="60px" width="217px"></a>
