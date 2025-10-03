/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Cypress helper для регистрации пользователя через tRPC
     * @param username - name of user
     * @param email - email of user
     * @param password - password of user
     * @returns object with user details and token
     * @param sessionId - уникальный идентификатор сессии
     */
    loginTRPCUser(sessionId: string, email: string, password: string): Chainable<void>;

    registerTRPCUser(
      username: string,
      email: string,
      password: string
    ): Chainable<TRPCUser>;
  }
}

interface TRPCUser {
  email: string;
  username: string;
  password: string;
  token: string;
}

Cypress.Commands.add(
  "registerTRPCUser",
  (username: string, email: string, password: string): Cypress.Chainable<TRPCUser> => {
    return cy
      .request({
        method: "POST",
        url: "/api/trpc/auth.register?batch=1",
        body: {
          0: { json: { user: { username, email, password } } },
        },
        headers: {
          "content-type": "application/json",
        },
      })
      .then((res) => {
        expect(res.status).to.eq(200);

        const user = res.body?.[0]?.result?.data?.json?.user;
        if (!user) {
          throw new Error("Was not able to get user from tRPC response");
        }

        // Saving unique value (email) to be used in tests
        cy.task("setMyUniqueValue", user.email);

        return {
          email: user.email,
          username: user.username,
          password,
          token: user.token,
        } as TRPCUser;
      });
  }
);
Cypress.Commands.add(
  "loginTRPCUser",
  (sessionId: string, email: string, password: string) => {
    cy.session(
      sessionId,
      () => {
        // Формируем тело запроса для tRPC login (можно использовать auth.login, если есть endpoint)
        const requestBody = {
          0: { json: { user: { email, password } } },
        };

        cy.request({
          method: "POST",
          url: "/api/trpc/auth.login?batch=1", // предположим, что login endpoint auth.login
          body: requestBody,
          headers: { "content-type": "application/json" },
        }).then((res) => {
          // Проверка статуса
          expect(res.status).to.eq(200);

          // Извлекаем токен
          const user = res.body?.[0]?.result?.data?.json?.user;
          if (!user?.token) throw new Error("Не удалось получить токен пользователя");

          // Сохраняем токен в localStorage для UI
          window.sessionStorage.setItem("accessToken", user.token);

          // Можно сохранять email в task для удаления или дальнейшего использования
          cy.task("setMyUniqueValue", user.email);
        });
      },
      {
        cacheAcrossSpecs: true, // сохраняем сессию между тестами
      }
    );
  }
);