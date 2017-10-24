const BPromise = require('bluebird');
const got = require('got');
const _ = require('lodash');
const accountsLib = require('./lib/accounts.js');
const actionLib = require('./lib/action.js');
const attachmentsLib = require('./lib/attachments.js');
const contactsLib = require('./lib/contacts.js');
const filesLib = require('./lib/files.js');
const invoicesLib = require('./lib/invoices.js');
const invoiceItemsLib = require('./lib/invoiceItems.js');
const productRatePlansLib = require('./lib/productRatePlans.js');
const productRatePlanChargesLib = require('./lib/productRatePlanCharges.js');
const ratePlanChargesLib = require('./lib/ratePlanCharges.js');
const subscriptionsLib = require('./lib/subscriptions.js');
const taxationItemsLib = require('./lib/taxationItems.js');

function Zuora(config) {
  this.serverUrl = config.url;
  this.apiAccessKeyId = config.apiAccessKeyId;
  this.apiSecretAccessKey = config.apiSecretAccessKey;
  this.entityId = config.entityId;
  this.entityName = config.entityName;

  this.accounts = accountsLib(this);
  this.action = actionLib(this);
  this.attachments = attachmentsLib(this);
  this.contacts = contactsLib(this);
  this.files = filesLib(this);
  this.invoices = invoicesLib(this);
  this.invoiceItems = invoiceItemsLib(this);
  this.productRatePlans = productRatePlansLib(this);
  this.productRatePlanCharges = productRatePlanChargesLib(this);
  this.ratePlanCharges = ratePlanChargesLib(this);
  this.subscriptions = subscriptionsLib(this);
  this.taxationItems = taxationItemsLib(this);
}
module.exports = Zuora;

Zuora.prototype.authenticate = function() {
  if (this.authCookie === undefined) {
    var self = this;
    var url = this.serverUrl + '/connections';
    var query = {
      headers: {
        'user-agent': 'zuorajs',
        'Content-type': 'application/json',
        apiAccessKeyId: this.apiAccessKeyId,
        apiSecretAccessKey: this.apiSecretAccessKey
      },
      json: true
    };
    return got.post(url, query).then(res => {
      self.authCookie = res.headers['set-cookie'][0];
      return self.authCookie;
    });
  } else {
    return BPromise.resolve(this.authCookie);
  }
};

Zuora.prototype.getObject = function(url) {
  var self = this;
  return self.authenticate().then(function(authCookie) {
    var fullUrl = self.serverUrl + url;
    var query = {
      headers: {
        'Content-type': 'application/json',
        cookie: authCookie
      },
      json: true
    };
    return got.get(fullUrl, query).then(function(res) {
      return res.body;
    });
  });
};

Zuora.prototype.queryFirst = function(queryString) {
  return this.action.query(queryString).then(function(queryResult) {
    if (queryResult.size > 0) {
      return queryResult.records[0];
    } else {
      return null;
    }
  });
};

Zuora.prototype.queryFull = function(queryString) {
  var self = this;

  function fullQueryMore(queryLocator) {
    return self.action.queryMore(queryLocator).then(result => {
      var records = result.records;
      if (result.done) {
        return records;
      } else {
        return fullQueryMore(result.queryLocator).then(additionalRecords => {
          return _.concat(records, additionalRecords);
        });
      }
    });
  }

  return self.action.query(queryString).then(result => {
    var records = result.records;
    if (result.done) {
      return records;
    } else {
      return fullQueryMore(result.queryLocator).then(additionalRecords => {
        return _.concat(records, additionalRecords);
      });
    }
  });
};
