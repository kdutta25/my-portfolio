import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlay, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useContentFragment } from "../../hooks/useContentFragment";
import { useUiLabels } from "../../i18n/uiLabels";
import { getContentApiBase } from "../../siteContent/contentApiBase";
import type { YouTubeChannelStats, YouTubeVideo } from "../../types/content";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";
import { SectionSkeleton } from "../loading/SectionSkeleton";
import { AnimeReveal } from "../ui/AnimeReveal";
import { SectionHeading } from "../ui/SectionHeading";

const Section = styled.section`
  scroll-margin-top: 96px;
  padding: clamp(4rem, 9vw, 6.5rem) 1.25rem 0;
  max-width: 1240px;
  margin: 0 auto;
`;

const IntroBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0 2rem;
`;

const IntroAside = styled.div`
  margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
  max-width: 24rem;
`;

const Lead = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-size: 1.3rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
`;

const SubscribeLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.85rem;
  padding: 0.5rem 1.05rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onInk};
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;

  svg {
    color: #ff0033;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.onInk};
    opacity: 0.92;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

/**
 * YouTube's desktop and mobile-safe crops of the channel banner. The comma is percent-encoded
 * because a literal comma would split the URL into separate `srcset` candidates.
 */
const DESKTOP_CROP = "fcrop64=1%2C00005a57ffffa5a8-k-c0xffffffff-no-nd-rj";
const MOBILE_CROP = "fcrop64=1%2C32b75a57cd48a5a8-k-c0xffffffff-no-nd-rj";
const MOBILE_QUERY = "(max-width: 767.98px)";

function bannerSources(banner: string | undefined) {
  if (banner) {
    const at = (w: number, crop: string) => `${banner}=w${w}-${crop}`;
    return {
      desktop: `${at(1060, DESKTOP_CROP)} 1060w, ${at(2120, DESKTOP_CROP)} 2120w, ${at(2560, DESKTOP_CROP)} 2560w`,
      mobile: `${at(640, MOBILE_CROP)} 640w, ${at(1280, MOBILE_CROP)} 1280w`,
      fallback: at(1060, DESKTOP_CROP),
    };
  }
  const local = (file: string) => resolvePublicAsset(`images/youtube/${file}`);
  return {
    desktop: `${local("banner-1060.jpg")} 1060w, ${local("banner-2120.jpg")} 2048w`,
    mobile: `${local("banner-mobile-640.jpg")} 640w, ${local("banner-mobile-1280.jpg")} 1237w`,
    fallback: local("banner-1060.jpg"),
  };
}

const BannerLink = styled.a`
  display: block;
  margin: 0 0 clamp(1.25rem, 3vw, 1.75rem);
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: #000;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1060 / 175;
    object-fit: cover;

    @media ${MOBILE_QUERY} {
      aspect-ratio: 640 / 175;
    }
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;

function ChannelBanner({ banner, href, title }: { banner?: string; href: string; title: string }) {
  const src = bannerSources(banner);
  return (
    <BannerLink
      data-component-id="ChannelBanner"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-animate
    >
      <picture>
        <source media={MOBILE_QUERY} srcSet={src.mobile} sizes="100vw" />
        <img
          src={src.fallback}
          srcSet={src.desktop}
          sizes="(min-width: 1240px) 1200px, 100vw"
          alt={`${title} channel banner`}
          width={1060}
          height={175}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </BannerLink>
  );
}

const StatsBlock = styled.div`
  animation: ytFadeUp 0.6s ease both;

  @keyframes ytFadeUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Stats = styled.dl`
  margin: 0 0 clamp(2rem, 5vw, 3rem);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.5rem, 2vw, 1rem);
`;

const Stat = styled.div`
  padding: clamp(0.85rem, 2.5vw, 1.35rem) clamp(0.85rem, 3vw, 1.5rem);
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(28, 30, 38, 0.7)" : "rgba(255, 253, 248, 0.7)"};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};

  dt {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(0.6rem, 1.6vw, 0.7rem);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.muted};
  }

  dd {
    margin: 0.35rem 0 0;
    font-family: ${({ theme }) => theme.fonts.serif};
    font-size: clamp(1.6rem, 5vw, 3rem);
    line-height: 1;
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const GroupTitle = styled.h3`
  margin: 0 0 1rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const VideoGrid = styled.ul`
  margin: 0 0 clamp(2rem, 5vw, 3rem);
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 1rem;
`;

const ShortsRow = styled.ul`
  margin: 0 0 1rem;
  padding: 0 0 0.5rem;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 767.98px) {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: 62%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;

    > li {
      scroll-snap-align: start;
    }
  }
`;

const Card = styled.a`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.soft};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;

const Thumb = styled.div<{ $ratio: string }>`
  position: relative;
  aspect-ratio: ${({ $ratio }) => $ratio};
  background: #111;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlayBadge = styled.span`
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(255, 0, 51, 0.92);
  color: #fff;
  font-size: 0.8rem;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.9rem 1rem 1.05rem;
`;

const CardTitle = styled.span`
  font-weight: 650;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardViews = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const Updated = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.muted};
`;

function useChannelStats(enabled: boolean): YouTubeChannelStats | null {
  const [stats, setStats] = useState<YouTubeChannelStats | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${getContentApiBase()}/v1/youtube/channel.json`);
        if (!res.ok) return;
        const data = (await res.json()) as YouTubeChannelStats;
        if (!cancelled && data?.channel) setStats(data);
      } catch {
        /* no stats yet: the section keeps its heading and subscribe link */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return stats;
}

function VideoCard({
  video,
  href,
  ratio,
  viewsText,
}: {
  video: YouTubeVideo;
  href: string;
  ratio: string;
  viewsText: string;
}) {
  return (
    <Card data-component-id="VideoCard" href={href} target="_blank" rel="noopener noreferrer">
      <Thumb $ratio={ratio}>
        <img src={video.thumbnail} alt="" loading="lazy" decoding="async" />
        <PlayBadge aria-hidden>
          <FaPlay />
        </PlayBadge>
      </Thumb>
      <CardBody>
        <CardTitle>{video.title}</CardTitle>
        <CardViews>{viewsText}</CardViews>
      </CardBody>
    </Card>
  );
}

function YouTubeSectionBody({ stats }: { stats: YouTubeChannelStats | null }) {
  const { t, i18n } = useTranslation();
  const label = useUiLabels();
  const locale = i18n.language?.startsWith("fr") ? "fr-CA" : "en-CA";
  const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const views = (n: number) => `${compact.format(n)} ${label("ytViewsSuffix")}`;
  const channelUrl = stats?.channel.url || t("youtube.channelUrl");
  const channelTitle = stats?.channel.title || channelUrl.split("@").pop() || "YouTube";

  return (
    <>
      <IntroBlock data-component-id="IntroBlock" data-animate>
        <SectionHeading
          headingId="youtube-heading"
          eyebrow={t("youtube.sectionEyebrow")}
          title={t("youtube.sectionHeading")}
        />
        <IntroAside>
          <Lead data-component-id="Lead">{t("youtube.lead")}</Lead>
          <SubscribeLink
            data-component-id="SubscribeLink"
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={16} aria-hidden />
            {t("youtube.cta")}
          </SubscribeLink>
        </IntroAside>
      </IntroBlock>

      <ChannelBanner banner={stats?.channel.banner} href={channelUrl} title={channelTitle} />

      {stats ? (
        <StatsBlock data-component-id="StatsBlock">
          <Stats data-component-id="ChannelStats">
            <Stat>
              <dt>{label("ytSubscribers")}</dt>
              <dd>{compact.format(stats.channel.subscribers)}</dd>
            </Stat>
            <Stat>
              <dt>{label("ytViews")}</dt>
              <dd>{compact.format(stats.channel.views)}</dd>
            </Stat>
            <Stat>
              <dt>{label("ytVideos")}</dt>
              <dd>{compact.format(stats.channel.videoCount)}</dd>
            </Stat>
          </Stats>

          {stats.topVideos.length > 0 ? (
            <div>
              <GroupTitle>{label("ytTopVideos")}</GroupTitle>
              <VideoGrid data-component-id="TopVideos">
                {stats.topVideos.map((v) => (
                  <li key={v.id}>
                    <VideoCard
                      video={v}
                      href={`https://www.youtube.com/watch?v=${v.id}`}
                      ratio="16 / 9"
                      viewsText={views(v.views)}
                    />
                  </li>
                ))}
              </VideoGrid>
            </div>
          ) : null}

          {stats.topShorts.length > 0 ? (
            <div>
              <GroupTitle>{label("ytTopShorts")}</GroupTitle>
              <ShortsRow data-component-id="TopShorts">
                {stats.topShorts.map((v) => (
                  <li key={v.id}>
                    <VideoCard
                      video={v}
                      href={`https://www.youtube.com/shorts/${v.id}`}
                      ratio="9 / 16"
                      viewsText={views(v.views)}
                    />
                  </li>
                ))}
              </ShortsRow>
            </div>
          ) : null}

          <Updated data-component-id="Updated">
            {label("ytUpdated")}{" "}
            {new Date(stats.fetchedAt).toLocaleDateString(locale, { dateStyle: "medium" })}
          </Updated>
        </StatsBlock>
      ) : null}
    </>
  );
}

export function YouTubeSection() {
  const { rootRef, ready } = useContentFragment("youtube", { loadOn: "intersect" });
  const stats = useChannelStats(ready);

  return (
    <Section
      ref={rootRef}
      data-component-id="YouTubeSection"
      id="youtube"
      aria-labelledby="youtube-heading"
    >
      <AnimeReveal stagger={60}>
        {ready ? <YouTubeSectionBody stats={stats} /> : <SectionSkeleton />}
      </AnimeReveal>
    </Section>
  );
}
