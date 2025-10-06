/// <reference types="cypress"/>

import BasePage from "./BasePage";

class LoginPage extends BasePage {
    /**
     * Get the input field for email.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getEmailField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[data-testid="input-email"]');
    }

    /**
     * Get the input field for password.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getPasswordField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[data-testid="input-password"]');
    }

    /**
     * Get the submit button for signing in.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getSignInSubmitBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[data-testid="btn-submit"]');
    }

    /**
     * Get an error message element by its text.
     * @param {string} error - The error message text to match.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getErrorMessage(error: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('li').contains(error);
    }

    /**
     * Fill the login form with email and password, then submit.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    submitLoginForm(email: string, password: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Filling login form...**');
        this.getEmailField().type(email);
        this.getPasswordField().type(password);
        cy.log('**Submitting login form...**');
        return this.getSignInSubmitBtn().click();
    }
}

export default new LoginPage();
