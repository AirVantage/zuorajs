const got = require('got');

module.exports = (zuoraClient) => ({
  create: (refundParams) =>
    zuoraClient.authenticate().then(async (headers) => {
      try {
        const response = (
          await got.post(`${zuoraClient.serverUrl}/v1/object/refund`, {
            body: refundParams,
            headers,
            json: true,
          })
        ).body;

        console.log('the response in zuorajs is');

        console.log(response);

        return response;
      } catch (e) {
        console.log('ERROR IS');
        console.log(e);
      }
    }),
});
