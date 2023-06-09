const Session = require('./Session.js');
const WebSocket = require('ws');

class InstanceManager {
    constructor(config, discordSessions) {
        this.config = config;
        this.discordSessions = discordSessions;
    }

    get(route, data) {
        return this.session.then(session => {
            return session.client.sendRequest(route, data);
        })
    }

    on(route, action) {
        return this.session.then(session => {
            return session.server.registerAction(route, action);
        })
    }

    _setOpenEvent() {
        this.session = new Promise((resolve, reject) => {       
            this.ws.on(
                'open', () => {
                    const session = new Session(this.config, this.ws, this.discordSessions);
                    session.init();
                    resolve(session);
                } 
            );

            this.ws.on(
                'error', () => {
                    console.error("Connection failed to Console Service, retrying...");
                    setTimeout(
                        () => {
                            resolve(this.init())
                        }, 10000
                    );
                }
            );
        });

        return this.session;
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
        return this._setOpenEvent();
    }   
}

module.exports = InstanceManager;