var got = require('got');

module.exports = zuoraClient => {
  return {
    subscribe: subscribeData => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/action/subscribe';
        var query = {
          body: subscribeData,
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body).catch(error => {
          if (error.statusCode === 401) {
            return this(error.response.body);
          } else {
            throw error;
          }
        });
      });
    },
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
        return got.post(url, query).then(res => res.body).catch(error => {
          if (error.statusCode === 401) {
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
          body: {
            queryLocator
          },
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body).catch(error => {
          if (error.statusCode === 401) {
            return this(queryLocator);
          } else {
            throw error;
          }
        });
      });
    },
    delete: (type, ids) => {
      return zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/action/delete';
        const query = {
          body: {
            type,
            ids
          },
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body);
      });
    },
    update: (type, objects) => {
      return zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/action/update';
        const query = {
          body: {
            type,
            objects
          },
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body);
      });
    }
  };
};
