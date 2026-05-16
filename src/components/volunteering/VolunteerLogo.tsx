import ospeSvg from "../../Assets/images/volunteering/ospe.svg?raw";
import { resolvePublicAsset } from "../../utils/resolvePublicAsset";

export interface VolunteerLogoProps {
  logo: string;
}

/**
 * OSPE’s SVG is wide and uses paths that some browsers paint inconsistently when
 * loaded as `<img src>`. Inlining the markup avoids that class of bugs.
 */
export function VolunteerLogo({ logo }: VolunteerLogoProps) {
  if (/ospe\.svg$/i.test(logo)) {
    return (
      <span
        data-component-id="VolunteerLogo"
        aria-hidden
        dangerouslySetInnerHTML={{ __html: ospeSvg }}
      />
    );
  }

  return (
    <img
      data-component-id="VolunteerLogo"
      src={resolvePublicAsset(logo)}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}
