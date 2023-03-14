class RequestCreator {

    constructor(config) {
        this.config = config;
    }

    createRequest(route, data = {}) {
        const request = {
            route: route,
            data: {
                userAgent: this.USER_AGENT,
                ...data
            }
        }

        return request;
    }

}

module.exports = RequestCreator;