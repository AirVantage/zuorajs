var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {

    function getTaxationItem(taxationItemId) {
        return zuoraClient.authenticate().then(authCookie => {
            var url = zuoraClient.serverUrl + "/object/taxation-item/" + taxationItemId;
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

    function getTaxationItemsForInvoiceItem(invoiceItemId) {
        return zuoraClient.authenticate().then(authCookie => {
            return zuoraClient.action.fullQuery("select AccountingCode,ExemptAmount,Id,InvoiceId,InvoiceItemId,Jurisdiction,LocationCode,Name,TaxAmount,TaxCode,TaxCodeDescription,TaxDate,TaxRate,TaxRateDescription,TaxRateType from TaxationItem where InvoiceItemId='" + invoiceItemId + "'").then(queryResult => {
                return queryResult;
            });
        });
    }

    function getTaxationItemsFromInvoice(invoiceId) {
        return zuoraClient.authenticate().then(authCookie => {
            return zuoraClient.action.fullQuery("select AccountingCode,ExemptAmount,Id,InvoiceId,InvoiceItemId,Jurisdiction,LocationCode,Name,TaxAmount,TaxCode,TaxCodeDescription,TaxDate,TaxRate,TaxRateDescription,TaxRateType from TaxationItem where InvoiceId='" + invoiceId + "'").then(queryResult => {
                return queryResult;
            });
        });
    }

    return {
        get: (taxationItemId) => {
            return getTaxationItem(taxationItemId);
        },
        forInvoiceItem: (invoiceItemId) => {
            return getTaxationItemsForInvoiceItem(invoiceItemId);
        },
        fromInvoice: (invoiceId) => {
            return getTaxationItemsFromInvoice(invoiceId);
        }
    };
};
