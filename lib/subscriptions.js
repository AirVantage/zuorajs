var BPromise = require("bluebird");
var got = require("got");
var _ = require("lodash");

module.exports = function(zuoraClient) {


    function getSubscription(subscriptionNumberOrId) {
        return zuoraClient.authenticate().then(function(authCookie) {
            var url = zuoraClient.serverUrl + "/subscriptions/" + subscriptionNumberOrId;
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

    function createSubscription(subscriptionCreateRequest) {
        return zuoraClient.authenticate().then(function(authCookie) {
            var url = zuoraClient.serverUrl + "/subscriptions";
            var query = {
                body: JSON.stringify(subscriptionCreateRequest),
                headers: {
                    "Content-type": "application/json",
                    "cookie": authCookie,
                    "zuora-version": "207.0"
                },
                json: true
            };
            return got.post(url, query)
                .then(function(res) {
                    return res.body;
                });
        });
    }

    return {
        get: function(subscriptionNumberOrId) {
            return getSubscription(subscriptionNumberOrId);
        },
        clone: function(subscriptionNumberOrId, override) {
            return getSubscription(subscriptionNumberOrId).then(function(subscription) {
                var subscribeRequest = _.pick(_.omitBy(subscription, _.isNil), [
                    "CpqBundleJsonId__QT", "OpportunityCloseDate__QT", "OpportunityName__QT",
                    "QuoteBusinessType__QT", "QuoteNumber__QT", "QuoteType__QT",
                    "autoRenew", "contractEffectiveDate", "customerAcceptanceDate",
                    "serviceActivationDate", "initialTerm", "initialTermPeriodType",
                    "invoiceSeparately", "notes", "renewalSetting",
                    "renewalTermPeriodType", "termStartDate", "termType"
                ]);
                subscribeRequest.accountKey = subscription.accountId;
                subscribeRequest.invoiceOwnerAccountKey = subscription.accouninvoiceOwnerAccountIdtId;
                subscribeRequest.invoice = false;

                // Copy custom fields
                _.mapKeys(subscription, function(value, key) {
                    if (_.endsWith(key, "__c")) {
                        subscribeRequest[key] = value;
                    }
                    return null;
                });

                // Copy rate plan
                subscribeRequest.subscribeToRatePlans = [];
                subscription.ratePlans.forEach(function(ratePlan) {
                    var ratePlanCopy = {
                        productRatePlanId: ratePlan.productRatePlanId
                    };
                    // Copy custom fields
                    _.mapKeys(ratePlan, function(value, key) {
                        if (_.endsWith(key, "__c")) {
                            ratePlanCopy[key] = value;
                        }
                        return null;
                    });
                    // Copy charges
                    ratePlanCopy.chargeOverrides = [];
                    ratePlan.ratePlanCharges.forEach(function(charge) {
                        var chargeCopy = _.pick(_.omitBy(charge, _.isNil), [
                            "applyDiscountTo", "billCycleDay", "billCycleType",
                            "billingPeriod", "billingPeriodAlignment", "billingTiming", "description",
                            "discountAmount", "discountLevel", "discountPercentage", "endDateCondition", "includedUnits",
                            "listPriceBase", "numberOfPeriods", "overagePrice", "overageUnusedUnitsCreditOption",
                            "price", "priceChangeOption", "priceIncreasePercentage", "productRatePlanChargeId", "quantity",
                            "ratingGroup", "specificBillingPeriod", "specificEndDate", "triggerDate",
                            "unusedUnitsCreditRates", "upToPeriods", "upToPeriodsType", "weeklyBillCycleDay"
                        ]);
                        // Copy custom fields
                        _.mapKeys(charge, function(value, key) {
                            if (_.endsWith(key, "__c")) {
                                chargeCopy[key] = value;
                            }
                            if (key === "triggerEvent") {
                                if (value === "ContractEffective")
                                    chargeCopy[key] = "UCE";
                                if (value === "ServiceActivation")
                                    chargeCopy[key] = "USA";
                                if (value === "CustomerAcceptance")
                                    chargeCopy[key] = "UCA";
                                if (value === "ServiceDelivery")
                                    chargeCopy[key] = "USD";
                            }
                            return null;
                        });
                        if (charge.model === "FlatFee" || charge.type === "Usage") {
                            chargeCopy = _.omit(chargeCopy, ["quantity"]);
                        }
                        if (charge.type === "OneTime") {
                            chargeCopy = _.omit(chargeCopy, ["endDateCondition"]);
                        }

                        ratePlanCopy.chargeOverrides.push(chargeCopy);
                    });
                    subscribeRequest.subscribeToRatePlans.push(ratePlanCopy);
                });
                if (override) {
                    subscribeRequest = _.extend(subscribeRequest, override);
                }
                return createSubscription(subscribeRequest);
            });
        },
        create: function(subscriptionCreateRequest) {
            return createSubscription(subscriptionCreateRequest);
        }
    };
};
