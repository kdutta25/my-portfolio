/** Resolve a path under `public/` or pass through absolute http(s) URLs. */
export function resolvePublicAsset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const trimmed = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${trimmed}`;
}
