const got = require('got');

module.exports = (zuoraClient) => ({
  create: (data) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run`;
    const query = {
      body: data,
      headers,
      json: true,
    };
    return got.post(url, query).then((res) => res.body);
  }),

  get: (billRunId) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run/${billRunId}`;
    const query = {
      headers,
      json: true,
    };
    return got.get(url, query).then((res) => res.body);
  }),

  post: (billRunId) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run/${billRunId}`;
    const query = {
      body: { Status: 'Posted' },
      headers,
      json: true,
    };
    return got.put(url, query).then((res) => res.body);
  }),

  cancel: (billRunId) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run/${billRunId}`;
    const query = {
      body: { Status: 'Canceled' },
      headers,
      json: true,
    };
    return got.put(url, query).then((res) => res.body);
  }),

  delete: (billRunId) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/object/bill-run/${billRunId}`;
    const query = {
      headers,
      json: true,
    };
    return got.delete(url, query).then((res) => res.body);
  }),
});
