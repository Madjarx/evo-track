const moment = require('moment');

const { config } = require('../config');
const { MissingAuthError, FailedCAAuth, CrtMissingPubKeyError, HttpError} = require('./exceptions')

/**
 * `app.get`, `app.post`, etc. and respective callbacks go here
 */

const TextHandler = function(text){
    return function(req, res){
        res.status(200).set('Content-Type', 'text/plain').send(text)
    }
}

const help = new TextHandler(`curl "$URL" 
    --request POST 
    --header "Content-Type: multipart/form-data" 
    --header "Authorization: TODO" 
    --header "EvoEco-Authorization: $EVOECO_AUTH" 
    --form "data=@$TARGET_FILE_ABS" 
`)

const receive = function(controller){
    return async function(req, res){
        try {
            var startTime = moment();

            console.log(req.headers)

            const actor = await controller.authenticate(req.headers);
            
            console.log('TIME:\tAuthenticate: ', moment().diff(startTime))
            startTime = moment()

            const usageEvents = await controller.adapt(req.files)
            
            console.log('TIME:\tConvert Data: ', moment().diff(startTime))
            startTime = moment()
            
            const msg = await controller.ingress(actor, usageEvents)

            console.log('TIME:\tIngress: ', moment().diff(startTime))

            return res.status(201).send(msg)
        }
        catch (e) {
            console.log(e)
            
            let statusCode = 500
            let message = "Server error";

            if (e instanceof HttpError){
                statusCode = e.statusCode
                message = e.message

                console.log(statusCode)
            }

            return res.status(statusCode).send(message);
        }
    }
}

module.exports = function({app, controller}){
    app.get('/', help)

    app.post(config.server.routes.post, receive(controller))
}
