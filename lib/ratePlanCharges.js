module.exports = function(zuoraClient) {
  return {
    get: ratePlanChargeId => zuoraClient.getObject('/v1/object/rate-plan-charge/' + ratePlanChargeId)
  };
};
