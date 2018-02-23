// const fs = require('fs');
// const fetch = require('node-fetch');

const socketCluster = require('socketcluster-client');
const Config = require('./private/config.js');

const { apiKey, apiSecret } = Config();

const options = {
  hostname: 'sc-02.coinigy.com',
  port: '443',
  secure: 'true',
};

const api_credentials = { apiKey, apiSecret };

const SCsocket = socketCluster.connect(options);

SCsocket.on('connect', (status) => {
  console.log(status);

  SCsocket.on('error', (err) => {
    console.log(err);
  });

  SCsocket.emit('auth', api_credentials, (err, token) => {
    if (!err && token) {
      // const scChannel = SCsocket.subscribe('TRADE-GDAX--BTC--USD');
      // console.log(scChannel);
      // scChannel.watch((data) => {
      //   console.log(data);
      // });

      SCsocket.emit('exchanges', null, (eerr, data) => {
        if (!eerr) {
          console.log(data);
        } else {
          console.log(eerr);
        }
      });

      SCsocket.emit('channels', 'GDAX', (cerr, data) => {
        if (!cerr) {
          console.log(data);
        } else {
          console.log(cerr);
        }
      });
    } else {
      console.log(err);
    }
  });
});
