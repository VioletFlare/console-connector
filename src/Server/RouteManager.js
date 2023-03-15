class RouteManager {

    constructor(cache, sessions) {
        this.sessions = sessions;
        this.routes = {};
    }

    registerAction(route, action) {
        this.routes[route] = action;
    }

    _getRouteData(route, data) {
        let response;

        response = new Promise(resolve => {
            if (this.routes[route]) { 
                resolve({
                    data: this.routes[route].call()
                });
            } else {
                resolve({});
            }
        });

        return response;
    }

    callRoute(route, data) {
        let response = {};

        response = this._getRouteData(route, data);
        
        return response;
    }

}

module.exports = RouteManager;