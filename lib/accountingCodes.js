var got = require('got');
var _ = require('lodash');

module.exports = function(zuoraClient) {
  function getAllAccountingCodes() {
    return zuoraClient.authenticate().then(authCookie => {
      var url = zuoraClient.serverUrl + '/v1/accounting-codes';
      var query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie
        },
        json: true
      };
      return got
        .get(url, query)
        .then(res => {
          var accountingCodes = res.body.accountingCodes;
          if (res.body.nextPage) {
            return getAdditionalAccountingCodes(res.body.nextPage).then(additionalCodes => {
              return _.concat(accountingCodes, additionalCodes);
            });
          } else {
            return accountingCodes;
          }
        })
        .catch(error => {
          if (error.statusCode === 401) {
            return [];
          } else {
            throw error;
          }
        });
    });
  }

  function getAdditionalAccountingCodes(nextPage) {
    return zuoraClient.authenticate().then(authCookie => {
      var query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie
        },
        json: true
      };
      return got
        .get(nextPage, query)
        .then(res => {
          var accountingCodes = res.body.accountingCodes;
          if (res.body.nextPage) {
            return getAdditionalAccountingCodes(res.body.nextPage).then(additionalCodes => {
              return _.concat(accountingCodes, additionalCodes);
            });
          } else {
            return accountingCodes;
          }
        })
        .catch(error => {
          if (error.statusCode === 401) {
            return [];
          } else {
            throw error;
          }
        });
    });
  }

  return {
    all: () => getAllAccountingCodes()
  };
};
