describe("portfolio site", () => {
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
