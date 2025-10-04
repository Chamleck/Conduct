/// <reference types="cypress"/>

import BasePage from "./BasePage";

class Homeage extends BasePage {
    getAuthorName(authorName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`a:contains('${authorName}')`);
    }

    getTitle(title: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`h1:contains('${title}')`);
    }

    getDescription(description: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`p:contains('${description}')`);
    }

    getTagByText(tagText: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('ul.tag-list').contains(tagText);
    }

    getUsersTag(tagText: string, user: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`div.article-preview:contains('${user}')`).find(`ul.tag-list:contains('${tagText}')`);
    }

    getLikeBtnByAuthorName(authorName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`a:contains('${authorName}')`).eq(1) // Get the first occurrence of the author name
            .parent() // Move to the parent element of the author name
            .parent() // Move to the grandparent element (article meta)
            .find('button'); // Find the like button within that grandparent
    }
}

export default new Homeage();