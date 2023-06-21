describe("Timeline - Like Functionality - Interacting with other user", () => {
    it("can like another user's post", () => {
    // sign in
    cy.visit("/sessions/new");
    cy.get("#email").type("chris@chris.com");
    cy.get("#password").type("password1");
    cy.get("#submit").click();

    // submit a post
    cy.visit("/posts");
    cy.get("a[href='/posts/new']").click()
    cy.get("#new-post-form").find('[type="text"]').type("Testing Like Functionality - Other User");
    cy.get("#new-post-form").submit();

    cy.get("input[type='submit']").click();
    cy.get("#email").type("sue@sue.com");
    cy.get("#password").type("password1");
    cy.get("#submit").click();

    cy.get(".likeButtonTimeline").eq(0).click();
    cy.get('[id*="likesCount"]').eq(0).should("contain", '1');
    cy.get('[id*="likesCount"]').eq(0).should("not.have.value", '2');
    });
});