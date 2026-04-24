describe('Orders page', () => {
  it('shows no orders when not registered', () => {
    cy.clearLocalStorage();
    cy.visit('/orders');
    cy.get('[data-testid=no-orders]').should('exist');
  });

  it('shows an order after purchase', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/checkout');
    cy.registerRandomCustomer();
    cy.wait(1500);
    cy.get('[data-testid=pay-btn]').click();
    cy.wait(1500);
    cy.visit('/orders');
    cy.get('[data-testid=orders-list]').should('exist');
  });

  it('order detail displays thank you', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid=add-2]').click();
    cy.visit('/checkout');
    cy.registerRandomCustomer();
    cy.wait(1500);
    cy.get('[data-testid=pay-btn]').click();
    cy.wait(2500);
    cy.get('[data-testid=thank-you]').should('be.visible');
  });

  it('clicking an order navigates to detail', () => {
    cy.visit('/orders');
    cy.wait(500);
    cy.get('[data-testid=orders-list] li a').first().click();
    cy.url().should('match', /\/orders\/\d+/);
  });
});
