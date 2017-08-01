var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = (zuoraClient) => {

    function queryMore(queryLocator) {
        return zuoraClient.authenticate().then((authCookie) => {
                var url = zuoraClient.serverUrl + "/action/queryMore";
                var data = {
                    queryString: queryString
                };
                var query = {
                    body: {
                        queryLocator: queryLocator
                    },
                    headers: {
                        "Content-type": "application/json",
                        "cookie": authCookie
                    },
                    json: true
                };
                return got.post(url, query)
                    .then((res) => {
                        var records = res.body.records;
                        if (res.body.done){
                            return records;
                        } else {
                            return queryMore(res.body.queryLocator).then((additionalRecords) => {
                                return _.concat(records, additionalRecords);
                            });
                        }
                    })
                    .catch(error => {
                        if (error.statusCode === 401) {
                            console.log(error.response.body);
                            return this(queryString);
                        } else {
                            throw error;
                        }
                    });
        });
    }

    return {
        query: (queryString) => {
            return zuoraClient.authenticate().then((authCookie) => {
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
                    .then((res) => {
                        return res.body.records;
                    })
                    .catch(error => {
                        if (error.statusCode === 401) {
                            console.log(error.response.body);
                            return this(queryString);
                        } else {
                            throw error;
                        }
                    });
            });
        },
        fullQuery: (queryString) => {
            return zuoraClient.authenticate().then((authCookie) => {
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
                    .then((res) => {
                        var records = res.body.records;
                        if (res.body.done){
                            return records;
                        } else {
                            return queryMore(res.body.queryLocator).then((additionalRecords) => {
                                return _.concat(records, additionalRecords);
                            });
                        }
                    })
                    .catch(error => {
                        if (error.statusCode === 401) {
                            console.log(error.response.body);
                            return this(queryString);
                        } else {
                            throw error;
                        }
                    });
            });;
        }
    };
};
