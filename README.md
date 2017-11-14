Zuora.js
========
> Node.js API client for Zuora REST API https://www.zuora.com/developer/api-reference/

:warning: __This project is a work in progress and is not yet intended to be used in production.__ :warning:


## Install

```
$ npm install --save zuorajs
```

## Usage

```javascript

var Zuora = require("../zuora.js");

var client = new Zuora({
    url: "ZUORA_INSTANCE_URL",
    apiAccessKeyId: "YOUR_LOGIN",
    apiSecretAccessKey: "YOUR_PASSWORD"
});

client.action.query("select Id, Name from Account where AccountNumber='XXXX'").then(function(queryResult) {
    console.log(queryResult);
}).catch(function(e) {
    console.log("Error: " + e);
});

```
 
By default, authentication is performed using cookie method: https://www.zuora.com/developer/api-reference/#section/Authentication/Other-Supported-Authentication-Schemes
 
You can use oauth v2 authentication instead: https://www.zuora.com/developer/api-reference/#section/Authentication/OAuth-v2.0
 
Usage
```javascript
 
var Zuora = require("../zuora.js");
 
var client = new Zuora({
    url: "ZUORA_INSTANCE_URL",
    oauthType: "oauth_v2"
    client_id: "YOUR_CLIENT_ID",
    client_secret: "YOUR_CLIENT_SECRET"
});
 
```

## License

MIT

## Contributions are welcome

See https://github.com/AirVantage/zuorajs/issues.
