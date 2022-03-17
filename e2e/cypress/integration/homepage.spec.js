describe("Homepage", () => {
    it("should load successfully", () => {
        cy.visit("/");
    });

    it("navigation text should be spelled correctly", () => {
        cy.contains("Users");
        cy.contains("Admin");
        cy.contains("Login");
        cy.get("mat-select").click();
        cy.contains("Register");
    });
});
