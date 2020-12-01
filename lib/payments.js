const got = require('got');

module.exports = (zuoraClient) => ({
  create: (newPaymentParams) =>
    zuoraClient.authenticate().then((headers) =>
      got
        .post(`${zuoraClient.serverUrl}/v1/object/payment`, {
          body: newPaymentParams,
          headers,
          json: true,
        })
        .then(({ body }) => body)
    ),
  get: (paymentId) =>
    zuoraClient.authenticate().then((headers) =>
      got
        .get(`${zuoraClient.serverUrl}/v1/object/payment/${paymentId}`, {
          headers,
          json: true,
        })
        .then(({ body }) => body)
    ),
  update: (paymentId, paymentParams) =>
    zuoraClient.authenticate().then((headers) =>
      got
        .put(`${zuoraClient.serverUrl}/v1/object/payment/${paymentId}`, {
          body: paymentParams,
          headers,
          json: true,
        })
        .then(({ body }) => body)
    ),

  delete: (paymentId) =>
    zuoraClient.authenticate().then((headers) =>
      got
        .delete(`${zuoraClient.serverUrl}/v1/object/payment/${paymentId}`, {
          headers,
          json: true,
        })
        .then(({ body }) => body)
    ),
});
