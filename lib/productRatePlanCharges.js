var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {

    return {
        get: function(productRatePlanChargeId) {
            return zuoraClient.getObject("/object/product-rate-plan-charge/" + productRatePlanChargeId);
        }
    };
};
