const express = require('express')

class Server {

    constructor({controller, config, middleware, routes}){
        this.app = express();
        this.controller = controller;
        this.config = config;
        this.routes = routes;
        this.middleware = middleware;
    }
    
    get port(){
        return this.config.port;
    }

    async start(fn){
        await this.middleware(this)
        await this.routes(this)

        this.app.listen(this.port, async () => {
            console.log(`EvoEco Ingress app listening at http://localhost:${this.port}`)
            await fn(this.port);
        })
    }
}

module.exports = Server; 
