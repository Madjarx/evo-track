'use strict'

const rq = require('request-promise');
const fs = require('fs');
var jwt = require('jsonwebtoken');
const { spawnSync } = require('child_process');
const pki = require('node-forge').pki; //https://www.npmjs.com/package/node-forge
const moment = require('moment');

<<<<<<< HEAD
const { MissingAuthError, FailedCAAuth, CrtMissingPubKeyError, } = require('./exceptions')
=======
const { MissingAuthError, FailedCAAuth, CrtMissingPubKeyError, RequestTooOld, } = require('./exceptions')
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
const { config } = require('../config'); 
const { crts } = require('../keys/crts')

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


async function base64json(header){
    const string = parseBase64(header);
    const json = JSON.parse(string);
    // TODO: assert validity?
    // TODO: authorize?
    return json;
}


async function mockJWT(headers, decoder){
    return decoder(headers["authorization"]);
}

async function jwtDecode(headers, decoder=null){
    let startTime = moment()

    const authHeader = headers['authorization'];
    
    var token;
    if (authHeader.startsWith('Bearer ')){
        token = authHeader.substring(7, authHeader.length);
    }
    else{
        token = authHeader;
    }

    // console.log(token);

    // const privRSAkey = fs.readFileSync('./keys/ca-client.key').toString('utf-8');
    // const pubRSAcert = fs.readFileSync('./keys/ca-client.crt').toString('utf-8');
    
    // const secret = 'mysecretissecret1234567890itisreallysecureasyoucantell'
    // const payload = {'org': 'MOISHECO', 'site': 'HOUSE', 'cluster': 'ROOM', 'crt': pubRSAcert}

    // const token = token;
    
    var cert;

    try {
        cert = jwt.decode(token)['crt'];
    }    
    catch (e) {
        console.log(e)

        throw new MissingAuthError();
    }

    var crtObj = pki.certificateFromPem(cert);
    var pubKey = crtObj.publicKey
    var pubKeyPem = pki.publicKeyToPem(pubKey);

    console.log('TIME:\tAuthenticate: - get pub key: ', moment().diff(startTime))
    startTime = moment()

    // console.log(crtObj)
    // console.log(pubKeyPem)

    if (pubKey.n.toString(2).length >= 2048){ //pub key number in binary

<<<<<<< HEAD
        const decoded1 = jwt.verify(token, pubKeyPem, { algorithm: 'RS256' });
=======
        const decoded = jwt.verify(token, pubKeyPem, { algorithm: 'RS256' });
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e

        // https://unix.stackexchange.com/questions/16226/how-can-i-verify-ssl-certificates-on-the-command-line
        // const isVerified = spawnSync('./scripts/verifycert.sh', [tmpCrt]).status;

        var caCert;
        var caStore;

        try {
            // caCert = fs.readFileSync('./keys/ca-server.crt').toString()
            caCert = crts.server
            caStore = pki.createCaStore([ caCert ])
        }
        catch (e){
            console.log(e)
            throw "MISSING CA CERT"
        }

        console.log('TIME:\tAuthenticate: - make CA store: ', moment().diff(startTime))
        startTime = moment()

        try {
            // https://stackoverflow.com/questions/48377731/using-node-js-to-verify-a-x509-certificate-with-ca-cert
            pki.verifyCertificateChain(caStore, [crtObj]);

            console.log('TIME:\tAuthenticate: - authenticate pub key: ', moment().diff(startTime))
<<<<<<< HEAD

            return decoded1
=======
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
        }
        catch {
            throw new FailedCAAuth();
        }
<<<<<<< HEAD
=======

        if (moment().unix() - decoded[config.actor.time] < config.headers.maxDelay){
            console.log("Time since request sent:", moment().unix() - decoded[config.actor.time])
            
            return decoded
        }
        else{
            throw new RequestTooOld();
        }
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
    }
    else{
        console.log(pubKeyOutput.stderr.toString())

        throw new CrtMissingPubKeyError();
    }
}

function binder(authorizer, decoder){
    return function(headers){
        return authorizer(headers, decoder);
    }
}

function middleware(pairing){
    return async function(req, res, next){
        try {
            const notsure = await pairing(req.headers)
            
            next(null, notsure);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = {
    findByIdentity,
    decoders: {
        base64json,
    },
    authorizers: {
        mockJWT,
        jwtDecode,
    }
};