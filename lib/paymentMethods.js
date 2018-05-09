const got = require('got');

module.exports = (zuoraClient) => ({
  get: (accountUid) => zuoraClient.authenticate().then((headers) => got
    .get(`${zuoraClient.apiVersionUrl}/payment-methods/credit-cards/accounts/${encodeURIComponent(accountUid)}`, {
      headers,
      json: true,
    })
    .then(({ body }) => body)),

  delete: (methodId) => zuoraClient.authenticate().then((headers) => got
    .delete(`${zuoraClient.apiVersionUrl}/payment-methods/${encodeURIComponent(methodId)}`, {
      headers,
      json: true,
    })
    .then(({ body }) => body)),

  update: (methodId, body) => zuoraClient.authenticate().then((headers) => got
    .put(`${zuoraClient.apiVersionUrl}/payment-methods/credit-cards/${encodeURIComponent(methodId)}`, {
      headers,
      json: true,
      body,
    })
    .then(({ body }) => body)),
});
