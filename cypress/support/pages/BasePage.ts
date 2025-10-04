/// <reference types="cypress"/>

export default class BasePage {

    // get header
    getHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.navbar-light');
    }

    // get footer
    getFooter(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('footer > div.container');
    }

    getBanner(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.banner');
    }

    getUserIcon(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.user-pic');
    }

    getNewArticleBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('a:contains("New Article")');
    }

    /**
     * Checking that header contains expected link text
     * @param username text to be checked in the header
     */

    getUserNameInHeader(username: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`a:contains('${username}')`);
    }

    getSettigsBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('a[href="/settings"]');
    }

    getSignInHeaderBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('a[href="/login"]');
    }

    /**
     * Checking that header contains expected link text
     * @param text text to be checked in the header
     */
    checkFooterLinkText(text: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Checking that footer contains expected link text**');
        return this.getFooter()
            .find('a')
            .contains(text)
            .should('be.visible');
    }
}