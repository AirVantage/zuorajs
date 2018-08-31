module.exports = function(zuoraClient) {
  return {
    get: productRatePlanChargeId =>
      zuoraClient.getObject('/v1/object/product-rate-plan-charge/' + productRatePlanChargeId)
  };
};
