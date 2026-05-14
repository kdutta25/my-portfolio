import "./commands";
import { applySiteContent } from "../../src/siteContent/applySiteContent";
import type { SiteContentPayload } from "../../src/types/siteContent";
import siteContent from "../../src/test/fixtures/site-content.json";

before(async () => {
  await applySiteContent(siteContent as SiteContentPayload);
});
