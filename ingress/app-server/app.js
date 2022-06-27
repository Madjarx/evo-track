const serverless = require('serverless-http');

const { config } = require('./config')
// import KeyStore from './src/keystore.mjs'
// const { KeyStore } = require('./src/keystore.mjs')
const { ingress_send_google_sheets, ingress_send_sqs, ingress_send_sns } = require('./src/ingress')
const { findByIdentity, authorizers } = require('./src/evo-client')
const { Controller } = require('./src/controller')

/**
 * Server for listening for Raspberry Pi data to ingress to a database
 */

const Server = require('./src/server')

class IngressStore {
	async save(actor, usageEvents){
		throw "Not Implemented"
	}
}

class SheetsIngressStore extends IngressStore {
	async save(actor, usageEvents){
		await ingress_send_google_sheets(actor, usageEvents);
	}
}

class AwsSqsIngressStore extends IngressStore {
  async save(actor, usageEvents){
    await ingress_send_sqs(actor, usageEvents);
  }
}

class AwsSnsIngressStore extends IngressStore {
  async save(actor, usageEvents){
    await ingress_send_sns(actor, usageEvents);
  }
}

//////////////////////////////////////////////////////////////////////////

const server = new Server({
  controller: new Controller({
    stores: [
      // new SheetsIngressStore(config.sheets),
      // new AwsSnsIngressStore(),
      new AwsSqsIngressStore(),
    ],
    repos: {
      auth: {
        // findIdentityByHeaders(headers){
        //   return headers['authorization'] // TODO: business logic??
		// }
		    findIdentityByHeaders: authorizers.jwtDecode
      },
      actors: {
        findByIdentity
      },
    },
  }),
  config: config.server,
  middleware: require('./src/middleware'),
  routes: require('./src/routes')
})

server.start(async (port) => {
  console.log(`EvoEco Ingress app listening at http://localhost:${port}`)
})

module.exports.handler = serverless(server.app);