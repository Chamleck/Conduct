
/// <reference types="cypress" />
import users from '../cypress/fixtures/users.json';
import { SignUpPage, LoginPage } from '../cypress/support/pages';

describe('E2E Auth Flow', () => {

    after(() => {
        // Удаляем юзера из БД по email через таску
        cy.task('deleteUser', users.validUser.email);

        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('Регистрация и логин с корректными данными', () => {

        cy.intercept('POST', '/api/trpc/auth.register*').as('registerUser');
        // Регистрация
        cy.visit('/register');
        SignUpPage.fillSignUpForm(
            users.validUser.username,
            users.validUser.email,
            users.validUser.password
        );

        cy.wait('@registerUser').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });

        SignUpPage.getHeader().should('be.visible');

        SignUpPage.getUserNameInHeader(users.validUser.username).should('be.visible');

    });

    it('Login', () => {

        cy.intercept('POST', '/api/trpc/auth.login*').as('login');
        // Регистрация
        cy.visit('/login');
        LoginPage.submitLoginForm(
            users.validUser.email,
            users.validUser.password
        );

        cy.wait('@login').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
        });

        SignUpPage.getHeader().should('be.visible');

        SignUpPage.getUserNameInHeader(users.validUser.username).should('be.visible');

    });

    it('Регистрация с некорректными данными (email)', () => {
        cy.visit('/register');
        SignUpPage.fillSignUpForm(
            users.invalidUsers[1]!.username,
            users.invalidUsers[1]!.email,
            users.invalidUsers[1]!.password
        );

        SignUpPage.getErrorMessage('user.email: Invalid email').should('be.visible');
    });

    it('Регистрация с некорректными данными (password)', () => {
        cy.visit('/register');
        SignUpPage.fillSignUpForm(
            users.invalidUsers[0]!.username,
            users.invalidUsers[0]!.email,
            users.invalidUsers[0]!.password
        );

        SignUpPage.getErrorMessage('user.password: String must contain at least 8 character(s)').should('be.visible');
    });

});
