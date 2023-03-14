const Instance = require('./Instance.js');
const WebSocket = require('ws');

class InstanceManager {
    constructor(config, discordSessions) {
        this.config = config;
        this.discordSessions = discordSessions;
    }

    _handleError() {
        console.error("Connection failed to Console Service, retrying...");

        setTimeout(
            () => this.init(), 10000
        );
    }

    _setEvents() {
        this.ws.on(
            'error', () => this._handleError()
        );
    }

    get(route, data) {
        return this.connection.then(connection => {
            return connection.client.sendRequest(route, data);
        })
    }

    on(route, action) {
        return this.connection.then(connection => {
            return connection.server.registerAction(route, action);
        })
    }

    _setOpenEvent() {
        this.connection = new Promise(resolve => {       
            this.ws.on(
                'open', () => {
                    const connection = new Instance(this.config, this.ws, this.discordSessions);
                    connection.init();
                    resolve(connection);
                } 
            );
        });

        return this.connection;
    }

    _setup() {
        this.ws = new WebSocket(
            `ws://${this.config.CONSOLE_SERVICE_CONFIG.host}:${this.config.CONSOLE_SERVICE_CONFIG.port}`, 
            {
                perMessageDeflate: false
            }
        );
    }

    init() {
        this._setup();
        this._setEvents();
        return this._setOpenEvent();
    }   
}

module.exports = InstanceManager;