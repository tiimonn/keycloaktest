import { keycloak } from './main.js';

export function setupLogout(element) {
	let html = `<button id="logout" type="button">Logout</button>`

	let counter = 0
	element.addEventListener('click', () => keycloak.logout()
		.then(() => {
			console.log('logged out')
			setCounter(counter + 1)
		})
		.catch((error) => {
			console.error('failed to log out', error)
			setCounter(counter + 1)
		})
	)
}



