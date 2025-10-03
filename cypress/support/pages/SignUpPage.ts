/// <reference types="cypress"/>

import BasePage from "./BasePage";

class SignUpPage extends BasePage {


    getUsernameField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Username"]');
    }
    getEmailField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Email"]');
    }
    getPasswordField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Password"]');
    }
    getSignUpButton(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('button:contains("Sign up")');
    }

    getErrorMessage(error: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('li').contains(error);
    }

    fillSignUpForm(username: string, email: string, password: string): void {
        cy.log('**Filling sign up form**');
        this.getUsernameField().type(username);
        this.getEmailField().type(email);
        this.getPasswordField().type(password);
        cy.log('**Submitting sign up form**');
        this.getSignUpButton().click();
    }

}

export default new SignUpPage();