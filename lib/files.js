var got = require('got');

module.exports = function(zuoraClient) {
  return {
    get: fileId =>
      zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/v1/files/' + fileId;
        var query = {
          headers
        };
        return got.get(url, query);
      }),
    stream: fileId =>
      zuoraClient.authenticate().then(headers => {
        var url = zuoraClient.serverUrl + '/v1/files/' + fileId;
        var query = {
          headers
        };
        return got.stream(url, query);
      })
  };
};
