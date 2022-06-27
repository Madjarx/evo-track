const fs = require('fs');
const _ = require('lodash');
const rq = require('request-promise'); // https://www.npmjs.com/package/request-promise#get-something-from-a-json-rest-api
const readline = require('readline');
const {google} = require('googleapis');
const Promise = require('bluebird');
const moment = require('moment');
const {Client} = require('pg');
const AWS = require('aws-sdk')
const sqs = new AWS.SQS({region: 'us-east-1', apiVersion: '2012-11-05'})
const sns = new AWS.SNS({region: 'us-east-1', apiVersion: '2010-03-31'})

const { config } = require('../config'); 
const { url } = require('inspector');
const { MissingBearerTokenAttribute } =require('./exceptions')


/**
 * Communication with Elasticsearch
 * Does not worry about request headers
 * 
 * @param {Object} actor
 * @param {express-fileupload} file 
 */
async function ingress_send_elasticsearch (actor, usageEvents){

    // save usageEvents locally /////////////////////////////////////////////
    // let uploadsDir = config.server.uploads_dir;

    // let headersFileName = uploadsDir + file.name.split('.').slice(0,-1).join('.') + '.headers.json';
    // let newFileName = uploadsDir + file.name;

    // await file.mv(newFileName); 
    // await fs.writeFile(headersFileName, JSON.stringify(headers), 'utf8', (err)=>{});
    /////////////////////////////////////////////////////////////////

    
    // send usageEvents to elasticsearch
    var options = {
        method: 'POST',
        uri: config.es.url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${config.es.username}:${config.es.password}`).toString("base64")}` // create auth with base64 encoding
        },
        body: usageEvents,
        json: true, // automatically stringifies the body to JSON
    }

    var res = await rq(options)
        .then((body) => {
            if ( config.db_debugging ) console.log("POST to Elasticsearch SUCCEEDED")
            return true;
        })
        .catch((err) => {
            if ( config.db_debugging ) console.log("ELASTICSEARCH", err)
            if ( config.db_debugging ) console.log("POST to Elasticsearch FAILED")
            return false;
        })

    return res;
}


/**
 * Communication with Google Sheets
 * 
 * @param {Object} actor
 * @param {express-fileupload} file 
 */
async function ingress_send_google_sheets(actor, usageEvents){

    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = 'token.json';

    async function initCreds(){
        const json =  await Promise.fromNode((cb) => fs.readFile("credentials.json", cb));
        const obj = JSON.parse(json);

        return obj;
    }

    async function initClient(){
        const creds = await initCreds();

        const client = await Promise.fromNode((cb) => authorize(creds, cb));

        return client;
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        // console.log(credentials) //DEBUGGING
        const {client_secret, client_id, redirect_uris} = credentials.web;
        // const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(null, oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
            });
        });
    }

    // headers.auth is the owner id
    // make a `Resolver` object
    // postgres will have connection between cutomer ids to sheet ids
 
    /**
     * Appends some usageEvents to my super cool spreadsheet
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     * @param {Object} usage The usage event ingressed
     */
    async function appendUsageEvent(auth, actor, usageEvents){
        const sheets = google.sheets({version: 'v4', auth});
        
        var dataFiles = usageEvents.data;

        if (!Array.isArray(dataFiles)){
            // if only 1 file is submitted, turn it into an array so that it is iterable
            dataFiles = [dataFiles] 
        }

        var dataArray = []

        dataFiles.forEach(file => {
            const data = JSON.parse(file.toString())

            var dataArrayCurrent = []
            
            Object.keys(data).sort().map(key => {
                dataArrayCurrent.push(data[key])
            })
            
            dataArray.push(dataArrayCurrent);
        });

        // let sample_values = [
        //     [
        //         "10",
        //         "10",
        //         "hi",
        //         "yay",
        //         `${Date.now()}`
        //     ],
        // ];

        const coords = toAppendUsageEventSheetCoordsByactoromerId(actor);

        const params = toAppendUsageEventSheetRequest(coords, dataArray);

        try {
            const response = await sheets.spreadsheets.values.append(params)
            console.log("GOOGLE SHEETS", response.data.updates);
            return true;
        } catch (err) {
            // Handle error.
            console.log(err);
            return false;
        }
    }

    function toAppendUsageEventSheetCoordsByactoromerId(actor){
        return {
            spreadsheetId: actor['sheetsRef'], // TODO: look it up somewhere
            spreadsheetRange: actor['reportsTableRef']
        };
    }

    function toAppendUsageEventSheetRequest(coords, usage){
        return {
            // spreadsheetId: "1S7wyDxxeffRIJbpNNKo9LagUf3Z8l_pkPvos221xE5k",
            spreadsheetId: coords.spreadsheetId,
            valueInputOption: "USER_ENTERED",
            includeValuesInResponse: true,
            range: coords.spreadsheetRange, //Sheet1!A1:B3,
            resource: {
                majorDimension: "ROWS",
                values: usage, // TODO: usage will be an object, need to select required items and create and array!!
            }
        }
    }

    //////////////////////////////////////////////////////////////////

    const auth = await initClient();

    const res = await appendUsageEvent(auth, actor, usageEvents);

    return res;
}


/**
 * 
 * @param {Object} actor
 * @param {express-fileupload} file
 */
async function ingress_send_postgres(actor, usageEvents){
    // make a connection to Postgres
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        usageEventsbase: 'evo-ingress',
        password: 'example',
        port: 5432,
    })
    await client.connect() // NOTE: throws error when password in correct 

    var sample_values = {
        Weight: Math.random()*1000,
        WasteType: "Compost"
    }

    client.query(`INSERT INTO "evo-ingress-1" ("Weight", "WasteType") VALUES (\'${usageEvents.Weight}\', \'${usageEvents.WasteType}\');`, (err, res) => {
        console.log("POSTGRES", res)
        client.end
    })

    client.query('SELECT * FROM "evo-ingress-1" LIMIT 50', (err, res) => {
        // console.log(err)
        if (res != undefined) console.log("POSTGRES", res.rows) // Hello world!
        client.end()
    })
}

async function ingress_send_kotlin(actor, usageEvents){
    
}

function getSnsSqsMessageAttributes(actor){
    // const messageAttributesArr = [
    //     config.actor.org,
    //     config.actor.site,
    //     config.actor.cluster,
    //     config.actor.crt,
    //     config.actor.GoogleSheetsRef,
    //     config.actor.GoogleTableRef,
    //     // config.actor.ElasticSearchURL,
    //     config.actor.ElasticSearchIndex,
    // ];
    const messageAttributesArr = Object.values(config.actor)
    let messageAttributesObj = {}

    _.forEach(messageAttributesArr, attr => {
        if (!actor[attr]){
            throw new MissingBearerTokenAttribute(message = 'Missing Bearer Token value: ' + attr)
        }

        let value = typeof actor[attr] == "string" ? actor[attr] : JSON.stringify(actor[attr])

        messageAttributesObj[attr] = {
            DataType: 'String',
            StringValue: value,
        }
    })
    
    console.log(messageAttributesObj)
    
    return messageAttributesObj;
}

/**
 * Send to all SQS channels
 * 
 * @param {Object} actor bin object
 * @param {string} actor.org organization attribute
 * @param {string} actor.site site attribute
 * @param {string} actor.cluster cluster attribute
 * @param {string} actor.crt certificate attribute
 * @param {Array.<String>} usageEvents data to be ingressed
 */

async function ingress_send_sqs(actor, usageEvents){
    let dataFiles = usageEvents;

    await Promise.all(config.sqs.urls.map(async (url) => {
        await Promise.all(dataFiles.map(async (file) => {
            
            // console.log(file.toString())
            console.log(url)

            const messageAttributesObj = getSnsSqsMessageAttributes(actor);

            var params = {
                MessageAttributes: messageAttributesObj,
                MessageBody: file,
                QueueUrl: url,
            };
            
            const data = await Promise
                .fromNode(cb => sqs.sendMessage(params, cb))
                .then(data => console.log('Success', data.MessageId))
                .catch(err => {
                    console.error("Error:", err)
                    throw 'Unable to add to queue'
                })
            }))
        }))
}

/**
 * Send to all SQS channels
 * 
 * @param {Object} actor bin object
 * @param {string} actor.org organization attribute
 * @param {string} actor.site site attribute
 * @param {string} actor.cluster cluster attribute
 * @param {string} actor.crt certificate attribute
 * @param {Array.<String>} usageEvents data to be ingressed
 */

async function ingress_send_sns(actor, usageEvents){
    var startTime = moment()

    await Promise.all(config.sns.arns.map(async (arn) => {
        await Promise.all(usageEvents.map(async (file) => {
            console.log(arn)

            const messageAttributesObj = getSnsSqsMessageAttributes(actor);

            console.log('TIME:\tIngress - make message: ', moment().diff(startTime))
            startTime = moment()

            var params = {
                MessageAttributes: messageAttributesObj,
                Message: file,
                TopicArn: arn,
            };

            const data = await Promise
                .fromNode(cb => sns.publish(params, cb))
                .then(data => console.log('Success', data.MessageId))
                .catch(err => {
                    console.error("Error:", err)
                    throw 'Unable to add to SNS'
                })
            
            console.log('TIME:\tIngress - send message: ', moment().diff(startTime))
        }))
    }))
}

module.exports = {
    ingress_send_elasticsearch,
    ingress_send_google_sheets,
    ingress_send_postgres,
    ingress_send_kotlin,
    ingress_send_sqs,
    ingress_send_sns,
}