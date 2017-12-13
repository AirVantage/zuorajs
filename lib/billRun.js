var got = require('got');

module.exports = zuoraClient => {
  return {
    create: data => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/object/bill-run';
        var query = {
          body: data,
          headers,
          json: true
        };
        return got.post(url, query).then(res => res.body);
      });
    },
    get: billRunId => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/object/bill-run/' + billRunId;
        var query = {
          headers,
          json: true
        };
        return got.get(url, query).then(res => res.body);
      });
    },
    post: billRunId => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/object/bill-run/' + billRunId;
        var query = {
          body: {Status: "Posted"},
          headers,
          json: true
        };
        return got.put(url, query).then(res => res.body);
      });
    },
    cancel: billRunId => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/object/bill-run/' + billRunId;
        var query = {
          body: {Status: "Canceled"},
          headers,
          json: true
        };
        return got.put(url, query).then(res => res.body);
      });
    },
    delete: billRunId => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/object/bill-run/' + billRunId;
        var query = {
          headers,
          json: true
        };
        return got.delete(url, query).then(res => res.body);
      });
    }
  }
};
