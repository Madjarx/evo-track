const Promise = require('bluebird')
const _ = require('lodash')

const {MissingDataError} = require('./exceptions')

class Controller { //get this file working again

    constructor({stores, repos}){
        this.stores = stores;
        this.repos = repos;
    }
    
    async authenticate(headers){
        //headers to keystore
        const identity = await this.repos.auth.findIdentityByHeaders(headers);
        // const actor = await this.repos.actors.findByIdentity(identity);
        const actor = identity
        // what should we return??
        return actor;
    }

    async adapt(file){
        //from what they send to what we want
        try{
            let dataFiles = file.data;

            if (!Array.isArray(dataFiles)){
                // if only 1 file is submitted, turn it into an array so that it is iterable
                dataFiles = [dataFiles] 
            }

            let dataFilesString = _.map(dataFiles, dataFile => {
                return dataFile.data.toString();
            })

            return dataFilesString;
        }
        catch (e){
            console.log(e)
            throw new MissingDataError();
        }
    }

    async ingress(actor, usageEvents){
        return Promise.map(this.stores, (store) => store.save(actor, usageEvents))
    }
}

module.exports.Controller = Controller;