const got = require('got');

module.exports = (zuoraClient) => {
  function getTaxationItem(taxationItemId) {
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.serverUrl}/object/taxation-item/${taxationItemId}`;
      const query = {
        headers,
        json: true,
      };
      return got.get(url, query).then((res) => res.body);
    });
  }

  function getTaxationItemsForInvoiceItem(invoiceItemId) {
    return zuoraClient.queryFull(`select AccountingCode,ExemptAmount,Id,InvoiceId,InvoiceItemId,Jurisdiction,LocationCode,Name,TaxAmount,TaxCode,TaxCodeDescription,TaxDate,TaxRate,TaxRateDescription,TaxRateType from TaxationItem where InvoiceItemId='${
      invoiceItemId
    }'`);
  }

  function getTaxationItemsFromInvoice(invoiceId) {
    return zuoraClient.queryFull(`select AccountingCode,ExemptAmount,Id,InvoiceId,InvoiceItemId,Jurisdiction,LocationCode,Name,TaxAmount,TaxCode,TaxCodeDescription,TaxDate,TaxRate,TaxRateDescription,TaxRateType from TaxationItem where InvoiceId='${
      invoiceId
    }'`);
  }

  return {
    get: (taxationItemId) => getTaxationItem(taxationItemId),
    forInvoiceItem: (invoiceItemId) => getTaxationItemsForInvoiceItem(invoiceItemId),
    fromInvoice: (invoiceId) => getTaxationItemsFromInvoice(invoiceId),
  };
};
