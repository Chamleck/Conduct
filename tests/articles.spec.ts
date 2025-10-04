/// <reference types="cypress" />
import users from '../cypress/fixtures/users.json';
import article from '../cypress/fixtures/article.json';
import '../cypress/support/commands';  // Import custom commands
import { SignUpPage, LoginPage, ProfilePage, CreateArticlePage, ArticlePage, HomePage } from '../cypress/support/pages';


describe('E2E Articles CRUD Flow', () => {

    const sessionId = 'validUserSession';

    beforeEach(() => {
        // Login via API for each test
        cy.loginTRPCUser(sessionId, users.validUsers[1]!.email, users.validUsers[1]!.password);

    });

    after(() => {
        // Logout and clear session
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('Create article via UI & verify creation', () => {

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

        cy.wait('@createArticle').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });

        cy.url().should('include', '/article/');

        ArticlePage.getArticleTitle(article.title).should('be.visible');
        ArticlePage.getArticleBody(article.body).should('be.visible');
        ArticlePage.getAuthorName(users.validUsers[1]!.username, 0).should('be.visible');
        ArticlePage.getAuthorName(users.validUsers[1]!.username, 1).should('be.visible');

        ArticlePage.addComment('This is a test comment!');
        ArticlePage.getCommentByText('This is a test comment!').should('be.visible');
    });

    it('Verify article appears in global feed and has required attributes', () => {

        // Assume article exists from previous test 
        cy.visit('/');
        HomePage.getAuthorName(users.validUsers[1]!.username).should('be.visible');
        HomePage.getTitle(article.title).should('be.visible');
        HomePage.getDescription(article.description).should('be.visible');
        HomePage.getUsersTag(article.tag, users.validUsers[1]!.username).should('be.visible');

    });

    it('Add like to article', () => {

        cy.visit('/');
        HomePage.getLikeBtnByAuthorName(users.validUsers[1]!.username).click();
        HomePage.getLikeBtnByAuthorName(users.validUsers[1]!.username).should('contain.text', '1');
        HomePage.getLikeBtnByAuthorName(users.validUsers[1]!.username).click();
        HomePage.getLikeBtnByAuthorName(users.validUsers[1]!.username).should('contain.text', '0');
    });

    it('Delete article with comment from UI', () => {
        cy.intercept('POST', '/api/trpc/articles.deleteArticle*').as('deleteArticle');
        cy.visit('/');
        HomePage.getTitle(article.title).click();
        cy.url().should('include', '/article/');
        // Confirm popup
        ArticlePage.deleteArticle(0);
        cy.wait('@deleteArticle').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });
        HomePage.getTitle(article.title).should('not.exist');
    })

    it('Delete article without comment from UI', () => {
        cy.intercept('POST', '/api/trpc/articles.deleteArticle*').as('deleteArticle');
        cy.intercept('GET', '/api/trpc/comments.getCommentsForArticle*').as('getComment');
        cy.visit('/');
        HomePage.getTitle(article.title).click();
        cy.url().should('include', '/article/');
        ArticlePage.deleteComment('This is a test comment!');
        cy.wait('@getComment').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });
        ArticlePage.getCommentByText('This is a test comment!').should('not.exist');
        // Confirm popup
        ArticlePage.deleteArticle(0);
        cy.wait('@deleteArticle').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });
        HomePage.getTitle(article.title).should('not.exist');

    })
});