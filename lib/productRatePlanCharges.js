module.exports = function(zuoraClient) {
  return {
    get: productRatePlanChargeId => zuoraClient.getObject('/object/product-rate-plan-charge/' + productRatePlanChargeId)
  };
};
