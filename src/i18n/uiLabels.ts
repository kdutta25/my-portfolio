import { useTranslation } from "react-i18next";

/** Short interface labels for the editorial layout. Page content stays in the /v1 fragments. */
const LABELS = {
  en: {
    greeting: "Hi, I'm",
    developerId: "Developer ID",
    quickFacts: "Quick facts",
    based: "Based in",
    role: "Role",
    credentials: "Credentials",
    skillFamilies: "Filter by family",
    allFamilies: "All",
    familyLanguages: "Languages",
    familyWeb: "Web",
    familyData: "Data",
    familyTesting: "Testing",
    familyDevops: "DevOps",
    familyTools: "Tools",
    familyAi: "AI models",
    tileHint: "Hover or focus a tile to inspect it",
    expandHint: "Hover, focus or tap a card to open it",
  },
  fr: {
    greeting: "Bonjour, je suis",
    developerId: "ID développeur",
    quickFacts: "En bref",
    based: "Basé à",
    role: "Rôle",
    credentials: "Parcours",
    skillFamilies: "Filtrer par famille",
    allFamilies: "Tout",
    familyLanguages: "Langages",
    familyWeb: "Web",
    familyData: "Données",
    familyTesting: "Tests",
    familyDevops: "DevOps",
    familyTools: "Outils",
    familyAi: "Modèles IA",
    tileHint: "Survolez ou sélectionnez une tuile",
    expandHint: "Survolez, sélectionnez ou touchez une carte pour l’ouvrir",
  },
} as const;

export type UiLabelKey = keyof (typeof LABELS)["en"];

export function useUiLabels(): (key: UiLabelKey) => string {
  const { i18n } = useTranslation();
  const table = i18n.language?.startsWith("fr") ? LABELS.fr : LABELS.en;
  return (key) => table[key];
}
