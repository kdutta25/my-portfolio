export declare const SHORT_MAX_SECONDS: number;

export declare function parseIsoDuration(iso: string | undefined): number;

export declare function selectTop<T extends { views: number; isShort: boolean }>(
  items: T[],
  limits?: { videos?: number; shorts?: number },
): { topVideos: T[]; topShorts: T[] };
