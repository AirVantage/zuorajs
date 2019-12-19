const got = require('got');
const _ = require('lodash');

module.exports = function(zuoraClient) {
  function getAccount(accountId) {
    return zuoraClient.authenticate().then(headers => {
      const url = zuoraClient.serverUrl + '/v1/object/account/' + accountId;
      const query = {
        headers,
        json: true
      };
      return got.get(url, query).then(res => res.body);
    });
  }

  function deleteAccount(accountId) {
    return zuoraClient.authenticate().then(headers => {
      const url = zuoraClient.serverUrl + '/v1/object/account/' + accountId;
      const query = {
        headers,
        json: true
      };
      return got.delete(url, query).then(res => res.body);
    });
  }

  function updateAccount(accountId, updatedContent) {
    return zuoraClient.authenticate().then(headers => {
      const url = zuoraClient.serverUrl + '/v1/object/account/' + accountId;
      const query = {
        headers,
        body: updatedContent,
        json: true
      };
      return got.put(url, query).then(res => res.body);
    });
  }

  function getAccountFromAccountNumber(accountNumber) {
    return zuoraClient.action
      .query("select Id from Account where AccountNumber='" + accountNumber + "'")
      .then(queryResult => {
        if (queryResult[0]) {
          const accountId = queryResult[0].Id;
          return getAccount(accountId);
        } else {
          return null;
        }
      });
  }

  return {
    getFromAccountNumber: accountNumber => getAccountFromAccountNumber(accountNumber),
    activate: accountId => updateAccount(accountId, { Status: 'Active' }),
    get: accountId => getAccount(accountId),
    update: (accountId, updatedContent) => updateAccount(accountId, updatedContent),
    delete: accountId => deleteAccount(accountId)
  };
};
