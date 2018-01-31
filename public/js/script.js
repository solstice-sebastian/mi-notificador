const getAlertsButton = document.getElementById('get-alerts');
const logAlerts = async () => {
  // getAlerts({ headers }).then((response) => console.log(response));
  console.log('logging...');
  fetch('test')
    .then((response) => {
      console.log('response', response);
      return response.text();
    })
    .then((text) => console.log(`text:`, text));
};

getAlertsButton.addEventListener('click', logAlerts);
