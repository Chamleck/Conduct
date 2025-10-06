/// <reference types="cypress"/>

import BasePage from "./BasePage";

class ProfilePage extends BasePage {
    /**
     * Get a button element by its visible name.
     * @param {string} btnName - The text of the button.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getBtn(btnName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`button:contains('${btnName}')`);
    }

    /**
     * Get the input field for username.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getUsernameField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[name="username"]');
    }

    /**
     * Get the textarea field for user bio.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getBioField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('textarea[name="bio"]');
    }

    /**
     * Get the input field for email.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getEmailField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[name="email"]');
    }

    /**
     * Get the input field for password.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getPasswordField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('input[name="password"]');
    }

    /**
     * Get an error message element by its text.
     * @param {string} error - The error message text.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getErrorMessage(error: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('li').contains(error);
    }

    /**
     * Edit user profile with provided data and submit changes.
     * @param {string} username - New username.
     * @param {string} bio - New bio text.
     * @param {string} email - New email address.
     * @param {string} password - New password.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    editProfile(username: string, bio: string, email: string, password: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Editing profile...**');
        this.getUsernameField().clear().type(username);
        this.getBioField().clear().type(bio);
        this.getEmailField().clear().type(email);
        this.getPasswordField().clear().type(password);
        cy.log('**Submitting profile changes...**');
        return this.getBtn('Update Settings').click();
    }
}

export default new ProfilePage();
