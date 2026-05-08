import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export function SeoHead() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("fr") ? "fr" : "en";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kaustubh Dutta",
    email: "kdutta2511@gmail.com",
    url: "https://www.kaustubhdutta.com",
    jobTitle: "Full Stack AI Application Developer",
    worksFor: { "@type": "Organization", name: "Nokia" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ottawa",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    sameAs: [
      "https://www.linkedin.com/in/kaustubh-dutta/",
      "https://github.com/kdutta25",
    ],
    knowsLanguage: ["English", "French"],
  };

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={t("site.title")}
      meta={[
        { name: "description", content: t("site.description") },
        { name: "keywords", content: t("site.keywords") },
        { property: "og:title", content: t("site.title") },
        { property: "og:description", content: t("site.description") },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://www.kaustubhdutta.com/" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: t("site.title") },
        { name: "twitter:description", content: t("site.description") },
      ]}
      link={[{ rel: "canonical", href: "https://www.kaustubhdutta.com/" }]}
    >
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
