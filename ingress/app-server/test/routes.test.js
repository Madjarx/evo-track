const fs = require('fs');

var assert = require('assert');
var chai = require('chai')
var chaiHttp = require('chai-http');

// var {app} = require('../app')
const app = "http://localhost:3000"

chai.use(chaiHttp);
chai.should()

describe('Requests testing', function(){
    describe('/', function(){
        it('GET == 200, text/plain', () => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.text; //change response to be text/plain
                });
        })
    })
    describe("/ingress", () => {
        it('GET != 200', () => 
            chai.request(app)
                .get('/ingress')
                .end((err, res) => 
                    res.should.not.have.status(200)
                )
        )
        it('without file -> POST == 401', () => {
            chai.request(app)
                .post('/ingress')
                .end((err, res) => {
                    res.should.have.status(401);
                })
        })
        it('without auth -> POST == 401 ', () => {
            chai.request(app)
                .post('/ingress')
                .attach('data', fs.readFileSync('./uploads/hi.json'), 'hi.json')
                .end((err, res) => {
                    res.should.have.status(401);
                })
        })
        it('bad token -> POST == 401', ()=> {
            chai.request(app)
                .post('/ingress')
                .set('Authorization', fs.readFileSync('./keys/token_bad_crt').toString())
                .attach('data', fs.readFileSync('./uploads/hi.json'), 'hi.json')
                .end((err, res) =>{
                    res.should.have.status(401);
                })
        })
        it('POST == 201', () => {
            chai.request(app)
                .post('/ingress')
                .set('Authorization', fs.readFileSync('./keys/token_g_sheets').toString())
                // .set('Authorization', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmciOiJNT0lTSEVDTyIsInNpdGUiOiJIT1VTRSIsImNsdXN0ZXIiOiJST09NIn0.FVAFd3tW3AJH__-dDi_g7fw-h-agYLLUuW05kk5NcAo')
                // .set('Authorization', '{"org":"MOISHECO", "site":"HOUSE", "cluster":"ROOM"}')
                // .set('Authorization', 'HOMEKIT_US_WA_SEA_KMAN_1')
                .attach('data', fs.readFileSync('./uploads/hi.json'), 'hi.json')
                .end((err, res) =>{
                    res.should.have.status(201);
                })
        })
    })
})