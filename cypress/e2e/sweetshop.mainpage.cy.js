describe('Sweetshop – Pagrindinis puslapis', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Turi puslapio pavadinimą', () => {
    cy.title().should('match', /Sweet Shop/i);
  });

  it('Nuoroda „Naršyti saldainius“ veda į /sweets su teisingu antraštės tekstu', () => {
    cy.contains('a', /Browse Sweets/i).click();
    cy.get('h1, h2').contains(/Browse sweets/i).should('be.visible');
    cy.url().should('include', '/sweets');
  });

  it('Populiariausi saldainiai rodo 4 korteles su įkeltomis nuotraukomis ir mygtuku „Pridėti į krepšelį“', () => {
    cy.get('div.card').should('have.length', 4).each(($card) => {
      cy.wrap($card).find('a.addItem').should('be.visible');
      cy.wrap($card).find('img').should('be.visible').and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
    });
  });

  const navMatrix = [
    { linkText: 'Sweets', expectedHeading: /Browse sweets/i, path: '/sweets' },
    { linkText: 'About', expectedHeading: /Sweet Shop Project/i, path: '/about' },
    { linkText: 'Login', expectedHeading: /Login/i, path: '/login' },
    { linkText: 'Basket', expectedHeading: /Your Basket/i, path: '/basket' },
  ];

  navMatrix.forEach(({ linkText, expectedHeading, path }) => {
    it(`Navigacijos nuoroda "${linkText}" atidaro teisingą puslapį`, () => {
      // Krepšelio nuoroda gali turėti skaitmeninį ženklelį, todėl naudojamas regex
      if (linkText === 'Basket') {
        cy.get('a.nav-link[href="/basket"]').click();
      } else {
        cy.get('a.nav-link').contains(new RegExp(`^${linkText}$`, 'i')).click();
      }
      cy.url().should('include', path);
      cy.get('h1, h2').contains(expectedHeading).should('be.visible');
    });
  });

  // Papildomi testai
  it('Rodo pagrindinio puslapio turinį – sveikinimo žinutę ir aprašymą', () => {
    cy.contains('Welcome to the sweet shop!').should('be.visible');
    cy.contains('The sweetest online shop out there.').should('be.visible');
    cy.contains('Browse Sweets').should('be.visible');
    cy.get('.navbar').should('be.visible');
    cy.contains('Our most popular choice of retro sweets.').should('be.visible');
  });
});
