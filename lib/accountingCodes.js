const got = require('got');
const _ = require('lodash');

module.exports = (zuoraClient) => {
  function getAccount(accountId) {
    return zuoraClient.authenticate().then((authCookie) => {
      const url = `${zuoraClient.apiVersionUrl}/object/account/${accountId}`;
      const query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
        },
        json: true,
      };
      return got.get(url, query).then((res) => res.body);
    });
  }

  function deleteAccount(accountId) {
    return zuoraClient.authenticate().then((authCookie) => {
      const url = `${zuoraClient.apiVersionUrl}/object/account/${accountId}`;
      const query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
        },
        json: true,
      };
      return got.delete(url, query).then((res) => res.body);
    });
  }

  function updateAccount(accountId, updatedContent) {
    return zuoraClient.authenticate().then((authCookie) => {
      const url = `${zuoraClient.apiVersionUrl}/object/account/${accountId}`;
      const query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
        },
        body: updatedContent,
        json: true,
      };
      return got.put(url, query).then((res) => res.body);
    });
  }

  function getAllAccountingCodes() {
    return zuoraClient.authenticate().then((authCookie) => {
      const url = `${zuoraClient.apiVersionUrl}/accounting-codes`;
      const query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
        },
        json: true,
      };
      return got
        .get(url, query)
        .then((res) => {
          const accountingCodes = res.body.accountingCodes;
          if (res.body.nextPage) {
            return getAdditionalAccountingCodes(res.body.nextPage).then((additionalCodes) => _.concat(accountingCodes, additionalCodes));
          }
          return accountingCodes;
        })
        .catch((error) => {
          if (error.statusCode === 401) {
            console.log(error.response.body);
            return [];
          }
          throw error;
        });
    });
  }

  function getAdditionalAccountingCodes(nextPage) {
    return zuoraClient.authenticate().then((authCookie) => {
      const query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie,
        },
        json: true,
      };
      return got
        .get(nextPage, query)
        .then((res) => {
          const accountingCodes = res.body.accountingCodes;
          if (res.body.nextPage) {
            return getAdditionalAccountingCodes(res.body.nextPage).then((additionalCodes) => _.concat(accountingCodes, additionalCodes));
          }
          return accountingCodes;
        })
        .catch((error) => {
          if (error.statusCode === 401) {
            console.log(error.response.body);
            return [];
          }
          throw error;
        });
    });
  }

  return {
    all: () => getAllAccountingCodes(),
    get: (codeId) => getAccountingCode(codeId),
    create: (accountingCode) => createAccountingCode(accountingCode),
    update: (codeId, updatedContent) => updateAccountingCode(codeId, updatedContent),
    delete: (codeId) => deleteAccountingCode(codeId),
    activate: (codeId) => activateAccountingCode(codeId),
    deactivate: (codeId) => deactivateAccountingCode(codeId),
  };
};
