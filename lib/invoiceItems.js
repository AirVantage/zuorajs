const got = require('got');

module.exports = function(zuoraClient) {
  function getInvoiceItem(invoiceItemId) {
    return zuoraClient.authenticate().then(headers => {
      const url = zuoraClient.serverUrl + '/v1/object/invoice-item/' + invoiceItemId;
      const query = {
        headers,
        json: true
      };
      return got.get(url, query).then(function(res) {
        return res.body;
      });
    });
  }

  function getInvoiceItemsFromInvoice(invoiceId) {
    return zuoraClient
      .queryFull(
        "select AccountingCode,AppliedToInvoiceItemId,ChargeAmount,ChargeDate,ChargeName,ChargeDescription,Id,InvoiceId,ProcessingType,ProductDescription,ProductName,Quantity,RatePlanChargeId,RevRecStartDate,SKU,ServiceEndDate,ServiceStartDate,SubscriptionId,TaxAmount,TaxCode,TaxExemptAmount,TaxMode,UOM,UnitPrice from InvoiceItem where InvoiceId='" +
          invoiceId +
          "'"
      )
      .then(queryResult => {
        return queryResult;
        /*var items = [];
                return BPromise.each(queryResult, result => {
                    return getInvoiceItem(result.Id).then(invoiceItem => {
                        if (invoiceItem) {
                            items.push(invoiceItem);
                        }
                    });
                }).then(() => {
                    return items;
                });*/
      });
  }

  return {
    get: invoiceItemId => getInvoiceItem(invoiceItemId),
    fromInvoice: invoiceId => getInvoiceItemsFromInvoice(invoiceId)
  };
};
