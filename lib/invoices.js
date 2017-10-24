var BPromise = require('bluebird');
var got = require('got');
var _ = require('lodash');

module.exports = function(zuoraClient) {
  function getInvoice(invoiceId) {
    return zuoraClient.authenticate().then(function(authCookie) {
      var url = zuoraClient.serverUrl + '/object/invoice/' + invoiceId;
      var query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie
        },
        json: true
      };
      return got.get(url, query).then(function(res) {
        return res.body;
      });
    });
  }

  function getInvoiceFromInvoiceNumber(invoiceNumber) {
    return zuoraClient
      .queryFirst("select Id from Invoice where InvoiceNumber='" + invoiceNumber + "'")
      .then(function(queryResult) {
        if (queryResult) {
          var invoiceId = queryResult.Id;
          return getInvoice(invoiceId);
        } else {
          return null;
        }
      });
  }

  function createInvoice(invoiceCreateRequest) {
    return zuoraClient.authenticate().then(function(authCookie) {
      var url = zuoraClient.serverUrl + '/object/invoice';
      var query = {
        body: invoiceCreateRequest,
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
          'zuora-version': '207.0'
        },
        json: true
      };
      return got.post(url, query).then(function(res) {
        return res.body;
      });
    });
  }

  function updateInvoice(invoiceId, invoiceUpdateRequest) {
    return zuoraClient.authenticate().then(function(authCookie) {
      var url = zuoraClient.serverUrl + '/object/invoice/' + invoiceId;
      var query = {
        body: invoiceUpdateRequest,
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
          'zuora-version': '207.0'
        },
        json: true
      };
      return got.put(url, query).then(function(res) {
        return res.body;
      });
    });
  }

  return {
    getFromInvoiceNumber: function(invoiceNumber) {
      return getInvoiceFromInvoiceNumber(invoiceNumber);
    },
    get: function(invoiceId) {
      return getInvoice(invoiceId);
    },
    create: function(invoiceCreateRequest) {
      return createinvoice(invoiceCreateRequest);
    },
    update: function(invoiceId, invoiceUpdateRequest) {
      return updateInvoice(invoiceId, invoiceUpdateRequest);
    }
  };
};
