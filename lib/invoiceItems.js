var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {


    function getInvoiceItem(invoiceItemId) {
        return zuoraClient.authenticate().then(authCookie => {
            var url = zuoraClient.serverUrl + "/object/invoice-item/" + invoiceItemId;
            var query = {
                headers: {
                    "Content-type": "application/json",
                    "cookie": authCookie
                },
                json: true
            };
            return got.get(url, query)
                .then(function(res) {
                    return res.body;
                });
        });
    }

    function getInvoiceItemsFromInvoice(invoiceId) {
        return zuoraClient.authenticate().then(authCookie => {
            return zuoraClient.action.fullQuery("select AccountingCode,AppliedToInvoiceItemId,ChargeAmount,ChargeDate,ChargeName,Id,InvoiceId,ProcessingType,ProductDescription,ProductName,Quantity,RatePlanChargeId,RevRecStartDate,SKU,ServiceEndDate,ServiceStartDate,SubscriptionId,TaxAmount,TaxCode,TaxExemptAmount,TaxMode,UOM,UnitPrice from InvoiceItem where InvoiceId='" + invoiceId + "'").then(queryResult => {
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
        });
    }

    return {
        get: (invoiceItemId) => {
            return getInvoiceItem(invoiceItemId);
        },
        fromInvoice: (invoiceId) => {
            return getInvoiceItemsFromInvoice(invoiceId);
        }
    };
};
