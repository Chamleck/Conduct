/// <reference types="cypress"/>

import BasePage from "./BasePage";

class LoginPage extends BasePage {

    getEmailField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[data-testid="input-email"]');
    }

    getPasswordField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[data-testid="input-password"]');
    }

    getSignInSubmitBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[data-testid="btn-submit"]');
    }

    getErrorMessage(error: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('li').contains(error);
    }

    submitLoginForm(email: string, password: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Filling login form**');
        this.getEmailField().type(email);
        this.getPasswordField().type(password);
        cy.log('**Submitting login form**');
        return this.getSignInSubmitBtn().click();
    }

}

export default new LoginPage();