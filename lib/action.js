var got = require('got');
var _ = require('lodash');

module.exports = zuoraClient => {
  return {
    query: queryString => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/action/query';
        var data = {
          queryString: queryString
        };
        var query = {
          body: data,
          headers,
          json: true
        };
        return got
          .post(url, query)
          .then(res => res.body)
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
    queryMore: queryLocator => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/action/queryMore';
        var query = {
          body: { queryLocator },
          headers,
          json: true
        };
        return got
          .post(url, query)
          .then(res => res.body)
          .catch(error => {
            if (error.statusCode === 401) {
              console.log(error.response.body);
              return this(queryLocator);
            } else {
              throw error;
            }
          });
      });
    }
  };
};
