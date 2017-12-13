var got = require('got');

module.exports = zuoraClient => {
  return {
    createBillRun: data => {
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
    getBillRun: billRunId => {
      return zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/object/bill-run/' + billRunId;
        var query = {
          headers,
          json: true
        };
        return got.get(url, query).then(res => res.body);
      });
    },
    postBillRun: billRunId => {
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
    cancelBillRun: billRunId => {
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
    deleteBillRun: billRunId => {
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
