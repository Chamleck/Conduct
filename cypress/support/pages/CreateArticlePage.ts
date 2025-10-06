/// <reference types="cypress"/>

import BasePage from "./BasePage";

class CreateArticlePage extends BasePage {
    /**
     * Get the input field for article title.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getArticleTitleField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Article Title"]');
    }

    /**
     * Get the input field for article description.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getArticleAboutField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="What\'s this article about?"]');
    }

    /**
     * Get the textarea for writing the article body.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getArticleTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Write your article (in markdown)"]');
    }

    /**
     * Get the input field for article tags.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getArticleTagsField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Enter tags"]');
    }

    /**
     * Get the button for publishing the article.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getPublishArticleBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('button:contains("Publish Article")');
    }

    /**
     * Fill out the article form and publish the article.
     * @param {string} title - The title of the article.
     * @param {string} about - A short description of the article.
     * @param {string} text - The main content of the article.
     * @param {string} tag - Tags associated with the article.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    publishArticle(title: string, about: string, text: string, tag: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Filling article form...**');
        this.getArticleTitleField().type(title);
        this.getArticleAboutField().type(about);
        this.getArticleTextField().type(text);
        this.getArticleTagsField().type(tag);
        cy.log('**Submitting article form...**');
        return this.getPublishArticleBtn().click();
    }
}

export default new CreateArticlePage();
