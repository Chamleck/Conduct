/// <reference types="cypress"/>

export default class BasePage {

    /**
     * Get header element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.navbar-light');
    }

    /**
     * Get footer element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getFooter(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('footer > div.container');
    }

    /**
     * Get top banner element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getBanner(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.banner');
    }

    /**
     * Get user profile icon in header.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getUserIcon(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('.user-pic');
    }

    /**
     * Get "New Article" button element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getNewArticleBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('a:contains("New Article")');
    }

    /**
     * Get username element in the header.
     * @param {string} username - Username text to find in the header.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getUserNameInHeader(username: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`a:contains('${username}')`);
    }

    /**
     * Get settings button element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getSettigsBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('a[href="/settings"]');
    }

    /**
     * Get "Sign In" button in the header.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getSignInHeaderBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('a[href="/login"]');
    }

    /**
     * Check that the footer contains expected link text.
     * @param {string} text - The text to verify in the footer links.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    checkFooterLinkText(text: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Verifying that footer contains expected link text...**');
        return this.getFooter()
            .find('a')
            .contains(text)
            .should('be.visible');
    }
}
