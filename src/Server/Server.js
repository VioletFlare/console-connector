const Controller = require("./Controller.js");

class Server {
    constructor(config, ws, discordSessions) {
        this.config = config;
        this.ws = ws;
        this.controller = new Controller(this.cache, discordSessions);
        this.userAgent = this.config.USER_AGENT;
    }

    registerAction(route, action) {
        this.controller.registerAction(route, action);
    }

    _enrichWithOverhead(response) {
        response.userAgent = this.userAgent;

        return response;
    }

    _listenForRequests() {
        this.ws.on("message", (data) => {
            const jsonString = data.toString("utf8");
            const json = JSON.parse(jsonString);

            const isEmpty = Object.keys(json).length === 0;

            if (!isEmpty) {
                const isRequest = json.route;

                if (isRequest) {
                    const route = json.route;
                    const data = json.data;
                    
                    this.controller.callRoute(route, data).then((response) => {
                        response = this._enrichWithOverhead(response)
                        response.calledRoute = route;
    
                        const responseString = JSON.stringify(response);
                        this.ws.send(responseString);
                    });
                }
            }
        });
    }

    init() {
        this._listenForRequests();
    }
}

module.exports = Server;