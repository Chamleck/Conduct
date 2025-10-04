/// <reference types="cypress"/>

import BasePage from "./BasePage";

class ProfilePAge extends BasePage {

    getBtn(btnName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`button:contains('${btnName}')`);
    }
}

export default new ProfilePAge();