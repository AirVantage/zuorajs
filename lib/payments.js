const got = require('got');
const _ = require('lodash');

module.exports = function(zuoraClient) {
  function getInvoice(invoiceId) {
    return zuoraClient.authenticate().then(headers => {
      var url = zuoraClient.serverUrl + '/object/invoice/' + invoiceId;
      var query = {
        headers,
        json: true
      };
      return got.get(url, query).then(res => res.body);
    });
  }

  function getInvoiceFromInvoiceNumber(invoiceNumber) {
    return zuoraClient
      .queryFirst("select Id from Invoice where InvoiceNumber='" + invoiceNumber + "'")
      .then(queryResult => (queryResult ? getInvoice(queryResult.Id) : null));
  }

  function createInvoice(invoiceCreateRequest) {
    return zuoraClient.authenticate().then(headers => {
      var url = zuoraClient.serverUrl + '/object/invoice';
      var query = {
        body: invoiceCreateRequest,
        headers: _.assignIn(
          {
            'zuora-version': '207.0'
          },
          headers
        ),
        json: true
      };
      return got.post(url, query).then(res => res.body);
    });
  }

  function updateInvoice(invoiceId, invoiceUpdateRequest) {
    return zuoraClient.authenticate().then(headers => {
      var url = zuoraClient.serverUrl + '/object/invoice/' + invoiceId;
      var query = {
        body: invoiceUpdateRequest,
        headers: _.assignIn(
          {
            'zuora-version': '207.0'
          },
          headers
        ),
        json: true
      };
      return got.put(url, query).then(res => res.body);
    });
  }

  return {
    getFromInvoiceNumber: invoiceNumber => getInvoiceFromInvoiceNumber(invoiceNumber),
    get: invoiceId => getInvoice(invoiceId),
    create: invoiceCreateRequest => createInvoice(invoiceCreateRequest),
    update: (invoiceId, invoiceUpdateRequest) => updateInvoice(invoiceId, invoiceUpdateRequest)
  };
};
