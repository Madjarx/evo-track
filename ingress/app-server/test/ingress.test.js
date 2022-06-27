const fs = require('fs');

var chai = require('chai');
var assert = require('chai').assert;
// var assert = require('assert');

const Promise = global.Promise = require('bluebird');

var {ingress_send_google_sheets, ingress_send_elasticsearch, ingress_send_google_sheets} = require('../src/ingress')

chai.should()

const mockUsage = {
    data:{
        weight: 1,
    },
    id:{
        bin: "1",
        cluster: "2",
        site: "3",
        org: "4",
    }
};

describe('Ingress Testing', function(){
    describe('Ingress to ElasticSearch', function(){
        it('should return true with mock usage', async () => {
            var res = await ingress_send_elasticsearch(mockUsage);
            assert.isTrue(res); // TODO: USE EXCEPTIONS TO INDICATE FAILURE. Append response to a log
        })
    })
    describe('Ingress to Google Sheets', function(){
        it('should return true with mock usage', async () => {
            var res = await ingress_send_google_sheets(mockUsage);
            assert.isTrue(res);
        })
    })
})