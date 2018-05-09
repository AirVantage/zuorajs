const got = require('got');

module.exports = (zuoraClient) => ({
  subscribe: (subscribeData) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/action/subscribe`;
    const query = {
      body: subscribeData,
      headers,
      json: true,
    };
    return got.post(url, query).then((res) => res.body).catch((error) => {
      if (error.statusCode === 401) {
        return this(error.response.body);
      }
      throw error;
    });
  }),

  query: (queryString) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/action/query`;
    const data = {
      queryString,
    };
    const query = {
      body: data,
      headers,
      json: true,
    };
    return got.post(url, query).then((res) => res.body).catch((error) => {
      if (error.statusCode === 401) {
        return this(queryString);
      }
      throw error;
    });
  }),

  queryMore: (queryLocator) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/action/queryMore`;
    const query = {
      body: {
        queryLocator,
      },
      headers,
      json: true,
    };
    return got.post(url, query).then((res) => res.body).catch((error) => {
      if (error.statusCode === 401) {
        return this(queryLocator);
      }
      throw error;
    });
  }),

  delete: (type, ids) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/action/delete`;
    const query = {
      body: {
        type,
        ids,
      },
      headers,
      json: true,
    };
    return got.post(url, query).then((res) => res.body);
  }),

  update: (type, objects) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/action/update`;
    const query = {
      body: {
        type,
        objects,
      },
      headers,
      json: true,
    };
    return got.post(url, query).then((res) => res.body);
  }),
});
