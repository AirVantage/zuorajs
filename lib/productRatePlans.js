var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {

    return {
        get: function(productRatePlanId) {
            return zuoraClient.authenticate().then(function(authCookie) {
                var url = zuoraClient.serverUrl + "/object/product-rate-plan/" + productRatePlanId;
                var query = {
                    headers: {
                        "Content-type": "application/json",
                        "cookie": authCookie
                    },
                    json: true
                };
                return got.get(url, query)
                    .then(function(res) {
                        return res.body;
                    });
            });
        }
    };
};
