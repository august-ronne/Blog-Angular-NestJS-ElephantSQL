describe("Users Page", () => {
    it("should load the paginated Users table", () => {
        cy.get('[routerLink="users"]').click();
        cy.get(".mat-table");
    });

    it("should display the correct table headings", () => {
        cy.contains("Id");
        cy.contains("Name");
        cy.contains("Username");
        cy.contains("Email");
        cy.contains("Role");
    });

    it("should allow users to navigate to the next page of the table", () => {
        cy.get('[ng-reflect-message="Next page"]').click();
    });

    it("should allow users to filter the Users table by username", () => {
        cy.get('[ng-reflect-placeholder="Search by username"]').type("monke");
        cy.get(".mat-table").find("mat-row").should("have.length", 1);
    });
});
