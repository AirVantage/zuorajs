module.exports = (zuoraClient) => ({
  get: (productRatePlanId) => zuoraClient.getObject(`/object/product-rate-plan/${productRatePlanId}`),
});
