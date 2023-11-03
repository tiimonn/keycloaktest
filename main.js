import './style.css'
import javascriptLogo from '/javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { setupLogout } from './logout'

import Keycloak from 'keycloak-js';

// Render the initial content of #app immediately
document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello <span id="user-name-placeholder">World</span>!</h1>

    <div class="card">
      <button id="counter" type="button"></button>
      <button id="logout" type="button">Logout</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector('#counter'));
setupLogout(document.querySelector('#logout'));


let name = "World";

export const keycloak = new Keycloak({
  url: `https://${import.meta.env.VITE_AUTH_URL}`,
  realm: import.meta.env.VITE_AUTH_REALM,
  clientId: import.meta.env.VITE_AUTH_CLIENT,
});

keycloak.init({
  onLoad: 'check-sso',
  redirectUri: 'http://localhost:5173',
  checkLoginIframe: false,
  enableLogging: true,

}).then(authenticated => {
  console.log(authenticated ? 'authenticated' : 'not authenticated');
  if (authenticated) {
    (async function () {
      try {
        const profile = await keycloak.loadUserProfile();
        document.getElementById('user-name-placeholder').textContent = profile.firstName;
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    })();
  }
}).catch(err => {
  console.error(err);
});

