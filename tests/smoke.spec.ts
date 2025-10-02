describe("Smoke test for Cypress setup", () => {
  it("Visits the homepage and checks title", () => {
    // Заходим на базовый URL приложения
    cy.visit("/");

    // Проверяем, что на странице есть текст Conduit (логотип/заголовок)
    cy.contains("Conduit");

    // Простейшая проверка URL
    cy.url().should("eq", "http://localhost:3000/");
  });
});
