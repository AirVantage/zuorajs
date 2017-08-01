const BPromise = require("bluebird");
const got = require("got");
const _ = require("lodash");
const actionLib = require("./lib/action.js");
const subscriptionsLib = require("./lib/subscriptions.js");
const invoicesLib = require("./lib/invoices.js");
const invoiceItemsLib = require("./lib/invoiceItems.js");
const accountsLib = require("./lib/accounts.js");
const contactsLib = require("./lib/contacts.js");
const ratePlanChargesLib = require("./lib/ratePlanCharges.js");
const taxationItemsLib = require("./lib/taxationItems.js");
const productRatePlansLib = require("./lib/productRatePlans.js");

function Zuora(config) {
    this.serverUrl = config.url;
    this.apiAccessKeyId = config.apiAccessKeyId;
    this.apiSecretAccessKey = config.apiSecretAccessKey;
    this.entityId = config.entityId;
    this.entityName = config.entityName;

    this.accounts = accountsLib(this);
    this.action = actionLib(this);
    this.contacts = contactsLib(this);
    this.subscriptions = subscriptionsLib(this);
    this.invoices = invoicesLib(this);
    this.invoiceItems = invoiceItemsLib(this);
    this.ratePlanCharges = ratePlanChargesLib(this);
    this.taxationItems = taxationItemsLib(this);
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
        return got.post(url, query)
            .then(res => {
                self.authCookie = res.headers["set-cookie"][0];
                return self.authCookie;
            });
    } else {
        return BPromise.resolve(this.authCookie);
    }
};
