const got = require('got');
const _ = require('lodash');

module.exports = (zuoraClient) => ({
  create: (newPaymentParams) => zuoraClient.authenticate().then((headers) => got
    .post(`${zuoraClient.serverUrl}/object/payment`, {
      body: newPaymentParams,
      headers,
      json: true,
    })
    .then(({ body }) => body)),
});
