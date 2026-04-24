describe('Misc tests', () => {
  it('displays the cart badge', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get('[data-testid=cart-count]').should('contain', '0');
  });

  it('can add an emoji', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid=add-1]').click();
    cy.get('[data-testid=cart-count]').should('not.contain', '0');
  });

  it('can add an emoji again', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid=add-2]').click();
    cy.get('[data-testid=cart-count]').should('not.contain', '0');
  });

  it('category buttons are clickable', () => {
    cy.visit('/');
    cy.get('[data-testid=category-faces]').click();
    cy.get('[data-testid=category-food]').click();
    cy.get('[data-testid=category-animals]').click();
    cy.get('[data-testid=category-all]').click();
  });

  it('emoji card has a symbol', () => {
    cy.visit('/');
    cy.wait(1500);
    cy.get('[data-testid=emoji-1] .symbol').should('exist');
  });

  it('checkout button exists when cart has items', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(800);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/cart');
    cy.get('[data-testid=checkout-btn]').should('be.visible');
  });
});
