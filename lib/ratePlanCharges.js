module.exports = function(zuoraClient) {
  return {
    get: ratePlanChargeId => zuoraClient.getObject('/object/rate-plan-charge/' + ratePlanChargeId)
  };
};
