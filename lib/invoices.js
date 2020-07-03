const got = require('got');
const _ = require('lodash');

module.exports = function(zuoraClient) {
  function getInvoice(invoiceId, params) {
    return zuoraClient.authenticate().then((headers) => {
      const url = zuoraClient.serverUrl + '/v1/object/invoice/' + invoiceId;
      const query = {
        headers,
        json: true,
        query: params,
      };
      return got.get(url, query).then((res) => res.body);
    });
  }

  function getInvoiceFromInvoiceNumber(invoiceNumber) {
    return zuoraClient
      .queryFirst("select Id from Invoice where InvoiceNumber='" + invoiceNumber + "'")
      .then((queryResult) => (queryResult ? getInvoice(queryResult.Id) : null));
  }

  function createInvoice(invoiceCreateRequest) {
    return zuoraClient.authenticate().then((headers) => {
      const url = zuoraClient.serverUrl + '/v1/object/invoice';
      const query = {
        body: invoiceCreateRequest,
        headers: _.assignIn({ 'zuora-version': '207.0' }, headers),
        json: true,
      };
      return got.post(url, query).then((res) => res.body);
    });
  }

  function updateInvoice(invoiceId, invoiceUpdateRequest) {
    return zuoraClient.authenticate().then((headers) => {
      const url = zuoraClient.serverUrl + '/v1/object/invoice/' + invoiceId;
      const query = {
        body: invoiceUpdateRequest,
        headers: _.assignIn({ 'zuora-version': '207.0' }, headers),
        json: true,
      };
      return got.put(url, query).then((res) => res.body);
    });
  }

  function getByAccount(accountId) {
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.serverUrl}/v1/transactions/invoices/accounts/${accountId}`;
      const query = {
        headers,
        json: true,
      };
      return got.get(url, query).then((res) => res.body);
    });
  }

  const getInvoiceFiles = async (invoiceId) => {
    const headers = await zuoraClient.authenticate();
    const url = `${zuoraClient.serverUrl}/v1/invoices/${invoiceId}/files`;
    return (await got.get(url, { headers, json: true })).body;
  };

  return {
    getFromInvoiceNumber: getInvoiceFromInvoiceNumber,
    getByAccount,
    get: getInvoice,
    create: createInvoice,
    update: updateInvoice,
    getInvoiceFiles,
  };
};
