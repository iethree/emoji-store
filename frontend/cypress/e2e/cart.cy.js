describe('Cart', () => {
  it('starts empty when you first visit', () => {
    cy.clearLocalStorage();
    cy.visit('/cart');
    cy.get('[data-testid=empty-cart]').should('exist');
  });

  it('adds an item to the cart', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid=add-1]').click();
    cy.get('[data-testid=cart-count]').should('contain', '1');
  });

  it('adds an item to the cart and shows it in the cart page', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/cart');
    cy.get('[data-testid=cart-row-1]').should('exist');
  });

  it('increments quantity when adding the same emoji twice', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(800);
    cy.get('[data-testid=add-2]').click();
    cy.get('[data-testid=add-2]').click();
    cy.get('[data-testid=cart-count]').should('contain', '2');
  });

  it('persists cart across page reloads', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(500);
    cy.get('[data-testid=add-3]').click();
    cy.reload();
    cy.get('[data-testid=cart-count]').should('contain', '1');
  });

  it('removes an item', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(500);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/cart');
    cy.get('[data-testid=remove-1]').click();
    cy.get('[data-testid=empty-cart]').should('exist');
  });

  it('updates quantity via input', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(400);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/cart');
    cy.get('[data-testid=qty-1]').clear().type('5');
    cy.get('[data-testid=summary-count]').should('contain', '5');
  });

  it('calculates subtotal correctly', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(500);
    cy.get('[data-testid=add-1]').click();
    cy.get('[data-testid=add-1]').click();
    cy.visit('/cart');
    cy.get('[data-testid=summary-total]').should('contain', '$3.98');
  });

  it('shows discount note when item count >= 5', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(500);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/cart');
    cy.get('[data-testid=qty-1]').clear().type('6');
    cy.get('[data-testid=discount-note]').should('exist');
  });

  it('cart count updates in nav', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(500);
    cy.get('[data-testid=add-1]').click();
    cy.get('[data-testid=add-2]').click();
    cy.get('[data-testid=add-3]').click();
    cy.get('[data-testid=cart-count]').should('contain', '3');
  });
});

describe('Cart again', () => {
  it('adds an item to the cart', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(1200);
    cy.get('[data-testid=add-1]').click();
    cy.get('[data-testid=cart-count]').should('contain', '1');
  });

  it('can navigate to checkout', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(500);
    cy.get('[data-testid=add-1]').click();
    cy.visit('/cart');
    cy.get('[data-testid=checkout-btn]').click();
    cy.url().should('include', '/checkout');
  });
});
