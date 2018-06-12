const got = require('got');
const _ = require('lodash');

module.exports = (zuoraClient) => {
  function getSubscription(subscriptionNumberOrId) {
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.apiVersionUrl}/subscriptions/${subscriptionNumberOrId}`;
      const query = {
        headers,
        json: true,
      };
      return got.get(url, query).then((res) => res.body);
    });
  }

  function getSubscriptionsForAccount(accountId) {
    // TODO handle pagination
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.apiVersionUrl}/subscriptions/accounts/${accountId}`;
      const query = {
        headers,
        json: true,
      };
      return got.get(url, query).then((res) => res.body.subscriptions);
    });
  }

  function createSubscription(subscriptionCreateRequest) {
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.apiVersionUrl}/subscriptions`;
      const query = {
        body: subscriptionCreateRequest,
        headers: _.assignIn({
          'zuora-version': '215.0',
        }, headers),
        json: true,
      };
      return got.post(url, query).then((res) => res.body);
    });
  }

  function activateSubscription(id, date) {
    return zuoraClient.authenticate().then((authCookie) => {
      const url = `${zuoraClient.apiVersionUrl}/object/subscription/${id}`;
      const query = {
        body: {
          ContractEffectiveDate: date,
          ContractAcceptanceDate: date,
          ServiceActivationDate: date,
        },
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
        },
        json: true,
      };
      return got.put(url, query).then((res) => res.body);
    });
  }

  function updateSubscription(subscriptionNumberOrId, subscriptionUpdateRequest) {
    return zuoraClient.authenticate().then((headers) => {
      const url = `${zuoraClient.apiVersionUrl}/subscriptions/${subscriptionNumberOrId}`;
      const query = {
        body: subscriptionUpdateRequest,
        headers: _.assignIn({
          'zuora-version': '215.0',
        }, headers),
        json: true,
      };
      return got.put(url, query).then((res) => res.body);
    });
  }

  return {
    get: (subscriptionNumberOrId) => getSubscription(subscriptionNumberOrId),
    forAccount: (accountId) => getSubscriptionsForAccount(accountId),
    clone: (subscriptionNumberOrId, override) => getSubscription(subscriptionNumberOrId).then((subscription) => {
      let subscribeRequest = _.pick(_.omitBy(subscription, _.isNil), [
        'CpqBundleJsonId__QT',
        'OpportunityCloseDate__QT',
        'OpportunityName__QT',
        'QuoteBusinessType__QT',
        'QuoteNumber__QT',
        'QuoteType__QT',
        'autoRenew',
        'contractEffectiveDate',
        'customerAcceptanceDate',
        'serviceActivationDate',
        'initialTerm',
        'initialTermPeriodType',
        'invoiceSeparately',
        'notes',
        'renewalSetting',
        'renewalTermPeriodType',
        'termStartDate',
        'termType',
      ]);
      subscribeRequest.accountKey = subscription.accountId;
      subscribeRequest.invoiceOwnerAccountKey = subscription.accouninvoiceOwnerAccountIdtId;
      subscribeRequest.invoice = false;

      // Copy custom fields
      _.mapKeys(subscription, (value, key) => {
        if (_.endsWith(key, '__c')) {
          subscribeRequest[key] = value;
        }
        return null;
      });

      // Copy rate plan
      subscribeRequest.subscribeToRatePlans = [];
      subscription.ratePlans.forEach((ratePlan) => {
        const ratePlanCopy = {
          productRatePlanId: ratePlan.productRatePlanId,
        };
        // Copy custom fields
        _.mapKeys(ratePlan, (value, key) => {
          if (_.endsWith(key, '__c')) {
            ratePlanCopy[key] = value;
          }
          return null;
        });
        // Copy charges
        ratePlanCopy.chargeOverrides = [];
        ratePlan.ratePlanCharges.forEach((charge) => {
          let chargeCopy = _.pick(_.omitBy(charge, _.isNil), [
            'applyDiscountTo',
            'billCycleDay',
            'billCycleType',
            'billingPeriod',
            'billingPeriodAlignment',
            'billingTiming',
            'description',
            'discountAmount',
            'discountLevel',
            'discountPercentage',
            'endDateCondition',
            'includedUnits',
            'listPriceBase',
            'numberOfPeriods',
            'overagePrice',
            'overageUnusedUnitsCreditOption',
            'price',
            'priceChangeOption',
            'priceIncreasePercentage',
            'productRatePlanChargeId',
            'quantity',
            'ratingGroup',
            'specificBillingPeriod',
            'specificEndDate',
            'triggerDate',
            'unusedUnitsCreditRates',
            'upToPeriods',
            'upToPeriodsType',
            'weeklyBillCycleDay',
          ]);
          // Copy custom fields
          _.mapKeys(charge, (value, key) => {
            if (_.endsWith(key, '__c')) {
              chargeCopy[key] = value;
            }
            if (key === 'triggerEvent') {
              if (value === 'ContractEffective') {
                chargeCopy[key] = 'UCE';
              }
              if (value === 'ServiceActivation') {
                chargeCopy[key] = 'USA';
              }
              if (value === 'CustomerAcceptance') {
                chargeCopy[key] = 'UCA';
              }
              if (value === 'ServiceDelivery') {
                chargeCopy[key] = 'USD';
              }
            }
            return null;
          });
          if (charge.model === 'FlatFee' || charge.type === 'Usage') {
            chargeCopy = _.omit(chargeCopy, ['quantity']);
          }
          if (charge.type === 'OneTime') {
            chargeCopy = _.omit(chargeCopy, ['endDateCondition']);
          }

          ratePlanCopy.chargeOverrides.push(chargeCopy);
        });
        subscribeRequest.subscribeToRatePlans.push(ratePlanCopy);
      });
      if (override) {
        subscribeRequest = _.extend(subscribeRequest, override);
      }
      return createSubscription(subscribeRequest);
    }),
    create: (subscriptionCreateRequest) => createSubscription(subscriptionCreateRequest),
    activate: (subscriptionId, date) => activateSubscription(subscriptionId, date),
    update: (numberOrId, request) => updateSubscription(numberOrId, request),
  };
};
