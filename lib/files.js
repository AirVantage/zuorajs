var BPromise = require('bluebird');
var got = require('got');
var _ = require('lodash');

module.exports = function(zuoraClient) {
  return {
    get: fileId => {
      return zuoraClient.authenticate().then(authCookie => {
        var url = zuoraClient.serverUrl + '/files/' + fileId;
        var query = {
          headers: {
            'Content-type': 'application/pdf',
            cookie: authCookie
          }
        };
        return got.get(url, query);
      });
    },
    stream: fileId => {
      return zuoraClient.authenticate().then(authCookie => {
        var url = zuoraClient.serverUrl + '/files/' + fileId;
        var query = {
          headers: {
            'Content-type': 'application/pdf',
            cookie: authCookie
          }
        };
        return got.stream(url, query);
      });
    }
  };
};
