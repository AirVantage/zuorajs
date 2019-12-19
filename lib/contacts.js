const got = require('got');

module.exports = function(zuoraClient) {
  return {
    get: contactId =>
      zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/v1/object/contact/' + contactId;
        const query = {
          headers,
          json: true
        };
        return got.get(url, query).then(res => {
          return res.body;
        });
      }),
    update: (contactId, contactDetails) =>
      zuoraClient.authenticate().then(headers => {
        const url = zuoraClient.serverUrl + '/v1/object/contact/' + contactId;
        const query = {
          body: contactDetails,
          headers,
          json: true
        };
        return got.put(url, query).then(res => {
          return res.body;
        });
      })
  };
};
