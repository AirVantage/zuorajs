module.exports = function(zuoraClient) {
  return {
    get: productRatePlanId => zuoraClient.getObject('/v1/object/product-rate-plan/' + productRatePlanId)
  };
};
