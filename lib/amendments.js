const got = require('got');

module.exports = zuoraClient => ({
  getBySubscriptionId: subscriptionId =>
    zuoraClient.authenticate().then(headers => {
      const url = `${zuoraClient.serverUrl}/v1/amendments/subscriptions/${subscriptionId}`;
      const query = {
        headers,
        json: true
      };
      return got.get(url, query).then(res => res.body);
    }),

  delete: id =>
    zuoraClient.authenticate().then(headers => {
      const url = `${zuoraClient.serverUrl}/v1/object/amendment/${id}`;
      const query = {
        headers,
        json: true
      };
      return got.delete(url, query).then(res => res.body);
    })
});
