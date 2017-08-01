var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {


    function getRatePlanCharge(id) {
        return zuoraClient.authenticate().then(authCookie => {
            var url = zuoraClient.serverUrl + "/object/rate-plan-charge/" + id;
            var query = {
                headers: {
                    "Content-type": "application/json",
                    "cookie": authCookie
                },
                json: true
            };
            return got.get(url, query)
                .then(res => {
                    return res.body;
                });
        });
    }

    return {
        get: ratePlanChargeId => {
            return getRatePlanCharge(ratePlanChargeId);
        }
    };
};
