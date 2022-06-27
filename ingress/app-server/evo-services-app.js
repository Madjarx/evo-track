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
    
}

/**
 * Call Kotlin server to get Google Sheets credentials
 * 
 * @param {{org, site, cluster}} identity 
 */
 async function findByIdentity(identity){
    console.log(identity)
    console.log("URI: ", `http://localhost:8080/api/v1/reports/orgs/${ identity['org'] }/sites/${ identity['site'] }/clusters/${ identity['cluster'] }`,)

    var options = {
        method: 'GET',
        uri: `http://localhost:8080/api/v1/reports/orgs/${ identity['org'] }/sites/${ identity['site'] }/clusters/${ identity['cluster'] }`,
        headers: {
            // 'Content-Type': 'application/json',
            // 'Authorization': `Basic ${Buffer.from(`${config.db.es_username}:${config.db.es_password}`).toString("base64")}` // create auth with base64 encoding
        },
        json: true, // automatically stringifies the body to JSON
        body: {},
    }

    // try catch
    var sheetsRef = await rq(options)
        .then((body) => {
            // console.log('KOTLIN APP: Successfully got cluster:', body)
            return body['sheetsRef']
        })
        .catch((err) => {
            if ( config.db_debugging ) console.log("KOTLIN APP", err)
            return null;
        })

    identity['sheetsRef'] = sheetsRef;
    identity['reportsTableRef'] = 'RawData';

    console.log(identity)
    
    return identity;
}