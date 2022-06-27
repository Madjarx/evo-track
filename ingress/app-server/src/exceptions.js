/**
 * Contains all the errors that we can throw when failing
 */

<<<<<<< HEAD
=======
const { config } = require('../config')

>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
class HttpError extends Error {
    constructor(message = "Http Error", statusCode=500){
        super(message);
        this.name = "HttpError"
        this.statusCode = statusCode
    }
}

class MissingAuthError extends HttpError {
    constructor(message = "Missing authorization header", statusCode=401){
        super(message, statusCode);
        this.name = "MissingAuthError"
        // this.statusCode = statusCode;
    }
}

class FailedCAAuth extends HttpError {
    constructor(message = "Failed to authenticate with Certificate Authority", statusCode=401){
        super(message, statusCode);
        this.name = "FailedCAAuth"
    }   
}

class CrtMissingPubKeyError extends HttpError{
    constructor(message = "Certificate does not contain a public key or it is malformed", statusCode=401){
        super(message, statusCode);
        this.name = "CrtMissingPubKeyError"
    }
}

class MissingDataError extends HttpError{
    constructor(message = "Missing data", statusCode=405){
        super(message, statusCode);
        this.name = "MissingDataError"
    }
}

class MissingBearerTokenAttribute extends HttpError{
    constructor(message = "Bearer Token Missing attribute", statusCode=401){
        super(message, statusCode);
        this.name = "MissingBearerTokenAttribute"
    }
}

<<<<<<< HEAD
=======
class RequestTooOld extends HttpError {
    constructor(message = `Request was signed more than ${config.headers.maxDelay} seconds ago`, statusCode=403){
        super(message, statusCode);
        this.name = "RequestTooOld"
    }
}

>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
module.exports = {
    HttpError,
    MissingAuthError,
    FailedCAAuth,
    CrtMissingPubKeyError,
    MissingDataError,
    MissingBearerTokenAttribute,
<<<<<<< HEAD
=======
    RequestTooOld,
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
}