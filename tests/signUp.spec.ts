/// <reference types="cypress" />
import users from '../cypress/fixtures/users.json';
import { SignUpPage, LoginPage, ProfilePage } from '../cypress/support/pages';

describe('🔐 E2E Registration & Login Flow', () => {

    after(() => {
        cy.log('🧹 Performing cleanup...');
        cy.task('deleteUser', users.validUsers[0]!.email);
        cy.log(`🗑️ Deleted test user: ${users.validUsers[0]!.email}`);

        cy.clearCookies();
        cy.clearLocalStorage();
        cy.log('✅ Cookies and local storage cleared.');
    });

    it('🆕 Registers a user with valid data', () => {
        cy.intercept('POST', '/api/trpc/auth.register*').as('registerUser');

        cy.log('➡️ Visiting registration page...');
        cy.visit('/register');

        cy.log('✍️ Filling registration form with valid user data...');
        SignUpPage.fillSignUpForm(
            users.validUsers[0]!.username,
            users.validUsers[0]!.email,
            users.validUsers[0]!.password
        );

        cy.wait('@registerUser').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            cy.log('✅ Registration request succeeded with status 200.');
        });

        cy.log('🔍 Verifying successful registration...');
        SignUpPage.getHeader().should('be.visible');
        SignUpPage.getUserNameInHeader(users.validUsers[0]!.username).should('be.visible');

        cy.log('🎉 User successfully registered and visible in header.');
    });

    it('🔑 Logs in with valid data and logs out', () => {
        cy.intercept('POST', '/api/trpc/auth.login*').as('login');

        cy.log('➡️ Visiting login page...');
        cy.visit('/login');

        cy.log('🔐 Logging in with correct credentials...');
        LoginPage.submitLoginForm(
            users.validUsers[0]!.email,
            users.validUsers[0]!.password
        );

        cy.wait('@login').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            cy.log('✅ Login request succeeded with status 200.');
        });

        cy.log('🔍 Verifying logged-in state...');
        SignUpPage.getHeader().should('be.visible');
        SignUpPage.getUserNameInHeader(users.validUsers[0]!.username).should('be.visible');

        cy.log('⚙️ Navigating to settings and logging out...');
        SignUpPage.getSettigsBtn().click();
        ProfilePage.getBtn('Or click here to logout.').click();

        LoginPage.getSignInHeaderBtn().should('be.visible');
        cy.log('✅ Successfully logged out and login button is visible.');
    });

    it('🚫 Login attempt with wrong email and password', () => {
        cy.intercept('POST', '/api/trpc/auth.login*').as('login');

        cy.log('➡️ Visiting login page...');
        cy.visit('/login');

        cy.log('🔐 Attempting login with invalid credentials...');
        LoginPage.submitLoginForm(
            users.invalidUsers[2]!.email,
            users.invalidUsers[2]!.password
        );

        cy.wait('@login').then((interception) => {
            expect(interception.response?.statusCode).to.eq(400);
            cy.log('⚠️ Login request failed as expected with status 400.');
        });

        cy.log('🔍 Verifying error messages...');
        LoginPage.getErrorMessage('user.email: Invalid email').should('be.visible');
        LoginPage.getErrorMessage('user.password: String must contain at least 8 character(s)').should('be.visible');

        cy.log('✅ Error messages displayed correctly for invalid credentials.');
    });

    it('📧 Registration attempt with invalid email', () => {
        cy.intercept('POST', '/api/trpc/auth.register*').as('registerUser');

        cy.log('➡️ Visiting registration page...');
        cy.visit('/register');

        cy.log('✍️ Attempting to register with invalid email...');
        SignUpPage.fillSignUpForm(
            users.invalidUsers[1]!.username,
            users.invalidUsers[1]!.email,
            users.invalidUsers[1]!.password
        );

        cy.wait('@registerUser').then((interception) => {
            expect(interception.response?.statusCode).to.eq(400);
            cy.log('⚠️ Registration request failed as expected with status 400.');
        });

        cy.log('🔍 Verifying error message for invalid email...');
        SignUpPage.getErrorMessage('user.email: Invalid email').should('be.visible');

        cy.log('✅ Correct validation error displayed for invalid email.');
    });

    it('🔒 Registration attempt with invalid password', () => {
        cy.intercept('POST', '/api/trpc/auth.register*').as('registerUser');

        cy.log('➡️ Visiting registration page...');
        cy.visit('/register');

        cy.log('✍️ Attempting to register with invalid password...');
        SignUpPage.fillSignUpForm(
            users.invalidUsers[0]!.username,
            users.invalidUsers[0]!.email,
            users.invalidUsers[0]!.password
        );

        cy.wait('@registerUser').then((interception) => {
            expect(interception.response?.statusCode).to.eq(400);
            cy.log('⚠️ Registration request failed as expected with status 400.');
        });

        cy.log('🔍 Verifying error message for invalid password...');
        SignUpPage.getErrorMessage('user.password: String must contain at least 8 character(s)').should('be.visible');

        cy.log('✅ Correct validation error displayed for invalid password.');
    });
});
