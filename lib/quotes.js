const got = require('got');

module.exports = (zuoraClient) => ({
  /**
   * Generate a Zuora Quote Document
   * Zuora API Ref: https://www.zuora.com/developer/api-reference/#tag/Quotes-Document
   *
   * @param  {Object} options    Containing the request body parameters
   * @return {Promise<Object>}   Containing the file url and success boolean
   */
  generateDocument: (options) => zuoraClient.authenticate().then((headers) => {
    const url = `${zuoraClient.apiVersionUrl}/quotes/document`;
    const query = {
      headers,
      body: options,
      json: true,
    };

    return got.post(url, query).then((res) => res.body);
  }),
});
