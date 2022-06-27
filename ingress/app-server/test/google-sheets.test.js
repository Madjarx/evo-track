const fs = require('fs');

var chai = require('chai');
chai.should()
var assert = require('chai').assert;
// var assert = require('assert');

var { event } = require('./resources/sqs-event');
var { context } = require('./resources/sqs-context');
var sns_event = require('./resources/sns-sqs-event').event;
const google_sheets_function = require('../google-sheets-app').handler

describe('Google Sheets Lambda Function Testing', () => {
    it('SQS message', async () => {
        var res = await google_sheets_function(event, context);
        // assert.isTrue(true); // TODO: USE EXCEPTIONS TO INDICATE FAILURE. Append response to a log
    })
    it('SNS -> SQS message', async () => {
        var res = await google_sheets_function(sns_event, context);
        // assert.isTrue(true); // TODO: USE EXCEPTIONS TO INDICATE FAILURE. Append response to a log
    })
})