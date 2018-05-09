const got = require('got');
const _ = require('lodash');

module.exports = (zuoraClient) => ({
  create: (newPaymentParams) => zuoraClient.authenticate().then((headers) => got
    .post(`${zuoraClient.apiVersionUrl}/object/payment`, {
      body: newPaymentParams,
      headers,
      json: true,
    })
    .then(({ body }) => body)),
});
