const SessionCache = require('./Common/SessionCache.js');
const Server = require("./Server/Server.js");
const Client = require("./Client/Client.js");

class Session {
    constructor(config, ws, discordSessions) {
        this.config = config;
        this.ws = ws;
        this.sessionCache = new SessionCache();
        this.client = new Client(this.config, this.ws);

        if (config.HAS_SERVER) {
            this.discordSessions = discordSessions;
            this.server = new Server(this.config, this.ws, this.discordSessions);
        }
        
    }

    init() {
        if (this.config.HAS_SERVER) {
            this.server.init();
        }
        
        console.info("Connection established with Console Service!");
    }
}

module.exports = Session;