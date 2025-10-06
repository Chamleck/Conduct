/// <reference types="cypress"/>

import BasePage from "./BasePage";

class ArticlePage extends BasePage {

    /**
     * Get article title by visible text.
     * @param {string} title - Article title text.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getArticleTitle(title: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`h1:contains('${title}')`);
    }

    /**
     * Get article body paragraph by text.
     * @param {string} body - Text of the article body.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getArticleBody(body: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`p:contains('${body}')`);
    }

    /**
     * Get author name element by text and index.
     * @param {string} authorName - Author's displayed name.
     * @param {number} index - Index of the matching element.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getAuthorName(authorName: string, index: number): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`a:contains('${authorName}')`).eq(index);
    }

    /**
     * Get input field for writing a comment.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getCommentInput(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('textarea[placeholder="Write a comment..."]');
    }

    /**
     * Get button for posting a comment.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getPostCommentBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('button:contains("Post Comment")');
    }

    /**
     * Get a comment element by its text.
     * @param {string} commentText - The text of the comment to find.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getCommentByText(commentText: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('p').contains(commentText);
    }

    /**
     * Get delete button for a specific comment.
     * @param {string} commentText - The text of the comment to delete.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getDeleteCommentBtn(commentText: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(`div.card:contains('${commentText}')`).find('.ion-trash-a');
    }

    /**
     * Get delete button for the article.
     * @param {number} index - Index of the delete button (if multiple).
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    getDeleteArticleBtn(index: number): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get('button:contains("Delete Article")').eq(index);
    }

    /**
     * Add a comment under the article.
     * @param {string} commentText - The text content of the comment.
     * @returns {void}
     */
    addComment(commentText: string): void {
        cy.log('**Adding a comment...**');
        this.getCommentInput().type(commentText);
        this.getPostCommentBtn().click();
    }

    /**
     * Delete a comment by its text.
     * @param {string} commentText - The text of the comment to delete.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    deleteComment(commentText: string): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Deleting a comment...**');
        return this.getDeleteCommentBtn(commentText).click();
    }

    /**
     * Delete an article by clicking the delete button and confirming the prompt.
     * @param {number} index - Index of the article delete button.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    deleteArticle(index: number): Cypress.Chainable<JQuery<HTMLElement>> {
        cy.log('**Deleting the article...**');
        return this.getDeleteArticleBtn(index)
            .click()
            .then(() => {
                cy.on('window:confirm', (str) => {
                    expect(str).to.eq('Are you sure you want to delete the article?');
                    return true; // confirm deletion
                });
            });
    }
}

export default new ArticlePage();
