module.exports = function(zuoraClient) {
  return {
    get: productRatePlanId => zuoraClient.getObject('/object/product-rate-plan/' + productRatePlanId)
  };
};
