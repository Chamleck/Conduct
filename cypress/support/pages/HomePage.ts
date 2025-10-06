/// <reference types="cypress"/>

import BasePage from "./BasePage";

class Homeage extends BasePage {
    /**
     * Get the author's name element by text.
     * @param {string} authorName - The displayed name of the author.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getAuthorName(authorName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`a:contains('${authorName}')`);
    }

    /**
     * Get the article title by text.
     * @param {string} title - The title text of the article.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getTitle(title: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`h1:contains('${title}')`);
    }

    /**
     * Get the article description by text.
     * @param {string} description - The description text of the article.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getDescription(description: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`p:contains('${description}')`);
    }

    /**
     * Get a tag element by its visible text in the global tag list.
     * @param {string} tagText - The text of the tag.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getTagByText(tagText: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('ul.tag-list').contains(tagText);
    }

    /**
     * Get a tag element by its text within a specific user's article preview.
     * @param {string} tagText - The text of the tag.
     * @param {string} user - The author associated with the article preview.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getUsersTag(tagText: string, user: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`div.article-preview:contains('${user}')`).find(`ul.tag-list:contains('${tagText}')`);
    }

    /**
     * Get the like button for an article by author name.
     * @param {string} authorName - The displayed name of the author.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getLikeBtnByAuthorName(authorName: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`a:contains('${authorName}')`)
            .eq(1)              // Select the second occurrence (usually article meta block)
            .parent()           // Move to the parent element of the author name
            .parent()           // Move to the grandparent element (article meta container)
            .find('button');    // Find the like button within that container
    }
}

export default new Homeage();
