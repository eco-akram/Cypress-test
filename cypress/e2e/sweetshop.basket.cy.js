describe('Sweetshop – Krepšelio formos validacija', () => {
  beforeEach(() => {
    cy.visit('/basket');
  });

  it('Pateikus tuščią formą turi atsirasti visi numatyti klaidų pranešimai', () => {
    cy.contains('button', /Continue to checkout/i).click();

    const klaidos = [
      'Valid first name is required.',
      'Valid last name is required.',
      'Please enter a valid email address for shipping updates.',
      'Please enter your shipping address.',
      'Please select a valid country.',
      'Please provide a valid state.',
      'Zip code required.',
      'Name on card is required',
      'Credit card number is required',
      'Expiration date required',
      'Security code required',
    ];

    klaidos.forEach((m) => {
      cy.contains('.invalid-feedback', m).should('be.visible');
    });
  });

  it('El. paštas be @ simbolio turi būti laikomas netinkamu', () => {
    cy.get('#email').clear().type('johnsmith');
    cy.contains('button', /Continue to checkout/i).click();

    cy.contains(
      '.invalid-feedback',
      'Please enter a valid email address for shipping updates.'
    ).should('be.visible');
  });

  it('El. paštas be taško domeno dalyje priimamas kaip galiojantis (naršyklės elgsena)', () => {
    cy.get('#email').clear().type('johnsmith@testcom');
    cy.contains('button', /Continue to checkout/i).click();

    cy.contains(
      '.invalid-feedback',
      'Please enter a valid email address for shipping updates.'
    ).should('not.be.visible');
  });

  it('Vardų laukuose leidžiami skaičiai (pagal dabartinę implementaciją)', () => {
    cy.get('input#name').should('have.length.gte', 2);

    cy.get('input#name').eq(0).type('12345');
    cy.get('input#name').eq(1).type('67890');
    cy.get('#cc-name').type('12345 12345');

    cy.contains('button', /Continue to checkout/i).click();

    cy.contains('.invalid-feedback', 'Valid first name is required.').should('not.be.visible');
    cy.contains('.invalid-feedback', 'Valid last name is required.').should('not.be.visible');
  });

  const nenumeriniaiDuomenys = [
    { label: 'tik raidės', card: 'ABCDABCDABCDABCD', exp: 'ABCD' },
    { label: 'tik simboliai', card: '!@#$!@#$!@#$!@#$', exp: '!@#$' },
    { label: 'raidės + simboliai', card: 'AB!@AB!@AB!@AB!@', exp: 'AB!@' },
  ];

  nenumeriniaiDuomenys.forEach(({ label, card, exp }) => {
    it(`Banko kortelės laukai išlaiko įvestus simbolius (${label})`, () => {
      cy.get('#cc-number').type(card, { force: true });
      cy.get('#cc-number').invoke('val').should('eq', card);

      cy.get('#cc-expiration').type(exp, { force: true });
      cy.get('#cc-expiration').invoke('val').should('eq', exp);
    });
  });

  const blogiCvvVariantai = ['ABC', '*&(', 'A$C'];

  blogiCvvVariantai.forEach((cvv) => {
    it(`CVV laukas turi atmesti netinkamus simbolius: ${cvv}`, () => {
      const laukas = cy.get('#cc-cvv');

      laukas.type(cvv, { force: true });

      laukas.invoke('val').then((val) => {
        expect(val).to.match(/^\d*$/);
        expect(val.length).to.be.lte(cvv.length);
      });
    });
  });

  it('Teisingai užpildžius visus laukus neturi likti klaidų pranešimų', () => {
    cy.get('input#name').should('have.length.gte', 2);

    cy.get('input#name').eq(0).type('John');
    cy.get('input#name').eq(1).type('Smith');

    cy.get('#email').type('john.smith@test.com');
    cy.get('#address').type('10-12 Fairfax St');
    cy.get('#country').select('United Kingdom');
    cy.get('#city').select('Bristol');
    cy.get('#zip').type('BS1 3DB');

    cy.get('#cc-name').type('John Smith');
    cy.get('#cc-number').type('4111 1111 1111 1111');
    cy.get('#cc-expiration').type('12/40');
    cy.get('#cc-cvv').type('123');

    cy.contains('button', /Continue to checkout/i).click();

    cy.get('.invalid-feedback:visible').should('have.length', 0);
  });
});
