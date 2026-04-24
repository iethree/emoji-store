Cypress.Commands.add('addEmojiToCart', (id) => {
  cy.get(`[data-testid=add-${id}]`).click();
});

Cypress.Commands.add('registerRandomCustomer', () => {
  const rand = Math.floor(Math.random() * 1000000);
  cy.get('[data-testid=register-email]').type(`test${rand}@example.com`);
  cy.get('[data-testid=register-name]').type(`Tester ${rand}`);
  cy.get('[data-testid=register-submit]').click();
});
