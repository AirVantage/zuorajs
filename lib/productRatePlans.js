var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {

    return {
        get: function(productRatePlanId) {
            return zuoraClient.getObject("/object/product-rate-plan/" + productRatePlanId);
        }
    };
};
