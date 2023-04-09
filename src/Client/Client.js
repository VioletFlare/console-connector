const uuidv4 = require('uuid').v4;

class Client {

    constructor(config, ws) {
        this.config = config;
        this.ws = ws;
        this.handlers = {}
    }

    createRequest(uuid, route, data = {}) {
        const request = {
            route: route,
            userAgent: this.config.USER_AGENT,
            type: "REQUEST",
            uuid: uuid,
            data: {
                ...data
            }
        };

        return request;
    }

    sendRequest(route, data = {}) {
        const response = new Promise((resolve, reject) => {
            const uuid = uuidv4();

            this.handlers[uuid] = (data) => {
                const jsonString = data.toString("utf8");
                const response = JSON.parse(jsonString);
    
                const isEmpty = Object.keys(response).length === 0;
    
                if (!isEmpty) {
                    const _handler = this.handlers[response.uuid];
                    const isResponse = response.route && route === response.route;

                    if (_handler && isResponse) {
                        this.ws.off("message", _handler);
                        resolve(response);
                    }
                }
            };

            this.ws.on("message", this.handlers[uuid]);

            const request = this.createRequest(uuid, route, data);

            this.ws.send(JSON.stringify(
                request
            ));
        });

        return response;
    }

}

module.exports = Client;