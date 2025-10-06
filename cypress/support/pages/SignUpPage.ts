/// <reference types="cypress"/>

import BasePage from "./BasePage";

class SignUpPage extends BasePage {
    /**
     * Get the input field for username.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getUsernameField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Username"]');
    }

    /**
     * Get the input field for email.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getEmailField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Email"]');
    }

    /**
     * Get the input field for password.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getPasswordField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Password"]');
    }

    /**
     * Get the sign up button element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getSignUpButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('button:contains("Sign up")');
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
     * Fill the sign up form with provided credentials and submit.
     * @param {string} username - Username for registration.
     * @param {string} email - Email for registration.
     * @param {string} password - Password for registration.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    fillSignUpForm(username: string, email: string, password: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Filling sign up form...**');
        this.getUsernameField().type(username);
        this.getEmailField().type(email);
        this.getPasswordField().type(password);
        cy.log('**Submitting sign up form...**');
        return this.getSignUpButton().click();
    }
}

export default new SignUpPage();
