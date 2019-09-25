var got = require('got');

module.exports = zuoraClient => {
  return {
    subscribe: subscribeData => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/v1/action/subscribe';
        var query = {
          body: subscribeData,
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body);
      });
    },
    query: queryString => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/v1/action/query';
        var data = {
          queryString: queryString
        };
        var query = {
          body: data,
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body);
      });
    },
    queryMore: queryLocator => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/v1/action/queryMore';
        var query = {
          body: {
            queryLocator
          },
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body);
      });
    },
    delete: (type, ids) => {
      return zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/v1/action/delete';
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
        const url = zuoraClient.serverUrl + '/v1/action/update';
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
