import { useEffect, useMemo, useRef, useState } from "react";
import {
  areAllFragmentsLoaded,
  ensureFragmentsLoaded,
} from "../siteContent/ensureFragments";
import { isTestEnv } from "../utils/isTestEnv";

type LoadOn = "intersect" | "mount";

/** IO only accepts px or % — use px so margin is predictable (avoids % vs vw quirks). */
const DEFAULT_ROOT_MARGIN_PX = "0px 0px 4800px 0px";

function shouldPrefetchElement(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const pad = Math.max(vh * 2, vw * 1.5, 1600);
  return rect.top < vh + pad && rect.bottom > -pad;
}

export function useContentFragment(
  fragmentIds: string | readonly string[],
  opts: { loadOn: LoadOn; rootMargin?: string },
) {
  const fragmentDep =
    typeof fragmentIds === "string"
      ? fragmentIds
      : [...new Set([...fragmentIds])].sort().join("\0");

  const uniqueKeys = useMemo(() => {
    if (!fragmentDep.includes("\0")) return [fragmentDep];
    return fragmentDep.split("\0");
  }, [fragmentDep]);

  const keysSig = uniqueKeys.join("\0");

  const rootRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(() => {
    if (isTestEnv()) return true;
    return areAllFragmentsLoaded(uniqueKeys);
  });

  useEffect(() => {
    if (isTestEnv()) {
      setReady(true);
      return;
    }

    if (areAllFragmentsLoaded(uniqueKeys)) {
      setReady(true);
      return;
    }

    let cancelled = false;
    let settled = false;

    const load = () => {
      void ensureFragmentsLoaded(uniqueKeys)
        .then(() => {
          if (!cancelled) {
            setReady(true);
          }
        })
        .catch((err: unknown) => {
          console.error("[useContentFragment] failed to load", uniqueKeys, err);
        });
    };

    if (opts.loadOn === "mount") {
      load();
      return () => {
        cancelled = true;
      };
    }

    const el = rootRef.current;
    if (!el) {
      load();
      return () => {
        cancelled = true;
      };
    }

    let io: IntersectionObserver | null = null;

    const beginLoad = () => {
      if (cancelled || settled) return;
      settled = true;
      io?.disconnect();
      io = null;
      load();
    };

    const tryGeometry = () => {
      if (cancelled || settled) return;
      if (shouldPrefetchElement(el)) beginLoad();
    };

    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) beginLoad();
      },
      {
        root: null,
        rootMargin: opts.rootMargin ?? DEFAULT_ROOT_MARGIN_PX,
        threshold: 0,
      },
    );
    io.observe(el);

    requestAnimationFrame(tryGeometry);

    const onScrollOrResize = () => {
      tryGeometry();
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelled = true;
      io?.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [keysSig, opts.loadOn, opts.rootMargin]);

  return { rootRef, ready };
}
