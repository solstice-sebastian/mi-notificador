import headers from './private/keys.js';
import getAlerts from './modules/getAlerts.js';

if (window === undefined || window.document === undefined) {
  throw new Error('MiNotificador currently only works in browsers');
}

if (/^http:\/\/localhost/.test(window.location.origin) === true) {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'private/keys.js';
  document.head.appendChild(script);
}

const getAlertsButton = document.getElementById('get-alerts');
const logAlerts = async () => {
  getAlerts({ headers }).then((response) => console.log(response));
  // console.log(`alerts:`, alerts);
};

getAlertsButton.addEventListener('click', logAlerts);
