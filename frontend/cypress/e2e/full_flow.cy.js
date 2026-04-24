describe('Full purchase flow', () => {
  let email;
  let name;

  before(() => {
    const rand = Math.floor(Math.random() * 1000000);
    email = `flow${rand}@ex.com`;
    name = `Flow ${rand}`;
  });

  it('starts at the shop', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.contains('Browse Emojis');
  });

  it('adds several emojis to the cart', () => {
    cy.get('[data-testid=add-1]').click();
    cy.get('[data-testid=add-2]').click();
    cy.get('[data-testid=add-3]').click();
    cy.get('[data-testid=cart-count]').should('contain', '3');
  });

  it('navigates to the cart', () => {
    cy.get('[data-testid=cart-link]').click();
    cy.url().should('include', '/cart');
  });

  it('shows cart items', () => {
    cy.get('[data-testid=cart-row-1]').should('exist');
    cy.get('[data-testid=cart-row-2]').should('exist');
    cy.get('[data-testid=cart-row-3]').should('exist');
  });

  it('proceeds to checkout', () => {
    cy.get('[data-testid=checkout-btn]').click();
    cy.url().should('include', '/checkout');
  });

  it('registers a new customer', () => {
    cy.get('[data-testid=register-email]').type(email);
    cy.get('[data-testid=register-name]').type(name);
    cy.get('[data-testid=register-submit]').click();
    cy.get('[data-testid=customer-info]').should('exist');
  });

  it('pays with monopoly money', () => {
    cy.get('[data-testid=pay-btn]').click();
    cy.wait(2000);
    cy.url().should('include', '/orders/');
  });

  it('lists the order in orders page', () => {
    cy.visit('/orders');
    cy.get('[data-testid=orders-list]').children().should('have.length.at.least', 1);
  });
});
