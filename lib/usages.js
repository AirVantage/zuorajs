const got = require('got');
const FormData = require('form-data');
const fs = require('fs');

module.exports = zuoraClient => ({
  post: async (file, filename) => {
    const headers = await zuoraClient.authenticate();
    const form = new FormData();
    form.append('file', fs.createReadStream(file), { filename });

    const url = zuoraClient.serverUrl + '/v1/usage';
    const query = {
      headers,
      body: form
    };
    return got.post(url, query).then(res => {
      return JSON.parse(res.body);
    });
  },
  // Do not migrate this to arrow function (this context would be lost)
  checkUploadCompleted: function(path) {
    return new Promise(async resolve => {
      const headers = await zuoraClient.authenticate();
      const result = await got.get(`${zuoraClient.serverUrl}${path}`, { headers, json: true });
      if (['Pending', 'Processing'].includes(result.body.importStatus)) {
        setTimeout(() => {
          resolve(this.checkUploadCompleted(path));
        }, 1000);
      } else {
        resolve();
      }
    });
  }
});
