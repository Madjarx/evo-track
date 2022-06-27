const fs = require('fs');
const {google} = require('googleapis');
const Promise = require('bluebird');
const _ = require('lodash');
const fileupload = require('express-fileupload');
const rq = require('request-promise'); // https://www.npmjs.com/package/request-promise#get-something-from-a-json-rest-api
const urljoin = require('url-join')
const moment = require('moment')
const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')


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
    // You can generate a Token from the "Tokens Tab" in the UI
    const token = fs.readFileSync(config.influx.tokenFile).toString()

    // Create a client to communicate with DB
    const client = new InfluxDB({url: config.influx.url, token: token})
    const writeApi = client.getWriteApi(config.influx.org, config.influx.bucket)
    // writeApi.useDefaultTags({host: 'host1'})

    await Promise.all(event.Records.map(async (record) => {
        var [Message, MessageAttributes] = toMessage(record);

        // console.log('Message: ', Message);
        // console.log('MessageAttributes: ', MessageAttributes)

        actor = toActor(MessageAttributes)
        event = JSON.parse(Message)

        console.log('Actor:', actor)
        console.log('Event:', event)

        await ingress_send_influxdb(writeApi, actor, event)
    }))
    
    await writeApi
        .close()
        .then(() => {
            console.log('FINISHED')
        })
        .catch(e => {
            console.error(e)
            console.log('\\nFinished ERROR')
        })  
}

/**
 * 
 * @param {*} writeApi 
 * @param {*} actor 
 * @param {*} event 
 * https://github.com/influxdata/influxdb-client-js/blob/master/examples/write.js
 */
async function ingress_send_influxdb(writeApi, actor, event){
    const timestamp = moment(event[config.event.timestamp], 'X', false).unix()
    console.log(timestamp)

    const point = new Point('waste')
        .timestamp(Number.isNaN(timestamp) ? undefined : timestamp*1000*1000*1000 + Math.round(Math.random()*1000))
        .floatField('weight', event[config.event.weight])
        .tag('type', event[config.event.wasteType] == undefined ? 'unknown' :  event[config.event.wasteType].toLowerCase())
        .tag('units', event[config.event.weightUnits] == undefined ? 'unknown' : event[config.event.weightUnits].toLowerCase())

        // .stringField('hi', event.Records[0].body)

    // Send data point. This happens async and a final 'await writeApi.close()' will ensure they are all sent.
    writeApi.writePoint(point)
    // await writeApi
    //     .flush()
    //     .then(() => {
    //         console.log('SENT')
    //     })
    //     .catch(e => {
    //         console.error(e)
    //         throw 'Sent ERROR'
    //     })
}