describe('Checkout flow', () => {
  it('redirects on empty cart', () => {
    cy.clearLocalStorage();
    cy.visit('/checkout');
    cy.get('[data-testid=empty-checkout]').should('exist');
  });

  it('shows registration form', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/checkout');
    cy.get('[data-testid=register-form]').should('exist');
  });

  it('allows registering a new customer', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/checkout');
    const rand = Math.floor(Math.random() * 1000000);
    cy.get('[data-testid=register-email]').type(`test${rand}@ex.com`);
    cy.get('[data-testid=register-name]').type(`Test ${rand}`);
    cy.get('[data-testid=register-submit]').click();
    cy.get('[data-testid=customer-info]').should('exist');
  });

  it('completes a purchase', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1500);
    cy.get('[data-testid=add-1]').click();
    cy.get('[data-testid=add-2]').click();
    cy.visit('/checkout');
    cy.wait(600);
    cy.registerRandomCustomer();
    cy.wait(1500);
    cy.get('[data-testid=pay-btn]').click();
    cy.wait(1000);
    cy.url().should('include', '/orders/');
    cy.get('[data-testid=thank-you]').should('exist');
  });

  it('shows total on checkout', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(800);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/checkout');
    cy.get('[data-testid=checkout-total]').should('contain', '$1.99');
  });

  it('rejects duplicate email', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/checkout');
    cy.get('[data-testid=register-email]').type('demo@emojistore.test');
    cy.get('[data-testid=register-name]').type('dup');
    cy.get('[data-testid=register-submit]').click();
    cy.get('[data-testid=register-error]').should('exist');
  });

  it('can purchase with monopoly money twice in a row', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1200);
    cy.get('[data-testid=add-5]').click();
    cy.visit('/checkout');
    cy.registerRandomCustomer();
    cy.wait(1500);
    cy.get('[data-testid=pay-btn]').click();
    cy.wait(1500);
    cy.visit('/');
    cy.wait(800);
    cy.get('[data-testid=add-4]').click();
    cy.visit('/checkout');
    cy.wait(700);
    cy.get('[data-testid=pay-btn]').click();
    cy.url().should('include', '/orders/');
  });

  it('displays customer balance', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(900);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/checkout');
    cy.registerRandomCustomer();
    cy.wait(800);
    cy.get('[data-testid=balance]').should('contain', '$1000.00');
  });
});
