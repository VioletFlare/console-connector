const RouteManager = require("./RouteManager.js");

class Server {
    constructor(config, ws, discordSessions) {
        this.config = config;
        this.ws = ws;
        this.routeManager = new RouteManager(this.cache, discordSessions);
        this.userAgent = this.config.USER_AGENT;
    }

    registerAction(route, action) {
        this.routeManager.registerAction(route, action);
    }

    _enrichWithOverhead(response) {
        response.userAgent = this.userAgent;
        response.type = "RESPONSE";

        return response;
    }

    _listenForRequests() {
        this.ws.on("message", (data) => {
            const jsonString = data.toString("utf8");
            const json = JSON.parse(jsonString);

            const isEmpty = Object.keys(json).length === 0;

            if (!isEmpty) {
                const isRequest = json.route && json.type !== "RESPONSE";

                if (isRequest) {
                    const route = json.route;
                    
                    this.routeManager.callRoute(route, json).then((response) => {
                        response = this._enrichWithOverhead(response)
                        response.route = route;
    
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