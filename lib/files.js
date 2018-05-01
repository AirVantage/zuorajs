const got = require('got');

module.exports = (zuoraClient) => ({
  get: (fileId) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.serverUrl}/files/${fileId}`;
    const query = {
      headers,
    };
    return got.get(url, query);
  }),

  stream: (fileId) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.serverUrl}/files/${fileId}`;
    const query = {
      headers,
    };
    return got.stream(url, query);
  }),
});
