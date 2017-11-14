const BPromise = require('bluebird');
const got = require('got');
const fs = require('fs');
const _ = require('lodash');

module.exports = zuoraClient => {
  function exportZOQL(zoql, format) {
    return zuoraClient.authenticate().then(authCookie => {
      var url = zuoraClient.serverUrl + '/object/export';
      var data = {
        Query: zoql,
        Format: format
      };
      var query = {
        body: data,
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie
        },
        json: true
      };
      return got
        .post(url, query)
        .then(res => {
          return res.body;
        })
        .catch(error => {
          console.log(error);
          if (error.statusCode === 401) {
            return this(queryString);
          } else {
            throw error;
          }
        });
    });
  }

  function retrieveExport(exportId) {
    return zuoraClient.authenticate().then(authCookie => {
      var url = zuoraClient.serverUrl + '/object/export/' + exportId;
      var query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie
        },
        json: true
      };
      return got
        .get(url, query)
        .then(res => {
          return res.body;
        })
        .catch(error => {
          console.log(error);
          if (error.statusCode === 401) {
            return this(queryString);
          } else {
            throw error;
          }
        });
    });
  }

  /**
   * Wait for a given export to be Completed/Failed/Canceled before returning the promise
   */
  var waitExportEnd = function(exportId) {
    return BPromise.delay(1000).then(ref => retrieveExport(exportId)).then(exportResult => {
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
        .then(res => res.pipe(fs.createWriteStream(path))),
    retrieve: id => retrieveExport(Id)
  };
};
