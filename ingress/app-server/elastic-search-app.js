const fs = require('fs');
const {google} = require('googleapis');
const Promise = require('bluebird');
const _ = require('lodash');
const fileupload = require('express-fileupload');
const rq = require('request-promise'); // https://www.npmjs.com/package/request-promise#get-something-from-a-json-rest-api
const urljoin = require('url-join')

const { toMessage, toActor } = require('./google-sheets-app')
const { config } = require('./config'); 


/**
 * Ingress data to Google Sheets
 * 
 * @param {Object} event event containing data
 * @param {Array} event.Records messages
 * @param {Object} context context of the Lambda function
 */

exports.handler = async function(event, context){
    console.log(JSON.stringify(event))
    // console.log(JSON.stringify(context))

    await Promise.all(event.Records.map(async (record) => {
        var [Message, MessageAttributes] = toMessage(record);

        console.log('Message: ', Message);
        console.log('MessageAttributes: ', MessageAttributes)

        actor = toActor(MessageAttributes)

        console.log('Actor:', actor)

        // throws error 
        try {
            const response = await ingress_send_elasticsearch(actor, JSON.parse(Message));
        } catch (e) {
            console.log(e)
            
            // throw error to avoid removing element off queue
            // https://stackoverflow.com/questions/62568596/how-to-prevent-aws-lambda-from-deleting-message-from-sqs-queue
            throw "ERROR: failed to ingress to ElasticSearch from SQS"
        }
    }))
}


/**
 * Communication with Elasticsearch
 * Does not worry about request headers
 * IDEA: send in bulk: https://stackoverflow.com/questions/24778454/how-to-insert-multiple-records-in-one-query/24778541
 * 
 * @param {Object} actor
 * @param {Object} usageEvent
 */
 async function ingress_send_elasticsearch (actor, usageEvent){
    const url = urljoin(config.es.url, actor[config.actor.ElasticSearchIndex], '_doc')
    console.log('ELASTICURL', url)

    // send usageEvents to elasticsearch
    var options = {
        method: 'POST',
        uri: url,
        // uri: config.db.es_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${config.es.es_username}:${config.es.es_password}`).toString("base64")}` // create auth with base64 encoding
        },
        body: usageEvent,
        json: true, // automatically stringifies the body to JSON
    }

    var res = await rq(options)
        .then((body) => {
            console.log("POST to Elasticsearch SUCCEEDED")
            return body;
        })
        .catch((err) => {
            console.log("ELASTICSEARCH", err)
            throw 'Post to ElasticSearch Failed'
        })

    return res;
}