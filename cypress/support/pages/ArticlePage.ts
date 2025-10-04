/// <reference types="cypress"/>

import BasePage from "./BasePage";

class ArticlePage extends BasePage {

    getArticleTitle(title: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`h1:contains('${title}')`);
    }

    getArticleBody(body: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`p:contains('${body}')`);
    }

    getAuthorName(authorName: string, index: number): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`a:contains('${authorName}')`).eq(index);
    }

    getCommentInput(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('textarea[placeholder="Write a comment..."]');
    }

    getPostCommentBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('button:contains("Post Comment")');
    }

    getCommentByText(commentText: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('p').contains(commentText);
    }

    getDeleteCommentBtn(commentText: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`div.card:contains('${commentText}')`).find('.ion-trash-a');
    }

    getDeleteArticleBtn(index: number): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('button:contains("Delete Article")').eq(index);
    }

    addComment(commentText: string): void {
        cy.log('**Adding a comment**');
        this.getCommentInput().type(commentText);
        this.getPostCommentBtn().click();
    }

    deleteComment(commentText: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Deleting a comment**');
        return this.getDeleteCommentBtn(commentText).click();
    }

    deleteArticle(index: number): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Deleting the article**');
        return this.getDeleteArticleBtn(index).click().then(() => {
            // Intercept confirm dialog
            cy.on('window:confirm', (str) => {
                expect(str).to.eq('Are you sure you want to delete the article?');
                return true;  // OK
            });
        });
    }

}

export default new ArticlePage();