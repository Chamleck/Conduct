/// <reference types="cypress" />
import users from '../cypress/fixtures/users.json';
import article from '../cypress/fixtures/article.json';
import '../cypress/support/commands';
import {
    SignUpPage,
    LoginPage,
    ProfilePage,
    CreateArticlePage,
    ArticlePage,
    HomePage
} from '../cypress/support/pages';

describe('E2E Articles CRUD Flow', () => {
    const sessionId = 'validUserSession';
    const currentUser = users.validUsers[1]!;

    beforeEach(() => {
        cy.loginTRPCUser(sessionId, currentUser.email, currentUser.password);
    });

    
    after(function () {
    const lastTest = this.test?.parent?.tests?.slice(-1)[0];

    // Выполняем очистку, только если последний тест упал
    if (lastTest && lastTest.state === 'failed') {
        cy.task('deleteArticle', article.title);
        cy.log('⚠️ Last test failed — cleaning up article from DB...');
    } else {
        cy.log('✅ All tests passed — cleanup skipped.');
    }

    cy.clearCookies();
    cy.clearLocalStorage();
});

    it('Creates an article and verifies its display', () => {
        cy.intercept('POST', '/api/trpc/articles.create*').as('createArticle');

        cy.visit('/');
        HomePage.getNewArticleBtn().click();

        cy.url().should('include', '/editor');

        CreateArticlePage.publishArticle(
            article.title,
            article.description,
            article.body,
            article.tag
        );

        cy.wait('@createArticle')
            .its('response.statusCode')
            .should('eq', 200);

        cy.url().should('include', '/article/');

        // Verify article data
        ArticlePage.getArticleTitle(article.title).should('be.visible');
        ArticlePage.getArticleBody(article.body).should('be.visible');
        ArticlePage.getAuthorName(currentUser.username, 0).should('be.visible');
        ArticlePage.getAuthorName(currentUser.username, 1).should('be.visible');

        // Add a comment
        ArticlePage.addComment('This is a test comment!');
        ArticlePage.getCommentByText('This is a test comment!').should('be.visible');
    });

    it('Verifies article appears in the global feed', () => {
        cy.visit('/');

        HomePage.getAuthorName(currentUser.username).should('be.visible');
        HomePage.getTitle(article.title).should('be.visible');
        HomePage.getDescription(article.description).should('be.visible');
        HomePage.getUsersTag(article.tag, currentUser.username).should('be.visible');
    });

    it('Adds and removes a like', () => {
        cy.visit('/');

        HomePage.getLikeBtnByAuthorName(currentUser.username).click();
        HomePage.getLikeBtnByAuthorName(currentUser.username).should('contain.text', '1');

        HomePage.getLikeBtnByAuthorName(currentUser.username).click();
        HomePage.getLikeBtnByAuthorName(currentUser.username).should('contain.text', '0');
    });

    it('Deletes an article with a comment', () => {
        cy.intercept('POST', '/api/trpc/articles.deleteArticle*').as('deleteArticle');

        cy.visit('/');
        HomePage.getTitle(article.title).click();

        cy.url().should('include', '/article/');
        ArticlePage.deleteArticle(0);

        cy.wait('@deleteArticle')
            .its('response.statusCode')
            .should('eq', 200);

        HomePage.getTitle(article.title).should('not.exist');
    });

    it('Deletes an article without a comment', () => {
        cy.intercept('POST', '/api/trpc/articles.deleteArticle*').as('deleteArticle');
        cy.intercept('GET', '/api/trpc/comments.getCommentsForArticle*').as('getComment');

        cy.visit('/');
        HomePage.getTitle(article.title).click();

        cy.url().should('include', '/article/');

        ArticlePage.deleteComment('This is a test comment!');

        cy.wait('@getComment')
            .its('response.statusCode')
            .should('eq', 200);

        ArticlePage.getCommentByText('This is a test comment!').should('not.exist');

        ArticlePage.deleteArticle(0);

        /*
        cy.wait('@deleteArticle').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });
        */

        cy.wait('@deleteArticle')
            .its('response.statusCode')
            .should('eq', 200);

        HomePage.getTitle(article.title).should('not.exist');
    });
});
