/// <reference types="cypress"/>

import BasePage from "./BasePage";

class LoginPage extends BasePage {

    getEmailField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[data-testid="input-email"]');
    }

    getPasswordField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[data-testid="input-password"]');
    }
    
    getSignInButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[data-testid="btn-submit"]');
    }

    submitLoginForm(email: string, password: string): void {
        cy.log('**Filling login form**');
        this.getEmailField().type(email);
        this.getPasswordField().type(password);
        cy.log('**Submitting login form**');
        this.getSignInButton().click();
    }

}

export default new LoginPage();