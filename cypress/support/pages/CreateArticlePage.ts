/// <reference types="cypress"/>

import BasePage from "./BasePage";

class CreateArticlePage extends BasePage {
    getArticleTitleField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Article Title"]');
    }
    getArticleAboutField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="What\'s this article about?"]');
    }
    getArticleTextField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Write your article (in markdown)"]');
    }
    getArticleTagsField(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('[placeholder="Enter tags"]');
    }
    getPublishArticleBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('button:contains("Publish Article")');
    }


    publishArticle(title: string, about: string, text: string, tag: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Filling article form**');
        this.getArticleTitleField().type(title);
        this.getArticleAboutField().type(about);
        this.getArticleTextField().type(text);
        this.getArticleTagsField().type(tag);
        cy.log('**Submitting article form**');
        return this.getPublishArticleBtn().click();
    }

}
export default new CreateArticlePage(); 