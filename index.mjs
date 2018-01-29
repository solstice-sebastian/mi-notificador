import Coinigy from 'node-coinigy';
import { apiKey, apiSecret } from './private/keys.mjs';

const coinigy = new Coinigy(apiKey, apiSecret);

coinigy.activity()
  .then(function(body) {
      console.log(body.data);
      console.log(body.notifications);
  })
  .catch(function(err) {
      console.log(err);
  });

