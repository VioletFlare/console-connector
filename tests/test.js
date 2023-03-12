const config = require('../config');
const Discord = require("discord.js");

const ConsoleConnector = require('../src/ConsoleConnector');

class Instance {
    constructor(guild) {
        this.guild = guild;
    }
}

class Test {
    
    constructor() {
        this.client = new Discord.Client({ 
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
            intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES']
        });

        this.sessions = new Map();
        this.consoleConnector = new ConsoleConnector(config, this.sessions);
    }

    _initSessions() {
        if (!this.sessions.size) {
            for (const [guildId, guild] of this.client.guilds.cache.entries()) {
                const instance = new Instance(guild, DAL);
                instance.init();
                this.sessions.set(guildId, instance);
            }
        }
    }

    _initSession(guild) {
        const instance = new Instance(guild, DAL);
        instance.init();
        this.sessions.set(guild.id, instance);
    }

    _setEvents() {
        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}, id ${this.client.user.id}!`);
            
            this._initSessions();
            
            this.consoleConnector.init(this.sessions);
        });

        this.client.on(
            "guildCreate", guild => this._initSession(guild)
        );
    }

    init() {
        this.client.login(config.TOKEN_DEV);

        this._setEvents();
    }

}

new Test().init();
