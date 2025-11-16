Cypress.on('uncaught:exception', (err) => {
	const msg = err && err.message ? err.message : '';
	if (
		msg.includes('Cannot set properties of undefined') ||
		msg.includes("Cannot read properties of null") ||
		msg.includes("Cannot read property 'id'")
	) {
		return false;
	}
});

import './commands';