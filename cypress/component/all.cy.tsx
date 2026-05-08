import { mount } from "cypress/react";
import { mountUi } from "../support/mountUi";
import App from "../../src/App";
import { GlowCard } from "../../src/components/ui/GlowCard";
import { SectionHeading } from "../../src/components/ui/SectionHeading";
import { UiverseButton } from "../../src/components/ui/UiverseButton";
import { SkipLink } from "../../src/components/layout/SkipLink";
import { ThemeToggle } from "../../src/components/layout/ThemeToggle";
import { LanguageToggle } from "../../src/components/layout/LanguageToggle";
import { SiteHeader } from "../../src/components/layout/SiteHeader";
import { SiteFooter } from "../../src/components/layout/SiteFooter";
import { SeoHead } from "../../src/components/SeoHead";
import { HeroSection } from "../../src/components/sections/HeroSection";
import { AboutSection } from "../../src/components/sections/AboutSection";
import { ExperienceSection } from "../../src/components/sections/ExperienceSection";
import { EducationSection } from "../../src/components/sections/EducationSection";
import { SkillsSection } from "../../src/components/sections/SkillsSection";
import { ProjectsSection } from "../../src/components/sections/ProjectsSection";
import { VolunteeringSection } from "../../src/components/sections/VolunteeringSection";
import { PublicationsSection } from "../../src/components/sections/PublicationsSection";

describe("components with providers", () => {
  it("GlowCard", () => {
    mountUi(<GlowCard>cypress-card</GlowCard>);
    cy.contains("cypress-card");
  });

  it("SectionHeading", () => {
    mountUi(
      <SectionHeading
        headingId="cy-heading"
        eyebrow="Eyebrow"
        title="Section title"
      />,
    );
    cy.get("#cy-heading").should("contain.text", "Section title");
  });

  it("UiverseButton", () => {
    mountUi(<UiverseButton>click-me</UiverseButton>);
    cy.contains("button", "click-me").click();
  });

  it("SkipLink", () => {
    mountUi(<SkipLink href="#main" label="Skip main" />);
    cy.contains("a", "Skip main");
  });

  it("ThemeToggle", () => {
    mountUi(<ThemeToggle />);
    cy.get('button[aria-label="Toggle color theme"]').click();
  });

  it("LanguageToggle", () => {
    mountUi(<LanguageToggle />);
    cy.get('button[aria-label="Switch language"]').click();
  });

  it("SiteHeader", () => {
    mountUi(<SiteHeader />);
    cy.get('header[role="banner"]').should("exist");
  });

  it("SiteFooter", () => {
    mountUi(<SiteFooter />);
    cy.get("footer").should("exist");
  });

  it("SeoHead", () => {
    mountUi(<SeoHead />);
    cy.window().its("document.title").should("match", /Kaus Dutta/i);
  });

  it("HeroSection", () => {
    mountUi(<HeroSection />);
    cy.get("h1").should("exist");
  });

  it("AboutSection", () => {
    mountUi(<AboutSection />);
    cy.contains("h2", "About Me");
  });

  it("ExperienceSection", () => {
    mountUi(<ExperienceSection />);
    cy.contains("Nokia");
  });

  it("EducationSection", () => {
    mountUi(<EducationSection />);
    cy.contains("University of Ottawa");
  });

  it("SkillsSection", () => {
    mountUi(<SkillsSection />);
    cy.contains(/skillset/i);
  });

  it("ProjectsSection", () => {
    mountUi(<ProjectsSection />);
    cy.contains("Hyperledger");
  });

  it("VolunteeringSection", () => {
    mountUi(<VolunteeringSection />);
    cy.contains("h2", "Volunteering");
  });

  it("PublicationsSection", () => {
    mountUi(<PublicationsSection />);
    cy.contains("Blockchain");
  });

  it("App", () => {
    mount(<App />);
    cy.get("#main-content").should("exist");
  });
});
