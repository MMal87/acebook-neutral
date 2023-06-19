describe("user makes a friend request", () => {
    it("and the UI changes to reflect this", () => {
        // sign up
        cy.visit("/users/new");
        cy.get("#firstName").type("Homer");
        cy.get("#lastName").type("Simpson");
        cy.get("#email").type("someone@example.com");
        cy.get("#password").type("password123!");
        cy.get("#submit").click();

        // sign in
        cy.visit("/sessions/new");
        cy.get("#email").type("someone@example.com");
        cy.get("#password").type("password123!");
        cy.get("#submit").click();

        cy.get('a[href*="../profile"]').click()

        // button changes when clicked
        let button = cy.get('button.addFriendButton').first()
        button.click()
        button.should("contain", "Friend Request Sent")
        
        // button still shows the correct text after page refresh
        cy.visit("/posts")
        cy.get('a[href*="../profile"]').click()
        let refreshedButton = cy.get('button.addFriendButton').first()
        refreshedButton.should("contain", "Friend Request Sent")
    })
})