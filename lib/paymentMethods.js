var got = require('got');

module.exports = zuoraClient => ({
  get: accountUid =>
    zuoraClient.authenticate().then(headers =>
      got
        .get(`${zuoraClient.serverUrl}/payment-methods/credit-cards/accounts/${encodeURIComponent(accountUid)}`, {
          headers,
          json: true
        })
        .then(({ body }) => body)
    )
});
