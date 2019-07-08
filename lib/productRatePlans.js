const got = require('got');

module.exports = function(zuoraClient) {
  return {
    create: async productRatePlan => {
      const headers = await zuoraClient.authenticate();
      const url = `${zuoraClient.serverUrl}/v1/object/product-rate-plan`;
      const query = {
        body: productRatePlan,
        headers,
        json: true
      };
      return got.post(url, query).then(res => res.body);
    },
    update: async (id, productRatePlan) => {
      const headers = await zuoraClient.authenticate();
      const url = `${zuoraClient.serverUrl}/v1/object/product-rate-plan/${id}`;
      const query = {
        body: productRatePlan,
        headers,
        json: true,
        resolveBodyOnly: true
      };
      return got.put(url, query).then(res => res.body);
    },
    get: productRatePlanId => zuoraClient.getObject('/v1/object/product-rate-plan/' + productRatePlanId)
  };
};
