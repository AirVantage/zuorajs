var got = require('got');
var _ = require('lodash');

module.exports = function(zuoraClient) {
  function getAccount(accountId) {
    return zuoraClient.authenticate().then(authCookie => {
      var url = zuoraClient.serverUrl + '/object/account/' + accountId;
      var query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie
        },
        json: true
      };
      return got.get(url, query).then(res => {
        return res.body;
      });
    });
  }

  function deleteAccount(accountId) {
    return zuoraClient.authenticate().then(authCookie => {
      var url = zuoraClient.serverUrl + '/object/account/' + accountId;
      var query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie
        },
        json: true
      };
      return got.delete(url, query).then(res => {
        return res.body;
      });
    });
  }

  function updateAccount(accountId, updatedContent) {
    return zuoraClient.authenticate().then(authCookie => {
      var url = zuoraClient.serverUrl + '/object/account/' + accountId;
      var query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie
        },
        body: updatedContent,
        json: true
      };
      return got.put(url, query).then(res => {
        return res.body;
      });
    });
  }

  function getAllAccountingCodes() {
    return zuoraClient.authenticate().then(authCookie => {
      var url = zuoraClient.serverUrl + '/accounting-codes';
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
            console.log(error.response.body);
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
            console.log(error.response.body);
            return [];
          } else {
            throw error;
          }
        });
    });
  }

  return {
    all: () => getAllAccountingCodes(),
    get: codeId => getAccountingCode(codeId),
    create: accountingCode => createAccountingCode(accountingCode),
    update: (codeId, updatedContent) => updateAccountingCode(codeId, updatedContent),
    delete: codeId => deleteAccountingCode(codeId),
    activate: codeId => activateAccountingCode(codeId),
    deactivate: codeId => deactivateAccountingCode(codeId)
  };
};
