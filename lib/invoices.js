const got = require('got');
const _ = require('lodash');

module.exports = (zuoraClient) => {
  function getInvoice(invoiceId) {
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.apiVersionUrl}/object/invoice/${invoiceId}`;
      const query = {
        headers,
        json: true,
      };
      return got.get(url, query).then((res) => res.body);
    });
  }

  function getInvoiceFromInvoiceNumber(invoiceNumber) {
    return zuoraClient
      .queryFirst(`select Id from Invoice where InvoiceNumber='${invoiceNumber}'`)
      .then((queryResult) => (queryResult ? getInvoice(queryResult.Id) : null));
  }

  function createInvoice(invoiceCreateRequest) {
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.apiVersionUrl}/object/invoice`;
      const query = {
        body: invoiceCreateRequest,
        headers: _.assignIn({ 'zuora-version': '215.0' }, headers),
        json: true,
      };
      return got.post(url, query).then((res) => res.body);
    });
  }

  function updateInvoice(invoiceId, invoiceUpdateRequest) {
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.apiVersionUrl}/object/invoice/${invoiceId}`;
      const query = {
        body: invoiceUpdateRequest,
        headers: _.assignIn({ 'zuora-version': '215.0' }, headers),
        json: true,
      };
      return got.put(url, query).then((res) => res.body);
    });
  }

  function getByAccount(accountId) {
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.apiVersionUrl}/transactions/invoices/accounts/${accountId}`;
      const query = {
        headers,
        json: true,
      };
      return got.get(url, query).then((res) => res.body);
    });
  }

  return {
    getFromInvoiceNumber: (invoiceNumber) => getInvoiceFromInvoiceNumber(invoiceNumber),
    getByAccount: (accountId) => getByAccount(accountId),
    get: (invoiceId) => getInvoice(invoiceId),
    create: (invoiceCreateRequest) => createInvoice(invoiceCreateRequest),
    update: (invoiceId, invoiceUpdateRequest) => updateInvoice(invoiceId, invoiceUpdateRequest),
  };
};
