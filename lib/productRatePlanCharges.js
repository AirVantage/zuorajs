const got = require('got');

module.exports = function(zuoraClient) {
  return {
    get: productRatePlanChargeId =>
      zuoraClient.getObject(`/v1/object/product-rate-plan-charge/${productRatePlanChargeId}`),
    create: productRatePlanCharge =>
      zuoraClient.authenticate().then(headers => {
        const url = `${zuoraClient.serverUrl}/v1/object/product-rate-plan-charge/`;
        const query = {
          body: productRatePlanCharge,
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body);
      }),
    update: (productRatePlanChargeId, productRatePlanCharge) =>
      zuoraClient.authenticate().then(headers => {
        const url = `${zuoraClient.serverUrl}/v1/object/product-rate-plan-charge/${productRatePlanChargeId}`;
        const query = {
          body: productRatePlanCharge,
          headers,
          json: true
        };
        return got.put(url, query).then(res => res.body);
      }),
    delete: productRatePlanChargeId =>
      zuoraClient.authenticate().then(headers => {
        const url = `${zuoraClient.serverUrl}/v1/object/product-rate-plan-charge/${productRatePlanChargeId}`;
        const query = {
          headers,
          json: true
        };
        return got.delete(url, query).then(res => res.body);
      })
  };
};
