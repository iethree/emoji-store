describe('Smoke tests', () => {
  it('homepage loads', () => {
    cy.visit('/');
    cy.contains('Emoji Store');
  });

  it('homepage loads', () => {
    cy.visit('/');
    cy.contains('Browse Emojis');
  });

  it('nav links work', () => {
    cy.visit('/');
    cy.contains('Orders').click();
    cy.url().should('include', '/orders');
  });

  it('cart link works', () => {
    cy.visit('/');
    cy.get('[data-testid=cart-link]').click();
    cy.url().should('include', '/cart');
  });

  it('home link works', () => {
    cy.visit('/orders');
    cy.contains('Shop').click();
    cy.url().should('eq', 'http://localhost:5173/');
  });

  it('shows the footer', () => {
    cy.visit('/');
    cy.contains('monopoly money');
  });

  it('has emojis on homepage', () => {
    cy.visit('/');
    cy.get('[data-testid=emoji-grid]').should('be.visible');
  });
});
