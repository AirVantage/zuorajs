var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {


    function getAccount(invoiceId) {
        return zuoraClient.authenticate().then(authCookie => {
            var url = zuoraClient.serverUrl + "/object/account/" + invoiceId;
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

    function getAccountFromAccountNumber(accountNumber) {
        return zuoraClient.authenticate().then(authCookie => {
            return zuoraClient.action.query("select Id from Account where AccountNumber='" + accountNumber + "'").then((queryResult) => {
                if (queryResult[0]) {
                    var accountId = queryResult[0].Id;
                    return getAccount(accountId);
                } else {
                    return null;
                }
            });
        });
    }

    return {
        getFromAccountNumber: accountNumber => {
            return getAccountFromAccountNumber(accountNumber);
        },
        get: accountId => {
            return getAccount(accountId);
        }
    };
};
