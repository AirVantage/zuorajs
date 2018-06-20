module.exports = (zuoraClient) => ({
  get: (productRatePlanChargeId) => zuoraClient.getObject(`/object/product-rate-plan-charge/${productRatePlanChargeId}`),
});
