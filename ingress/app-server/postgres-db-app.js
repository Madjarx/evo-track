const fs = require('fs');
const {google} = require('googleapis');
const Promise = require('bluebird');
const _ = require('lodash');
const fileupload = require('express-fileupload');
const rq = require('request-promise'); // https://www.npmjs.com/package/request-promise#get-something-from-a-json-rest-api
const urljoin = require('url-join')
const moment = require('moment')
const {Client} = require('pg');


const { toMessage, toActor } = require('./google-sheets-app')
const { config } = require('./config'); 
const { strict } = require('assert');


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

    // make a connection to Postgres
    const client = new Client({
        host: config.pg.host,
        port: config.pg.port,
        
        user: config.pg.user,
        password: config.pg.password,

        database: config.pg.database
        // usageEventsbase: 'evo-ingress',
    })
    try{
        await client.connect(); // NOTE: throws error when password incorrect 
    }
    catch (e) {
        console.log(e);
        throw 'Can\'t connect to PostgreSQL';
    }

    await Promise.all(event.Records.map(async (record) => {
        var [Message, MessageAttributes] = toMessage(record);

        console.log('Message: ', Message);
        console.log('MessageAttributes: ', MessageAttributes)

        actor = toActor(MessageAttributes)

        console.log('Actor:', actor)

        // send to postgres
        try {
            res = await ingress_send_postgres(client, actor, JSON.parse(Message) );
        }
        catch (e) {
            console.log('FAILED DEFAULT POSTGRES SEND:')
            console.log(e)
            console.log('CONVERTING HEADERS TO GET A VALID BIN ID:')

            // cluster ID on actor is bad, convert org + site IDs to cluster ID
            try {
                if (! actor[config.actor.site].toString().match('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}')){
                    var binId = await toBinId(client, actor[config.actor.cluster]) // have to try the identifier
                }
                else {
                    var binId = await toBinId(client, actor[config.actor.site].toString(), actor[config.actor.org].toString());
                }

                actor[config.actor.cluster] = binId;

                res = await ingress_send_postgres(client, actor, JSON.parse(Message) );
            }
            catch (e) {
                client.end();

                console.log(e)
                throw 'Failed to convert headers to bin id: headers are bad'
            }   

            client.end();
        }

        client.end();
        
        return
    }))
}

/**
 * Convert siteId and orgId to binId
 * @param {Client} pgClient Postgres Client object
 * @param {String} siteId ID of the site of the bin
 * @param {String} orgId ID of the org of the bin
 * @returns {String} 
 */
async function toBinId(pgClient, siteId, orgId){
    clusterIdCol = "id";
    siteIdCol = "site";
    orgIdCol = "org";

    res = await pgClient.query(`SELECT ${clusterIdCol} FROM "${config.pg.clustersTable}" WHERE "${siteIdCol}"='${siteId}' AND "${orgIdCol}"='${orgId}' LIMIT 1;`);
    
    console.log("GETTING CLUSTER ID", res);

    id = res['rows'][0]['id'];

    return id
}

/**
 * 
 * @param {Client} pgClient Posgres Client
 * @param {String} clusterIdentifier cluster Identifier (different than ID, similar to name)
 */
async function toBinId(pgClient, clusterIdentifier){
    const clusterIdCol = "id";
    const clusterIdentifierCol = "identifier";

    res = await pgClient.query(`SELECT ${clusterIdCol} FROM "${config.pg.clustersTable}" WHERE "${clusterIdentifierCol}"='${clusterIdentifier}' LIMIT 1;`);
    
    console.log("GETTING CLUSTER ID", res);

    id = res['rows'][0]['id'];

    return id
}

/**
 * 
 * @param {Object} actor
 * @param {express-fileupload} file
 */
 async function ingress_send_postgres(pgClient, actor, event){
    const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSSSZZ';
    const eventTimestamp = moment(event[config.event.timestamp], ['X'], false);
    const timestamp = eventTimestamp != "Invalid Date" ? eventTimestamp : moment();

    const mode = event[config.event.wasteType] == undefined ? 'unknown' : event[config.event.wasteType].toLowerCase()

    var event = {
        unit_id: actor[config.actor.cluster],
        timestamp: timestamp.format(dateFormat),
        timezone: timestamp.format('ZZ'),
        mode: config.pg.modes[mode] == undefined ? config.pg.modes.unknown : config.pg.modes[mode],
        change: event[config.event.weight],
        change_units: event[config.event.weightUnits] || 'lb',
        weight: 0,
        weight_units: '',
        scale_mode: 'weight',
        overweight: false,
        ignore: false,
    }

    console.log(event)

    insertRes = await pgClient.query(`INSERT INTO "${config.pg.dataTable}" ("` + Object.keys(event).join(`", "`) + `") VALUES ('`+ Object.values(event).join(`', '`) +`');`)

    selectRes = await pgClient.query(`SELECT * FROM "${config.pg.dataTable}" LIMIT 50`)
    
    // if (selectRes != undefined) console.log("POSTGRES", selectRes.rows) 

    return insertRes
}