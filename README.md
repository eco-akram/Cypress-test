# Sweet Shop - Cypress E2E Testavimo Rinkinys

Išsamus end-to-end testų rinkinys Sweet Shop demo programai naudojant Cypress.

## 📋 Turinys

- [Apžvalga](#apžvalga)
- [Reikalavimai](#reikalavimai)
- [Įdiegimas](#įdiegimas)
- [Testų Struktūra](#testų-struktūra)
- [Testų Vykdymas](#testų-vykdymas)
- [CI/CD Integracija](#cicd-integracija)
- [Testų Aprėptis](#testų-aprėptis)
- [Pasirinktinės Komandos](#pasirinktinės-komandos)
- [Konfigūracija](#konfigūracija)
- [Problemų Sprendimas](#problemų-sprendimas)

## 🎯 Apžvalga

Šis projektas apima automatizuotus E2E testus Sweet Shop programai (https://sweetshop.netlify.app), apimančius:

- Vartotojo autentifikacijos procesus
- Produktų katalogo naršymą
- Krepšelio funkcionalumą
- Atsiskaitymo formos validaciją
- Navigaciją ir puslapių atvaizdavimą
- Suderinamumą su skirtingomis naršyklėmis

## ✅ Reikalavimai

- **Node.js**: Versija 20.1.0 arba naujesnė (rekomenduojama 22.0.0+ arba 24.0.0+)
- **npm**: Įeina su Node.js
- **Git**: Versijų kontrolei

## 📦 Įdiegimas

1. Klonuokite repozitoriją:
```bash
git clone https://github.com/eco-akram/Cypress-test
cd cypress-test
```

2. Įdiekite priklausomybes:
```bash
npm install
```

Tai įdiegs Cypress 15.6.0 ir visas reikalingas priklausomybes.

## 📁 Testų Struktūra

```
cypress/
├── e2e/
│   ├── sweetshop.smoke.cy.js           # Smoke testai (kritiniai keliai)
│   ├── sweetshop.login.cy.js           # Prisijungimo testai
│   ├── sweetshop.mainpage.cy.js        # Pagrindinio puslapio testai
│   ├── sweetshop.catalog.cy.js         # Produktų katalogo testai
│   ├── sweetshop.basket.cy.js          # Krepšelio validacijos testai
│   ├── sweetshop.buying.cy.js          # Atsiskaitymo proceso testai
│   └── ...
├── fixtures/
│   ├── example.json
│   └── products.json                    # Testiniai duomenys produktams
├── support/
│   ├── commands.js                      # Pasirinktinės Cypress komandos
│   └── e2e.js                          # Globali konfigūracija
└── cypress.config.js                    # Cypress konfigūracija
```

## 🚀 Testų Vykdymas

### Interaktyvus Režimas (Cypress Test Runner)

Atidaryti Cypress Test Runner testams vykdyti interaktyviai:

```bash
npm run cy:open
```

### Headless Režimas (Komandinė Eilutė)

Vykdyti visus testus headless režimu:

```bash
npm test
# arba
npm run cy:run
```

### Vykdyti Konkrečius Testų Rinkinius

```bash
# Tik smoke testai
npm run cy:run:smoke

# Autentifikacijos testai
npm run cy:run:auth

# Pagrindinio puslapio testai
npm run cy:run:homepage

# Katalogo testai
npm run cy:run:catalog

# Krepšelio validacijos testai
npm run cy:run:basket

# Atsiskaitymo testai
npm run cy:run:checkout
```

### Testai Konkrečiose Naršyklėse

```bash
# Vykdyti Chrome naršyklėje
npm run test:chrome

# Vykdyti Firefox naršyklėje
npm run test:firefox

# Vykdyti Edge naršyklėje
npm run test:edge

# Vykdyti su matoma naršykle
npm run test:headed
```

## 🔄 CI/CD Integracija

Projektas apima kelis GitHub Actions workflow procesus automatizuotam testavimui:

### 1. Pagrindinė CI Sistema (`.github/workflows/cypress.yml`)

Vykdoma:
- Push į `main` arba `develop` šakas
- Pull request į `main` arba `develop`
- Kasdien 11 val. UTC
- Rankiniu būdu

Testuoja keliose naršyklėse: Chrome, Firefox, Edge

### 2. Pull Request Testai (`.github/workflows/pr-tests.yml`)

- Vykdo smoke testus ir autentifikacijos testus kiekviename PR
- Komentuoja rezultatus tiesiogiai PR
- Įkelia ekrano nuotraukas nesėkmės atveju

### 3. Rankinis Testų Vykdymas (`.github/workflows/manual-run.yml`)

Leidžia rankinį paleidimą su parinktimis:
- Pasirinkti konkretų testų rinkinį arba vykdyti visus
- Pasirinkti naršyklę (Chrome, Firefox, Edge)
- Įjungti/išjungti headed režimą

## 📊 Testų Aprėptis

### Testų Rinkiniai

| Rinkinys | Failas | Testų | Aprėptis |
|----------|--------|-------|----------|
| Smoke Testai | `sweetshop.smoke.cy.js` | ~5 | Kritiniai keliai, navigacija, vaizdų įkėlimas |
| Autentifikacija | `sweetshop.login.cy.js` | ~5 | Prisijungimo procesai, validacija |
| Pagrindinis | `sweetshop.mainpage.cy.js` | ~7 | Navigacija, turinio rodymas |
| Katalogas | `sweetshop.catalog.cy.js` | ~8 | Produktų sąrašas, detalės, vaizdai |
| Krepšelis | `sweetshop.basket.cy.js` | ~10 | Formos validacija, įvesties tvarkymas |
| Atsiskaitymas | `sweetshop.buying.cy.js` | ~12 | Pilnas pirkimo procesas |

### Aprėpti Scenarijai

✅ Vartotojas gali peržiūrėti pagrindinį puslapį ir naršyti  
✅ Produktų katalogas rodomas teisingai  
✅ Produktai gali būti pridedami į krepšelį  
✅ Krepšelio kiekis atsinaujina tinkamai  
✅ Formos validacija veikia kaip tikėtasi  
✅ Atsiskaitymo forma tvarko tinkamus/netinkamus įvedimus  
✅ Navigacija tarp puslapių yra sklandži  
✅ Vaizdai įkeliami teisingai  
✅ Mobilūs ir darbalaukio peržiūros režimai  
✅ Suderinamumas su skirtingomis naršyklėmis  

## 🛠️ Pasirinktinės Komandos

Pasirinktinės Cypress komandos apibrėžtos `cypress/support/commands.js`:

### `cy.nav(href)`

Navigacija naudojant navigacijos nuorodas:

```javascript
cy.nav('/sweets');
cy.nav('/basket');
```

### `cy.addProduct(nameLike)`

Pridėti produktą į krepšelį pagal pavadinimą (nepriklausomai nuo registro):

```javascript
cy.addProduct('Chocolate Cups');
cy.addProduct(/Sherb(e)?rt Straws/);
```

### `cy.basketBadge()`

Gauti krepšelio ženkliuko elementą:

```javascript
cy.basketBadge().should('contain', '2');
```

### `cy.assertNoVisibleInvalidFeedback()`

Patikrinti, kad nėra matomų validacijos klaidų:

```javascript
cy.assertNoVisibleInvalidFeedback();
```

## ⚙️ Konfigūracija

### Cypress Konfigūracija (`cypress.config.js`)

```javascript
{
  baseUrl: 'https://sweetshop.netlify.app',
  viewportWidth: 1280,
  viewportHeight: 900,
  defaultCommandTimeout: 10000,
  video: false,
  retries: {
    runMode: 2,
    openMode: 0
  }
}
```

### Pagrindiniai Nustatymai

- **Bazinis URL**: Testai automatiškai naviguo į sweetshop.netlify.app
- **Peržiūros langas**: Darbalaukio rezoliucija (1280x900)
- **Laukimo laikas**: 10 sekundžių komandoms
- **Video**: Išjungta, kad sutaupytų vietos
- **Bandymai iš naujo**: 2 bandymai CI režime

## 🐛 Problemų Sprendimas

### Dažnos Problemos

#### Testai nepavyksta su klaida "Cannot read property 'id'"

Ši klaida tvarkoma globaliai `cypress/support/e2e.js` ir turėtų būti slopinama. Jei vis tiek pasirodo, išvalykite cache:

```bash
npm cache clean --force
rm -rf node_modules
npm install
```

#### Naršyklė nerasta

Įdiekite konkrečią naršyklę arba naudokite:

```bash
npx cypress run --browser electron
```

#### Laukimo laiko viršijimas

Padidinkite laukimo laiką `cypress.config.js`:

```javascript
defaultCommandTimeout: 15000
```

#### Nestabilūs testai

- Testuose įjungti 2 bandymai iš naujo CI režime
- Patikrinkite tinklo ryšį
- Patikrinkite programos prieinamumą

### Debug Režimas

Vykdyti su debug išvestimi:

```bash
DEBUG=cypress:* npm run cy:open
```

## 📝 Naujų Testų Rašymas

### Geriausi Patarimai

1. **Naudokite pasirinktines komandas** įprastoms operacijoms
2. **Išvalykite būseną** su `cy.clearCookies()` ir `cy.clearLocalStorage()` `beforeEach` bloke
3. **Naudokite aprašomus testų pavadinimus** lietuvių kalba pagal projekto konvenciją
4. **Tvarkykite dinaminį turinį** su tinkamais laukimais ir tvirtinimais
5. **Venkite fiksuotų laukimų** - naudokite Cypress įmontuotą pakartojimo logiką

### Testo Struktūros Pavyzdys

```javascript
describe('Sweetshop – Funkcijos pavadinimas', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('Turėtų atlikti numatomą veiksmą', () => {
    // Paruošimas
    cy.nav('/sweets');
    
    // Veiksmas
    cy.addProduct('Chocolate Cups');
    
    // Patikrinimas
    cy.basketBadge().should('contain', '1');
  });
});
```

## 📄 Testai

[Cypress Tests](https://github.com/eco-akram/Cypress-test/actions/workflows/cypress.yml)
[Manual Tests](https://github.com/eco-akram/Cypress-test/actions/workflows/manual-run.yml)
[PR Tests](https://github.com/eco-akram/Cypress-test/actions/workflows/pr-tests.yml)

---

**Sėkmingo Testavimo! 🍬**
