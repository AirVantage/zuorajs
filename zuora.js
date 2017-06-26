const BPromise = require("bluebird");
const got = require("got");
const _ = require("lodash");
const actionLib = require("./lib/action.js");
const subscriptionsLib = require("./lib/subscriptions.js");
const productRatePlansLib = require("./lib/productRatePlans.js");

function Zuora(config) {
    this.serverUrl = config.url;
    this.apiAccessKeyId = config.apiAccessKeyId;
    this.apiSecretAccessKey = config.apiSecretAccessKey;
    this.entityId = config.entityId;
    this.entityName = config.entityName;

    this.action = actionLib(this);
    this.subscriptions = subscriptionsLib(this);
    this.productRatePlans = productRatePlansLib(this);
}
module.exports = Zuora;

Zuora.prototype.authenticate = function() {
    if (this.authCookie === undefined) {
        var self = this;
        var url = this.serverUrl + "/connections";
        var query = {
            headers: {
                "user-agent": "zuorajs",
                "Content-type": "application/json",
                "apiAccessKeyId": this.apiAccessKeyId,
                "apiSecretAccessKey": this.apiSecretAccessKey
            },
            json: true
        };
        console.log("Auth request");
        return got.post(url, query)
            .then(function(res) {
                self.authCookie = res.headers["set-cookie"][0];
                return self.authCookie;
            });
    } else {
        return BPromise.resolve(this.authCookie);
    }
};
