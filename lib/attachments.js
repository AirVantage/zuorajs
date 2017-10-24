const BPromise = require('bluebird');
const got = require('got');
const _ = require('lodash');
const fs = require('fs');
const FormData = require('form-data');

module.exports = function(zuoraClient) {
  function addAttachment(associatedObjectType, associatedObjectKey, description, file) {
    return zuoraClient.authenticate().then(authCookie => {
      const form = new FormData();
      form.append('file', fs.createReadStream(file));

      var url = zuoraClient.serverUrl + '/attachments/';
      var query = {
        headers: {
          cookie: authCookie
        },
        query: {
          associatedObjectType: associatedObjectType,
          associatedObjectKey: associatedObjectKey,
          description: description
        },
        body: form
      };
      return got.post(url, query).then(res => {
        console.log(res.body);
        return res.body;
      });
    });
  }

  function listAdditionalAttachments(nextPage) {
    return zuoraClient.authenticate().then(authCookie => {
      var query = {
        headers: {
          'Content-type': 'application/json',
          cookie: authCookie
        },
        json: true
      };
      return got
        .get(nextPage, query)
        .then(res => {
          var attachments = res.body.attachments;
          if (res.body.nextPage) {
            return listAdditionalAttachments(res.body.nextPage).then(additionalAttachments => {
              return _.concat(attachments, additionalAttachments);
            });
          } else {
            return attachments;
          }
        })
        .catch(error => {
          if (error.statusCode === 401) {
            console.log(error.response.body);
            return this(queryString);
          } else {
            throw error;
          }
        });
    });
  }

  return {
    add: (associatedObjectType, associatedObjectKey, description, file) => {
      return addAttachment(associatedObjectType, associatedObjectKey, description, file);
    },
    list: (associatedObjectType, associatedObjectKey) => {
      return zuoraClient.authenticate().then(authCookie => {
        var url = zuoraClient.serverUrl + '/attachments/' + associatedObjectType + '/' + associatedObjectKey;
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
            var attachments = res.body.attachments;
            if (res.body.nextPage) {
              return listAdditionalAttachments(res.body.nextPage).then(additionalAttachments => {
                return _.concat(attachments, additionalAttachments);
              });
            } else {
              return attachments;
            }
          })
          .catch(error => {
            if (error.statusCode === 401) {
              console.log(error.response.body);
              return this(queryString);
            } else {
              throw error;
            }
          });
      });
    }
  };
};
