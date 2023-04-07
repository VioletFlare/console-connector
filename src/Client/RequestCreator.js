class RequestCreator {

    constructor(config) {
        this.config = config;
    }

    createRequest(route, data = {}) {
        const request = {
            route: route,
            userAgent: this.config.USER_AGENT,
            type: "REQUEST",
            data: {
                ...data
            }
        }

        return request;
    }

}

module.exports = RequestCreator;