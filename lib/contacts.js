var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {


    function getContact(id) {
        return zuoraClient.authenticate().then(authCookie => {
            var url = zuoraClient.serverUrl + "/object/contact/" + id;
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
        get: contactId => {
            return getContact(contactId);
        }
    };
};
