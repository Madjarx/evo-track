const fs = require('fs');
const {google} = require('googleapis');
const Promise = require('bluebird');
const _ = require('lodash');

<<<<<<< HEAD
=======
const { config } = require('./config'); 
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e

/**
 * Ingress data to Google Sheets
 * 
 * @param {Object} event event containing data
 * @param {Array} event.Records messages
 * @param {Object} context context of the Lambda function
 */

<<<<<<< HEAD
exports.handler = async function(event, context) {
=======
async function handler(event, context) {
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
    console.log(JSON.stringify(event))
    // console.log(JSON.stringify(context))

    await Promise.all(event.Records.map(async (record) => {
<<<<<<< HEAD
        var Message, MessageAttributes;

        if (Object.keys(record.messageAttributes).length === 0){
            // SNS -> SQS: the entire message is stuck in the 'body' of the record (SNS is stupid as heck)
            const trueRecord = JSON.parse(record.body);

            ({Message, MessageAttributes} = trueRecord);
        }
        else {
            // SQS: message came from SQS and is normal
            ({body: Message, messageAttributes: MessageAttributes} = record)
        }
=======
        var [Message, MessageAttributes] = toMessage(record);


>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e

        console.log('Message: ', Message);
        console.log('MessageAttributes: ', MessageAttributes)
        
<<<<<<< HEAD
        var actor = {}

        Object.keys(MessageAttributes).forEach(key => {
            // depending on whether the message came from SNS ("Value") or from SQS ("stringValue") 
            actor[key] = MessageAttributes[key].Value? MessageAttributes[key].Value : MessageAttributes[key].stringValue;
        })
=======
        actor = toActor(MessageAttributes)
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e

        console.log('Actor:', actor)

        // throws error 
        try {
            const response = await ingress_send_google_sheets(actor, [JSON.parse(Message)]);
        } catch (e) {
            console.log(e)
            
            // throw error to avoid removing element off queue
            // https://stackoverflow.com/questions/62568596/how-to-prevent-aws-lambda-from-deleting-message-from-sqs-queue
            throw "ERROR: failed to ingress to Google Sheets from SQS"
        }
    }))
    
    return {};
}

<<<<<<< HEAD
function toMessage(){

=======
function toMessage(record){
    var Message, MessageAttributes;

    if (Object.keys(record.messageAttributes).length === 0){
        // SNS -> SQS: the entire message is stuck in the 'body' of the record (SNS is stupid as heck)
        const trueRecord = JSON.parse(record.body);

        ({Message, MessageAttributes} = trueRecord);
    }
    else {
        // SQS: message came from SQS and is normal
        ({body: Message, messageAttributes: MessageAttributes} = record)
    }

    return [Message, MessageAttributes]
}

function toActor(MessageAttributes){
    var actor = {}

    Object.keys(MessageAttributes).forEach(key => {
        // depending on whether the message came from SNS ("Value") or from SQS ("stringValue") 
        actor[key] = MessageAttributes[key].Value? MessageAttributes[key].Value : MessageAttributes[key].stringValue;
    })

    return actor;
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
}


/**
 * Communication with Google Sheets
 * 
 * @param {Object} actor bin object
 * @param {string} actor.org organization attribute
 * @param {string} actor.site site attribute
 * @param {string} actor.cluster cluster attribute
 * @param {string} actor.crt certificate attribute
 * @param {string} actor.SheetsRef certificate attribute
 * @param {string} actor.TableRef certificate attribute
 * @param {Array} usageEvents data to be ingressed
 * 
 * @returns {Object} response from Google
 * 
 * @throws Error when connection to google fails
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
    async function appendUsageEvent(auth, actor, dataPoints){
        const sheets = google.sheets({version: 'v4', auth});
        
        var dataArray = []

        dataPoints.forEach(data => {
            // const data = JSON.parse(dataPoint.toString())

            var dataArrayCurrent = []
            
            Object.keys(data).sort().map(key => {
                dataArrayCurrent.push(data[key])
            })
            
            dataArray.push(dataArrayCurrent);
        });

        const coords = toAppendUsageEventSheetCoordsByactoromerId(actor);

        const params = toAppendUsageEventSheetRequest(coords, dataArray);

        try {
            const response = await sheets.spreadsheets.values.append(params)
            console.log("GOOGLE SHEETS", response.data.updates);
            return response;
        } catch (err) {
            // Handle error.
            console.log(err);
            throw 'ERROR: Entry to Google sheets failed'
        }
    }

    function toAppendUsageEventSheetCoordsByactoromerId(actor){
        return {
<<<<<<< HEAD
            spreadsheetId: actor['SheetsRef'], // TODO: look it up somewhere
            spreadsheetRange: actor['TableRef']
=======
            spreadsheetId: actor[config.actor.GoogleSheetsRef], // TODO: look it up somewhere
            spreadsheetRange: actor[config.actor.GoogleTableRef]
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
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

    // returns response or error
    return res;
<<<<<<< HEAD
}
=======
}

module.exports = {
    handler,
    toMessage,
    toActor,
}
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
