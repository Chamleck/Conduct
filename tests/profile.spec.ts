/// <reference types="cypress" />
import users from '../cypress/fixtures/users.json';
import profile from '../cypress/fixtures/profile.json';
import '../cypress/support/commands';
import {
    LoginPage,
    ProfilePage,
} from '../cypress/support/pages';

describe('E2E: Profile Editing Flow', () => {
    const sessionId = 'profileUserSession';
    const currentUser = users.validUsers[1]!;

    before(() => {
        cy.log('🔐 Logging in before Profile Edit tests...');

        // First, seed the user
        cy.task('seedUser', currentUser).then((result) => {
            cy.log(`✅ User seeded: ${currentUser.email}`);
            cy.log(`🧩 Seed result: ${JSON.stringify(result)}`);

            // Then log in
            cy.loginTRPCUser(sessionId, currentUser.email, currentUser.password);
        });
    });

    after(() => {
        cy.log('🧹 Cleaning up: clearing cookies and local storage');

        // Then delete the user, after clearing cookies and local storage
        cy.task('deleteUser', currentUser.email).then((result) => {
            cy.log(`🗑️ User deleted: ${currentUser.email}`);
            cy.log(`🧩 Delete result: ${JSON.stringify(result)}`);
        });

        Cypress.session.clearAllSavedSessions();
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.log('🧽 [Cleanup] Cookies and local storage cleared.');
    });


    it('❌ Should display validation errors when editing profile with invalid email and password', () => {

        cy.loginTRPCUser(sessionId, currentUser.email, currentUser.password);

        cy.intercept('POST', '/api/trpc/auth.updateUser*').as('updateUser');

        cy.visit('/settings');
        cy.log('✏️ Attempting to edit profile with invalid data');

        ProfilePage.editProfile(
            profile.username,
            profile.bio,
            users.invalidUsers[2]!.email,
            users.invalidUsers[2]!.password
        );

        ProfilePage.getBtn('Update Settings').click();

        cy.wait('@updateUser')
            .its('response.statusCode')
            .should('eq', 400);

        ProfilePage.getErrorMessage('password: String must contain at least 8 character(s)').should('be.visible');
        ProfilePage.getErrorMessage('email: Invalid email').should('be.visible');
    });

    it('✅ Should successfully update profile with valid data', () => {

        cy.loginTRPCUser(sessionId, currentUser.email, currentUser.password);

        cy.intercept('POST', '/api/trpc/auth.updateUser*').as('updateUser');

        cy.visit('/settings');
        cy.log('✏️ Editing profile with valid data');

        ProfilePage.editProfile(
            profile.username,
            profile.bio,
            profile.email,
            profile.password
        );

        ProfilePage.getBtn('Update Settings').click();

        cy.wait('@updateUser')
            .its('response.statusCode')
            .should('eq', 200);

        cy.reload();

        cy.log('🔍 Verifying updated profile data');
        ProfilePage.getUsernameField().should('have.attr', 'value', profile.username);
        ProfilePage.getBioField().should('have.value', profile.bio);
        ProfilePage.getEmailField().should('have.value', profile.email);

        ProfilePage.getUserNameInHeader(profile.username).should('be.visible');

        ProfilePage.getBtn('Or click here to logout.').click();
        LoginPage.getSignInHeaderBtn().should('be.visible');
    });

    it('🔁 Should log in with updated credentials and restore original profile data', () => {

        cy.intercept('POST', '/api/trpc/auth.login*').as('login');
        cy.intercept('POST', '/api/trpc/auth.updateUser*').as('updateUser');

        cy.visit('/login');
        cy.log('🔑 Logging in with updated credentials');

        LoginPage.submitLoginForm(profile.email, profile.password);

        cy.wait('@login')
            .its('response.statusCode')
            .should('eq', 200);

        ProfilePage.getHeader().should('be.visible');
        ProfilePage.getUserNameInHeader(profile.username).should('be.visible');
        ProfilePage.getSettigsBtn().click();
        cy.url().should('include', '/settings');

        cy.log('♻️ Reverting profile data to original user');
        ProfilePage.editProfile(
            currentUser.username,
            profile.bio,
            currentUser.email,
            currentUser.password
        );

        ProfilePage.getBtn('Update Settings').click();

        cy.wait('@updateUser')
            .its('response.statusCode')
            .should('eq', 200);

        cy.reload();

        cy.log('🔍 Verifying reverted profile data');
        ProfilePage.getUsernameField().should('have.attr', 'value', currentUser.username);
        ProfilePage.getBioField().should('have.value', profile.bio);
        ProfilePage.getEmailField().should('have.value', currentUser.email);

        ProfilePage.getUserNameInHeader(currentUser.username).should('be.visible');
        ProfilePage.getBtn('Or click here to logout.').click();

        LoginPage.getSignInHeaderBtn().should('be.visible');
    });

});
