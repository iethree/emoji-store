describe('Shop page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the shop', () => {
    cy.contains('Browse Emojis');
    cy.wait(1500);
    cy.get('[data-testid=emoji-grid]').should('be.visible');
  });

  it('displays emojis from the api', () => {
    cy.wait(2000);
    cy.get('[data-testid=emoji-1]').should('exist');
    cy.get('[data-testid=emoji-1]').contains('Grinning Face');
  });

  it('shows emoji cards', () => {
    cy.get('[data-testid=emoji-grid]').children().should('have.length.greaterThan', 5);
  });

  it('shows emoji cards with prices', () => {
    cy.wait(1000);
    cy.get('[data-testid=emoji-grid]').children().should('have.length.greaterThan', 5);
    cy.contains('$1.99');
  });

  it('filters by category faces', () => {
    cy.get('[data-testid=category-faces]').click();
    cy.wait(800);
    cy.get('[data-testid=emoji-grid]').children().should('have.length', 5);
  });

  it('filters by category food', () => {
    cy.get('[data-testid=category-food]').click();
    cy.wait(500);
    cy.get('[data-testid=emoji-grid]').children().should('have.length.at.least', 1);
  });

  it('category button becomes active when clicked', () => {
    cy.get('[data-testid=category-party]').click();
    cy.get('[data-testid=category-party]').should('have.class', 'active');
  });

  it('all category shows all emojis', () => {
    cy.get('[data-testid=category-faces]').click();
    cy.wait(500);
    cy.get('[data-testid=category-all]').click();
    cy.wait(500);
    cy.get('[data-testid=emoji-grid]').children().should('have.length.greaterThan', 10);
  });

  it('displays rocket emoji', () => {
    cy.contains('Rocket');
  });

  it('displays unicorn emoji', () => {
    cy.contains('Unicorn');
  });
});
