const got = require('got');
const _ = require('lodash');
const fs = require('fs');
const FormData = require('form-data');

module.exports = function(zuoraClient) {
  function addAttachment(associatedObjectType, associatedObjectKey, description, file) {
    return zuoraClient.authenticate().then((headers) => {
      const form = new FormData();
      form.append('file', fs.createReadStream(file));

      const url = zuoraClient.serverUrl + '/v1/attachments/';
      const query = {
        headers,
        query: {
          associatedObjectType: associatedObjectType,
          associatedObjectKey: associatedObjectKey,
          description: description,
        },
        body: form,
      };
      return got.post(url, query).then((res) => {
        return JSON.parse(res.body || '{}');
      });
    });
  }

  function listAttachments(associatedObjectType, associatedObjectKey) {
    return zuoraClient.authenticate().then((headers) => {
      const url = zuoraClient.serverUrl + '/v1/attachments/' + associatedObjectType + '/' + associatedObjectKey;
      const query = {
        headers,
        json: true,
      };
      return got
        .get(url, query)
        .then((res) => {
          if (!res.body.success) {
            return res.body;
          }

          const attachments = res.body.attachments;

          if (!attachments.nextPage) {
            return res.body;
          }

          return listAdditionalAttachments(res.body.nextPage).then((additionalAttachments) =>
            _.assignIn({}, res.body, {
              attachments: _.concat(attachments, additionalAttachments),
            })
          );
        })
        .catch((error) => {
          if (error.statusCode === 401) {
            console.log(error.response.body);
            return this(queryString);
          } else {
            throw error;
          }
        });
    });
  }

  function listAdditionalAttachments(nextPage) {
    return zuoraClient.authenticate().then((headers) => {
      const query = {
        headers,
        json: true,
      };
      return got
        .get(nextPage, query)
        .then((res) => {
          const attachments = res.body.attachments;
          if (res.body.nextPage) {
            return listAdditionalAttachments(res.body.nextPage).then((additionalAttachments) =>
              _.concat(attachments, additionalAttachments)
            );
          } else {
            return attachments;
          }
        })
        .catch((error) => {
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
    add: (associatedObjectType, associatedObjectKey, description, file) =>
      addAttachment(associatedObjectType, associatedObjectKey, description, file),
    find: (associatedObjectType, associatedObjectKey, description) =>
      listAttachments(associatedObjectType, associatedObjectKey).then((results) => {
        results.attachments = _.filter(results.attachments, {
          description,
        });
        return results;
      }),
    delete: (attachmentId) =>
      zuoraClient.authenticate().then((headers) => {
        const url = zuoraClient.serverUrl + '/v1/attachments/' + attachmentId;
        const query = {
          headers,
        };
        return got.delete(url, query).then((res) => {
          return res.body;
        });
      }),
    list: (associatedObjectType, associatedObjectKey) => listAttachments(associatedObjectType, associatedObjectKey),
  };
};
