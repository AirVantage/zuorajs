var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {
    return {
        query: function(queryString) {
            return zuoraClient.authenticate().then(function(authCookie) {
                var url = zuoraClient.serverUrl + "/action/query";
                var data = {
                    queryString: queryString
                };
                var query = {
                    body: JSON.stringify(data),
                    headers: {
                        "Content-type": "application/json",
                        "cookie": authCookie
                    },
                    json: true
                };
                return got.post(url, query)
                    .then(function(res) {
                        return res.body;
                    })
                    .catch(error => {
                        if (error.statusCode === 401) {
                            console.log(error.response.body);
                            return this(queryString);
                        } else {
                            throw error;
                        }
                    })
            });;
        }
    };
};
