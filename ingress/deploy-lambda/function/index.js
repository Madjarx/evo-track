const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

// Create client outside of handler to reuse
const lambda = new AWS.Lambda()

// Handler
/**
 * 
 * @param {JSON} event 
 * @param {JSON} context 
 */
exports.handler = async function(event, context) {
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
  console.log('## CONTEXT: ' + serialize(context));
  console.log('## EVENT: ' + serialize(event));
  
  if (event.hasOwnProperty('requestContext')){
    console.log('## SOURCE IP: ' + event.requestContext['identity']['sourceIp'])

    let responseCode = 200;

    let response = {
      isBase64Encoded : "false",
      statusCode: responseCode,
      headers: {
          "x-custom-header" : "my custom header value"
      },
      body: serialize({
        'ip': event.requestContext["identity"]['sourceIp']
      })
    };
  
    return response;
  }
  
  return getAccountSettings();
}

// Use SDK client
var getAccountSettings = function(){
  return lambda.getAccountSettings().promise()
}

var serialize = function(object) {
  return JSON.stringify(object, null, 2)
}
