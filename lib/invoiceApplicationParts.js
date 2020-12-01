const got = require('got');

module.exports = (zuoraClient) => ({
  get: (invoiceId) =>
    zuoraClient.authenticate().then((headers) =>
      got
        .get(`${zuoraClient.serverUrl}/v1/invoices/${invoiceId}/application-parts`, {
          headers,
          json: true,
        })
        .then(({ body }) => body)
    ),
});
