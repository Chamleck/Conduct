
/// <reference types="cypress" />
import users from '../cypress/fixtures/users.json';
import { SignUpPage, LoginPage, ProfilePage } from '../cypress/support/pages';

describe('E2E Reg & Log in Flow', () => {

    after(() => {
        // Remove the user created during the test
        cy.task('deleteUser', users.validUsers[0]!.email);

        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('Registration with correct data', () => {

        cy.intercept('POST', '/api/trpc/auth.register*').as('registerUser');
        // Sign Up
        cy.visit('/register');
        SignUpPage.fillSignUpForm(
            users.validUsers[0]!.username,
            users.validUsers[0]!.email,
            users.validUsers[0]!.password
        );

        cy.wait('@registerUser').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });

        SignUpPage.getHeader().should('be.visible');

        SignUpPage.getUserNameInHeader(users.validUsers[0]!.username).should('be.visible');

    });

    it('Login with correct data & log out', () => {

        cy.intercept('POST', '/api/trpc/auth.login*').as('login');
        // Login
        cy.visit('/login');
        LoginPage.submitLoginForm(
            users.validUsers[0]!.email,
            users.validUsers[0]!.password
        );

        cy.wait('@login').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });

        SignUpPage.getHeader().should('be.visible');

        SignUpPage.getUserNameInHeader(users.validUsers[0]!.username).should('be.visible');

        SignUpPage.getSettigsBtn().click();

        ProfilePage.getBtn('Or click here to logout.').click();

        LoginPage.getSignInHeaderBtn().should('be.visible');

    });


    it('Login with wrong email and password data', () => {

        cy.intercept('POST', '/api/trpc/auth.login*').as('login');
        // Login
        cy.visit('/login');
        LoginPage.submitLoginForm(
            users.invalidUsers[2]!.email,
            users.invalidUsers[2]!.password
        );

        cy.wait('@login').then((interception) => {
            expect(interception.response?.statusCode).to.eq(400);
        });

        LoginPage.getErrorMessage('user.email: Invalid email').should('be.visible');
        LoginPage.getErrorMessage('user.password: String must contain at least 8 character(s)').should('be.visible');

    });

    it('Registration with invalid email', () => {
        // Sign Up with invalid email
        cy.intercept('POST', '/api/trpc/auth.register*').as('registerUser');

        cy.visit('/register');
        SignUpPage.fillSignUpForm(
            users.invalidUsers[1]!.username,
            users.invalidUsers[1]!.email,
            users.invalidUsers[1]!.password
        );

        cy.wait('@registerUser').then((interception) => {
            expect(interception.response?.statusCode).to.eq(400);
        });

        SignUpPage.getErrorMessage('user.email: Invalid email').should('be.visible');
    });

    it('Registration with invalid password', () => {
        // Sign Up with invalid password
        cy.intercept('POST', '/api/trpc/auth.register*').as('registerUser');

        cy.visit('/register');
        SignUpPage.fillSignUpForm(
            users.invalidUsers[0]!.username,
            users.invalidUsers[0]!.email,
            users.invalidUsers[0]!.password
        );

        cy.wait('@registerUser').then((interception) => {
            expect(interception.response?.statusCode).to.eq(400);
        });

        SignUpPage.getErrorMessage('user.password: String must contain at least 8 character(s)').should('be.visible');
    });

});
