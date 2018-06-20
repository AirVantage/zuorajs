module.exports = (zuoraClient) => ({
  get: (ratePlanChargeId) => zuoraClient.getObject(`/object/rate-plan-charge/${ratePlanChargeId}`),
});
