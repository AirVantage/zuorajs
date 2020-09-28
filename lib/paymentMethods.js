const got = require('got');

module.exports = (zuoraClient) => ({
  getPaymentMethod: (paymentMethodUid) =>
    zuoraClient
      .authenticate()
      .then((headers) =>
        got.get(`${zuoraClient.serverUrl}/v1/object/payment-method/${paymentMethodUid}`, { headers, json: true })
      )
      .then(({ body }) => body),
  get: (accountUid) =>
    zuoraClient.authenticate().then((headers) =>
      got
        .get(`${zuoraClient.serverUrl}/v1/payment-methods/credit-cards/accounts/${encodeURIComponent(accountUid)}`, {
          headers,
          json: true,
        })
        .then(({ body }) => body)
    ),
  delete: (methodId) =>
    zuoraClient.authenticate().then((headers) =>
      got
        .delete(`${zuoraClient.serverUrl}/v1/payment-methods/${encodeURIComponent(methodId)}`, {
          headers,
          json: true,
        })
        .then(({ body }) => body)
    ),
  update: (methodId, body) =>
    zuoraClient.authenticate().then((headers) =>
      got
        .put(`${zuoraClient.serverUrl}/v1/payment-methods/credit-cards/${encodeURIComponent(methodId)}`, {
          headers,
          json: true,
          body,
        })
        .then(({ body }) => body)
    ),
  deleteCRUD: (methodId) =>
    zuoraClient.authenticate().then((headers) =>
      got
        .delete(`${zuoraClient.serverUrl}/v1/object/payment-method/${encodeURIComponent(methodId)}`, {
          headers,
          json: true,
        })
        .then(({ body }) => body)
    ),
});
