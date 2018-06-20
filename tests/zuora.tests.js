const assert = require('assert');
const Zuora = require('../zuora');

describe('zuora', function () {
  let client;
  beforeEach(function () {
    client = new Zuora({
      url: 'https://nota.real.host.zuora.com',
      apiVersion: '/v1',
    });
  });

  describe('getApiUrlWithPath', function () {
    it('should inject version path element', function () {
      assert.strictEqual(client.getApiUrlWithPath('/foo'), 'https://nota.real.host.zuora.com/v1/foo');
    });

    it('should not duplicate version path element', function () {
      assert.strictEqual(client.getApiUrlWithPath('/v1/bar'), 'https://nota.real.host.zuora.com/v1/bar');
    });
  });
});