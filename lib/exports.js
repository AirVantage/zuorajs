const BPromise = require('bluebird');
const got = require('got');
const fs = require('fs');

module.exports = zuoraClient => {
  function exportZOQL(zoql, format) {
    return zuoraClient.authenticate().then(headers => {
      const url = zuoraClient.serverUrl + '/v1/object/export';
      const data = {
        Query: zoql,
        Format: format
      };
      const query = {
        headers,
        body: data,
        json: true
      };
      return got.post(url, query).then(res => res.body);
    });
  }

  function retrieveExport(exportId) {
    return zuoraClient.authenticate().then(headers => {
      const url = zuoraClient.serverUrl + '/v1/object/export/' + exportId;
      const query = {
        headers,
        json: true
      };
      return got.get(url, query).then(res => res.body);
    });
  }

  /**
   * Wait for a given export to be Completed/Failed/Canceled before returning the promise
   */
  const waitExportEnd = function(exportId) {
    return BPromise.delay(1000)
      .then(() => retrieveExport(exportId))
      .then(exportResult => {
        if (exportResult.Status === 'Completed') {
          return exportResult;
        } else if (exportResult.Status === 'Failed') {
          return BPromise.reject('Export failed');
        } else if (exportResult.Status === 'Canceled') {
          return BPromise.reject('Export canceled');
        } else {
          return waitExportEnd(exportId);
        }
      });
  };

  return {
    export: (query, format) => exportZOQL(query, format),
    exportAndDownload: (query, format, path) =>
      exportZOQL(query, format)
        .then(result => waitExportEnd(result.Id))
        .then(exportResult => zuoraClient.files.stream(exportResult.FileId))
        .then(res => {
          return new BPromise((resolve, reject) => {
            const stream = res.pipe(fs.createWriteStream(path));
            stream.on('finish', () => {
              resolve();
            });
            stream.on('error', err => {
              reject(err);
            });
          });
        }),
    retrieve: id => retrieveExport(id)
  };
};
