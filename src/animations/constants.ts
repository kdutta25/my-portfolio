/** Defaults for Anime.js — tuned for cinematic but restrained motion */
export const MOTION = {
  duration: {
    fast: 380,
    medium: 620,
    slow: 980,
    entrance: 720,
  },
  easing: {
    smooth: "easeOutCubic",
    cinematic: "easeOutExpo",
    linear: "linear",
  },
  stagger: {
    tight: 42,
    normal: 72,
    loose: 110,
  },
} as const;
