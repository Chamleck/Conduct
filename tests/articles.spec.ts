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

describe('🧾 E2E Articles CRUD Flow', () => {
    const sessionId = 'articlesUserSession';
    const currentUser = users.validUsers[1]!;

    before(() => {
        cy.log('🧱 [Setup] Seeding user before Article CRUD tests...');

        // First, seed the user
        return cy.task('seedUser', currentUser).then((result) => {
            cy.log(`✅ [DB] User seeded: ${currentUser.email}`);
            cy.log(`🧩 Seed result: ${JSON.stringify(result)}`);

            // After seeding, log in
            cy.log('🔐 [Auth] Logging in seeded user...');
            cy.loginTRPCUser(sessionId, currentUser.email, currentUser.password);
        });
    });

    beforeEach(() => {
        cy.log('♻️ [Pre-test] Restoring session before each test...');
        cy.loginTRPCUser(sessionId, currentUser.email, currentUser.password);
    });

    after(function () {
        cy.log('🧹 [Cleanup] Starting cleanup after all Article CRUD tests...');

        const lastTest = this.test?.parent?.tests?.slice(-1)[0];

        if (lastTest && lastTest.state === 'failed') {
            cy.log('⚠️ [Cleanup] Last test failed — removing article from DB...');
            return cy.task('deleteArticle', article.title).then((result) => {
                cy.log(`🗑️ [DB] Deleted article: "${article.title}"`);
                cy.log(`🧩 Delete result: ${JSON.stringify(result)}`);
            });
        } else {
            cy.log('✅ [Cleanup] All tests passed — skipping article deletion.');
        }

        return cy.task('deleteUser', currentUser.email).then((result) => {
            cy.log(`🗑️ [DB] User deleted: ${currentUser.email}`);
            cy.log(`🧩 Delete result: ${JSON.stringify(result)}`);

            cy.clearCookies();
            cy.clearLocalStorage();
            Cypress.session.clearAllSavedSessions();
            cy.log('🧽 [Cleanup] Cookies and local storage cleared.');
        });
    });


    it('📝 Creates an article and verifies its display', () => {
        cy.intercept('POST', '/api/trpc/articles.create*').as('createArticle');

        cy.log('➡️ Opening home page and navigating to editor...');
        cy.visit('/');
        HomePage.getNewArticleBtn().click();

        cy.url().should('include', '/editor');

        cy.log('🧠 Publishing new article...');
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
        cy.log('✅ Article successfully created.');

        cy.log('🔍 Verifying article content...');
        ArticlePage.getArticleTitle(article.title).should('be.visible');
        ArticlePage.getArticleBody(article.body).should('be.visible');
        ArticlePage.getAuthorName(currentUser.username, 0).should('be.visible');
        ArticlePage.getAuthorName(currentUser.username, 1).should('be.visible');

        cy.log('💬 Adding comment...');
        ArticlePage.addComment('This is a test comment!');
        ArticlePage.getCommentByText('This is a test comment!').should('be.visible');
        cy.log('✅ Comment successfully added.');
    });

    it('🌍 Verifies the article appears in the global feed', () => {
        cy.log('➡️ Opening global feed...');
        cy.visit('/');

        cy.log('🔍 Checking article presence...');
        HomePage.getAuthorName(currentUser.username).should('be.visible');
        HomePage.getTitle(article.title).should('be.visible');
        HomePage.getDescription(article.description).should('be.visible');
        HomePage.getUsersTag(article.tag, currentUser.username).should('be.visible');

        cy.log('✅ Article successfully visible in the global feed.');
    });

    it('❤️ Adds and removes a like', () => {
        cy.log('➡️ Opening home page...');
        cy.visit('/');

        cy.log('👍 Liking the article...');
        HomePage.getLikeBtnByAuthorName(currentUser.username).click();
        HomePage.getLikeBtnByAuthorName(currentUser.username).should('contain.text', '1');

        cy.log('👎 Removing the like...');
        HomePage.getLikeBtnByAuthorName(currentUser.username).click();
        HomePage.getLikeBtnByAuthorName(currentUser.username).should('contain.text', '0');

        cy.log('✅ Like successfully added and removed.');
    });

    it('🗑️ Deletes an article with a comment', () => {
        cy.intercept('POST', '/api/trpc/articles.deleteArticle*').as('deleteArticle');

        cy.log('➡️ Navigating to article page...');
        cy.visit('/');
        HomePage.getTitle(article.title).eq(0).click();

        cy.url().should('include', '/article/');
        cy.log('🧹 Deleting article...');
        ArticlePage.deleteArticle(0);

        cy.wait('@deleteArticle')
            .its('response.statusCode')
            .should('eq', 200);

        cy.log('✅ Article successfully deleted (with comment).');
        HomePage.getTitle(article.title).should('not.exist');
    });

    it('🗑️ Deletes an article without a comment', () => {
        cy.intercept('POST', '/api/trpc/articles.deleteArticle*').as('deleteArticle');
        cy.intercept('GET', '/api/trpc/comments.getCommentsForArticle*').as('getComment');

        cy.log('➡️ Navigating to article page...');
        cy.visit('/');
        HomePage.getTitle(article.title).eq(0).click();

        cy.url().should('include', '/article/');

        cy.log('🧽 Deleting comment before deleting the article...');
        ArticlePage.deleteComment('This is a test comment!');

        cy.wait('@getComment')
            .its('response.statusCode')
            .should('eq', 200);

        ArticlePage.getCommentByText('This is a test comment!').should('not.exist');
        cy.log('✅ Comment successfully removed.');

        cy.log('🗑️ Deleting article...');
        ArticlePage.deleteArticle(0);

        cy.wait('@deleteArticle')
            .its('response.statusCode')
            .should('eq', 200);

        cy.log('✅ Article successfully deleted (without comments).');
        HomePage.getTitle(article.title).should('not.exist');
    });
});
