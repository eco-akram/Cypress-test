describe('Sweetshop – Pagrindiniai (smoke) testai', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Atidaro pagrindinį puslapį ir patikrina antraštę bei meniu nuorodas', () => {
    cy.visit('/');
    cy.get('header h1.display-3')
      .should('be.visible')
      .invoke('text')
      .then((t) => {
        const txt = t.trim().toLowerCase();
        expect(txt).to.match(/welcome|browse sweets|sweet shop project/);
      });

    // Patikrina navigacijos nuorodas
    cy.get('a.nav-link[href="/sweets"]').should('be.visible').and('contain', 'Sweets');
    cy.get('a.nav-link[href="/about"]').should('be.visible').and('contain', 'About');
    cy.get('a.nav-link[href="/login"]').should('be.visible').and('contain', 'Login');
    cy.get('a.nav-link[href="/basket"]').should('be.visible').and('contain', 'Basket');

    // Pereina į About puslapį ir grįžta
    cy.nav('/about');
    cy.url().should('include', '/about');
    cy.contains(/Sweet Shop Project/i).should('be.visible');

    cy.nav('/sweets');
    cy.url().should('include', '/sweets');
  });

  it('Svarbios nuotraukos įkeltos (naturalWidth > 0)', () => {
    cy.visit('/');
    cy.get('img').its('length').should('be.gte', 1);
    cy.get('img').each(($img) => {
      cy.wrap($img)
        .should('be.visible')
        .and(($el) => expect($el[0].naturalWidth).to.be.greaterThan(0));
    });
  });

  // Papildomi navigacijos testai
  describe('Išplėstiniai navigacijos testai', () => {
    it('Pereina per visas puslapių kombinacijas', () => {
      cy.visit('/');
      
      // Iš pagrindinio puslapio į Sweets
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');
      
      // Iš Sweets į About
      cy.contains('About').click();
      cy.contains('Sweet Shop Project').should('be.visible');
      
      // Iš About į Login
      cy.contains('Login').click();
      cy.contains('Login').should('be.visible');
      cy.contains('Please enter your email address and password').should('be.visible');
      
      // Iš Login į Basket
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');
    });

    it('Navigacija iš Krepšelio į kitus puslapius veikia', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      
      // Atgal į pagrindinį puslapį
      cy.contains('Sweet Shop').click();
      cy.contains('Welcome to the sweet shop!').should('be.visible');
      
      // Į Sweets
      cy.contains('Basket').click();
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');
    });
  });
});
