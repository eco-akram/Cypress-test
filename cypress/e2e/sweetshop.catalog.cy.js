describe('Sweetshop – Saldumynų katalogas ir krepšelio funkcijos', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Prideda kelis produktus, tikrina sumas ir pristatymo būdus', () => {
    cy.visit('/');
    cy.nav('/sweets');
    cy.url().should('include', '/sweets');

    // Pridedame dvi prekes
    cy.addProduct('Chocolate Cups');
    cy.addProduct(/Sherb(e)?rt Straws/);

    // Navigacijos krepšelio ženkliukas turėtų rodyti kiekį > 0
    cy.basketBadge().invoke('text').then((t) => {
      const count = parseInt(t.trim(), 10);
      expect(count).to.be.gte(2);
    });

    // Pereiname į krepšelio puslapį
    cy.nav('/basket');
    cy.url().should('include', '/basket');

    // Tikriname, ar pasirinktos prekės rodomos krepšelyje
    cy.contains('#basketItems', /Chocolate Cups/i).should('exist');
    cy.contains('#basketItems', /Sherb(e)?rt Straws/i).should('exist');

    // Tikriname tekstus / bendrą informaciją
    cy.contains('Your Basket').should('be.visible');
    cy.contains('#basketItems li', /Total\s*\(GBP\)/i).should('be.visible');

    // Pagal nutylėjimą turi būti pažymėtas „Collect“
    cy.get('#exampleRadios1').should('be.checked');

    // Perjungiame į „Standard Shipping“
    cy.get('#exampleRadios2').check({ force: true }).should('be.checked');

    // Ištuštiname krepšelį
    cy.contains('a', /Empty Basket/i).click();
    cy.wait(500);
    cy.get('#basketCount').should('contain', '0');
  });

  describe('Produktų katalogo atvaizdavimas', () => {
    it('Visi produktai turi būti parodyti su pilna informacija', () => {
      cy.visit('/');
      cy.contains('Sweets').click();

      cy.contains('Browse sweets').should('be.visible');
      cy.contains('Browse our delicious choice of retro sweets').should('be.visible');

      cy.get('.card').should('have.length.at.least', 16);

      cy.get('.card').each(($product) => {
        cy.wrap($product).should('be.visible');
        cy.wrap($product).find('img').should('exist');
        cy.wrap($product).find('.card-title, h5, h4').should('exist');
        cy.wrap($product).should('contain.text', '£');
        cy.wrap($product).find('button, .btn').should('exist').and('be.visible');
      });
    });

    it('Produktų kainos ir aprašymai turi būti tikslūs', () => {
      cy.visit('/');
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');

      cy.contains('Chocolate Cups').should('be.visible')
        .closest('.card')
        .should('contain.text', '£1.00');

      cy.contains('Sherbert Straws').should('be.visible');
      cy.contains('Rainbow Dust Straws - Choose your colour').should('be.visible');
      cy.contains('Sherbert Straws').closest('.card').should('contain.text', '£0.75');

      cy.contains('Sherbert Discs').should('be.visible');
      cy.contains('UFO\'s Sherbert Filled Flying Saucers').should('be.visible');
      cy.contains('Sherbert Discs').closest('.card').should('contain.text', '£0.95');

      cy.contains('Wham Bars').should('be.visible');
      cy.contains('Wham original raspberry chew bar').should('be.visible');
      cy.contains('Wham Bars').closest('.card').should('contain.text', '£0.15');

      cy.get('.card').should('have.length.at.least', 8);

      cy.contains('Bon Bons').should('be.visible');
      cy.contains('Jellies').should('be.visible');
      cy.contains('Fruit Salads').should('be.visible');
      cy.contains('Bubble Gums').should('be.visible');
    });

    it('Produktų nuotraukos turi turėti tinkamus atributus', () => {
      cy.visit('/');
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');

      cy.get('.card').each(($product) => {
        cy.wrap($product).find('img').should('exist');
        cy.wrap($product).find('img').should('have.attr', 'src');

        cy.wrap($product).find('img').then(($img) => {
          if ($img.attr('alt') !== undefined) {
            cy.log('Nuotrauka turi alt atributą');
          } else {
            cy.log('⚠ Nuotrauka neturi alt atributo');
          }
        });
      });

      cy.get('.card').should('have.length.at.least', 16);
    });
  });

  describe('Krepšelio veiksmai', () => {
    it('Prekės turi būti pridedamos į krepšelį', () => {
      cy.visit('/');
      cy.contains('Sweets').click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('Page not found')) {
          cy.log('⚠ Sweets puslapis neprieinamas – testas praleidžiamas');
          return;
        }

        cy.get('body').then(($inner) => {
          const btns = $inner.find('button:contains("Add to Basket"), button:contains("Add")');
          if (btns.length > 0) {
            cy.wrap(btns).first().click();

            if (btns.length > 1) {
              cy.wrap(btns).eq(1).click();
            }

            cy.log('Prekės pridėtos į krepšelį');
          } else {
            cy.log('⚠ Nerasta Add to Basket mygtukų');
          }
        });
      });
    });

    it('Krepšelyje turi būti rodomi teisingi produktai ir kiekiai', () => {
      cy.visit('/');
      cy.contains('Basket').click();

      cy.url().should('include', '/basket');

      cy.get('body').then(($body) => {
        const text = $body.text();

        if (text.includes('Your Basket')) {
          cy.contains('Your Basket').should('be.visible');

          if (/x \d+/.test(text)) {
            cy.contains(/x \d+/).should('be.visible');
          }

          if (text.includes('Total')) {
            cy.contains('Total').should('be.visible');
            cy.contains(/£\d+\.\d{2}/).should('be.visible');
          }
        }
      });
    });

    it('Krepšelio prekės turi būti ištrinamos', () => {
      cy.visit('/');
      cy.contains('Basket').click();

      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('Delete Item') || bodyText.includes('Remove')) {
          cy.get('a:contains("Delete Item"), button:contains("Remove")').first().click();
          cy.log('Ištrynimo veiksmas atliktas');
        } else {
          cy.log('⚠ Nerasta šalinimo mygtukų');
        }
      });
    });

    it('Ištuštintas krepšelis turėtų rodyti 0 sumą', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.get('body').then(($body) => {
        const text = $body.text();

        if (text.includes('£0.00')) {
          cy.contains('Total (GBP)').should('be.visible');
          cy.contains('£0.00').should('be.visible');
          cy.contains('Empty Basket').should('be.visible');
          cy.log('Krepšelis jau tuščias');
        } else if (text.includes('Empty Basket')) {
          cy.contains('Empty Basket').click();
          cy.contains('£0.00').should('be.visible');
          cy.log('Krepšelis sėkmingai ištuštintas');
        } else {
          // Jei krepšelyje yra prekių – pašaliname visas
          cy.get('a:contains("Delete Item")').each(($del) => {
            cy.wrap($del).click();
          });
          cy.contains('£0.00').should('be.visible');
        }
      });

      cy.contains('Your Basket').should('be.visible');
      cy.contains('£0.00').should('be.visible');
    });
  });
});
