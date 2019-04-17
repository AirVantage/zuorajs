const got = require('got');

module.exports = zuoraClient => ({
  delete: id =>
    zuoraClient.authenticate().then(headers => {
      const url = `${zuoraClient.serverUrl}/v1/object/amendment/${id}`;
      const query = {
        headers,
        json: true
      };
      return got.delete(url, query).then(res => res.body);
    })
});
