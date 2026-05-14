describe("portfolio site", () => {
  beforeEach(() => {
    cy.fixture("site-content.json").then((sc) => {
      cy.intercept("GET", "**/v1/fragments/*/*", (req) => {
        const m = req.url.match(/\/v1\/fragments\/(en|fr)\/([^/?]+)/);
        if (!m) {
          req.reply(404);
          return;
        }
        const lng = m[1] as "en" | "fr";
        const key = m[2];
        const row = sc.locales[lng] as Record<string, unknown> | undefined;
        const data = row?.[key];
        if (data === undefined) {
          req.reply(404);
          return;
        }
        req.reply({ body: { fragment: key, data } });
      });
      cy.intercept("GET", "**/v1/knowledge/resume", {
        body: sc.resumeCorpus,
      });
      cy.intercept("GET", "**/v1/knowledge/linkedin", {
        body: sc.linkedinSnapshot,
      });
    });
  });

  it("loads core sections and navigation", () => {
    cy.visit("/");
    cy.get('header[role="banner"]').should("exist");
    cy.get("#main-content").should("exist");
    cy.get("footer").should("exist");
    cy.contains("Kaustubh Dutta").should("exist");
    cy.contains("h2", "About Me").should("exist");
    cy.contains("h2", "Experience").should("exist");
    cy.contains("h2", "Education").should("exist");
    cy.get("#publications").should("exist");
  });

  it("toggles language control", () => {
    cy.visit("/");
    cy.get('button[aria-label="Switch language"]').click();
    cy.get('a[href="#about"]').should("contain.text", "À propos");
  });
});
