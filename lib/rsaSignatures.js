const got = require('got');

module.exports = zuoraClient => ({
  /**
   * Request a Zuora digital signature
   * A digital signature is required each time that an hosted payment page is rendered
   * Zuora doc: https://knowledgecenter.zuora.com/DC_Developers/C_REST_API/B_REST_API_reference/RSA_Signatures
   *
   * @param  {string} hostedPageId    The id of the hosted page
   * @param  {string} paymentPageUrl  The url of the paymentPage
   * @return {Promise<Object>}        The digital signature token
   */
  get: (hostedPageId, paymentPageUrl) =>
    zuoraClient.authenticate().then(headers =>
      got
        .post(`${zuoraClient.serverUrl}/v1/rsa-signatures`, {
          body: {
            uri: paymentPageUrl,
            method: 'POST',
            pageId: hostedPageId
          },
          headers,
          json: true
        })
        .then(({ body }) => body)
    )
});
