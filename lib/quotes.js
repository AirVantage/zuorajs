const got = require('got');

module.exports = (zuoraClient) => ({
  getDocument: (options) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/quotes/document`;
    const query = {
      headers,
      body: options,
      json: true,
    };
    return got.post(url, query).then((res) => res.body);
  }),
});
