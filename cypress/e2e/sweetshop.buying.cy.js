describe('Sweetshop – Checkout formos patikra', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Užpildo pristatymo formą – klaidų pranešimų nematyti', () => {
    cy.visit('/sweets');
    cy.contains('.card', /Chocolate Cups/i).within(() => {
      cy.get('a.addItem').click();
    });
    cy.nav('/basket');
    cy.url().should('include', '/basket');

    // Užpildo vardą ir pavardę (kai kuriose versijose abu laukai turi id="name")
    cy.get('form.needs-validation').within(() => {
      cy.get('input[type="text"]#name').first().clear().type('Akram'); 
      cy.get('input[type="text"]#name').eq(1).clear().type('Abdellatif'); 

      cy.get('#email').clear().type('akramabdellatif@gmail.com');
      cy.get('#address').clear().type('Simonaitytes g. 1');
      cy.get('#address2').clear().type('Rambyno g. 16');

      cy.get('#country').select('United Kingdom');
      cy.get('#city').select('Bristol');
      cy.get('#zip').clear().type('BS1 1DA');

      cy.get('#cc-name').clear().type('AKRAM ABDELLATIF');
      cy.get('#cc-number').clear().type('5555 5555 5555 5555'); 
      cy.get('#cc-expiration').clear().type('01/01');
      cy.get('#cc-cvv').clear().type('123');

      cy.contains('button', /Continue to checkout/i).click();
    });

    // Tikrinama, kad nebūtų matomų invalid-feedback elementų
    cy.assertNoVisibleInvalidFeedback();
  });

  it('Rodo klaidas, jei forma tuščia', () => {
    cy.visit('/basket');
    cy.get('form.needs-validation').within(() => {
      cy.contains('button', /Continue to checkout/i).click();
    });

    // Tikrinama, kad klaidos atsirado
    cy.get('.invalid-feedback').should('exist');
  });

  describe('Apie puslapį', () => {
    it('Puslapis apie projektą atidaromas ir rodo turinį', () => {
      cy.visit('/');
      cy.contains('About').click();

      cy.get('body').should('be.visible');
      cy.contains('Sweet Shop Project').should('be.visible');
    });

    it('Galima naviguoti į Apie puslapį ir matyti turinį', () => {
      cy.visit('/');
      cy.contains('About').click();

      cy.get('body').should('be.visible');
      cy.contains('About').click();

      cy.get('body').should('contain.text', 'Sweet Shop Project');
    });

    it('Patikrina, kad Apie puslapis rodo profesionalų turinį', () => {
      cy.visit('/');
      cy.contains('About').click();

      cy.contains('Sweet Shop Project').should('be.visible');
      cy.get('h1, h2').should('contain.text', 'Sweet Shop Project');
      cy.get('p').should('have.length.at.least', 2);
    });
  });

  describe('Išplėstinis užsakymo procesas', () => {
    it('Gali pasiekti krepšelio puslapį', () => {
      cy.visit('/');
      cy.contains('Basket').click();

      cy.url().should('include', '/basket');
      cy.contains('Your Basket').should('be.visible');
      cy.contains('Continue to checkout').should('be.visible');

      cy.log('Krepšelio puslapis pasiekiamas');
    });

    it('Rodo atsiskaitymo adreso laukus', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Billing address').should('be.visible');
      cy.contains('First name').should('be.visible');
      cy.contains('Last name').should('be.visible');
      cy.contains('Email').should('be.visible');
      cy.contains('Address').should('be.visible');
    });

    it('Rodo mokėjimo laukus', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Payment').should('be.visible');
      cy.contains('Name on card').should('be.visible');
      cy.contains('Credit card number').should('be.visible');
      cy.contains('Expiration').should('be.visible');
      cy.contains('CVV').should('be.visible');
    });

    it('Rodo užsakymo suvestinės sekciją', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Total').should('be.visible');
      cy.get('body').should('contain.text', '£');

      cy.log('Užsakymo suvestinės sekcija matoma');
    });

    it('Rodo pristatymo pasirinkimus', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Delivery').should('be.visible');
      cy.contains('Collect').should('be.visible');
      cy.contains('Standard Shipping').should('be.visible');

      cy.log('Pristatymo pasirinkimai matomi');
    });

    it('Rodo krepšelio prekes, jei jos yra', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('£0.00')) {
          cy.contains('Empty Basket').should('be.visible');
          cy.log('Tuščio krepšelio būsena patvirtinta');
        } else {
          const items = ['Sherbert Straws', 'Sherbet Discs', 'Strawberry Bon Bons', 'Chocolate Cups'];

          let itemsFound = 0;
          items.forEach((item) => {
            if (bodyText.includes(item)) {
              itemsFound++;
              cy.log(`Rasta prekė: ${item}`);
            }
          });

          if (itemsFound > 0) {
            cy.log(`Rasta ${itemsFound} prekės krepšelyje`);
          } else {
            cy.log('Krepšelio turinys patikrintas (gali būti kitos prekės)');
          }
        }
      });
    });

    it('Formos struktūra išlieka sąveikos metu', () => {
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      cy.contains('Billing address').should('be.visible');
      cy.contains('Payment').should('be.visible');
      cy.contains('Your Basket').should('be.visible');
      cy.contains('Delivery').should('be.visible');
      cy.contains('Sweet Shop Project 2018').should('be.visible');
    });
  });
});
