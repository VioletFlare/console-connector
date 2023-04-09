const config = require('../config');
const Discord = require("discord.js");

const ConsoleConnector = require('../src/ConsoleConnector');

class Instance {
    constructor(guild) {
        this.guild = guild;
    }

    init() {
        ///
    }
}

class Test {
    
    constructor() {
        this.client = new Discord.Client({ 
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
            intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES']
        });

        this.sessions = new Map();

        this.consoleConnector = new ConsoleConnector({
            CONSOLE_SERVICE_CONFIG: {
                host: config.CONSOLE_SERVICE_CONFIG.host,
                port: config.CONSOLE_SERVICE_CONFIG.port,
            },
            USER_AGENT: "Bot::ConsoleConnectorDev",
            HAS_SERVER: true
        }, this.sessions);
    }

    _initSessions() {
        if (!this.sessions.size) {
            for (const [guildId, guild] of this.client.guilds.cache.entries()) {
                const instance = new Instance(guild);
                instance.init();
                this.sessions.set(guildId, instance);
            }
        }
    }

    _initSession(guild) {
        const instance = new Instance(guild);
        instance.init();
        this.sessions.set(guild.id, instance);
    }

    _setEvents() {
        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}, id ${this.client.user.id}!`);
            
            this._initSessions();

            this.consoleConnector.init().then(() => {
                this.consoleConnector.on('/guilds', () => {
                    const guilds = [];
            
                    this.sessions.forEach(
                        instance => {
                            guilds.push({
                                name: instance.guild.name,
                                id: instance.guild.id
                            })
                        }
                    )
                    
                    const response = {
                        guilds: guilds
                    }
                    
                    return response;
                });
    
                this.consoleConnector.get('/ping').then(response => {
                    console.log('POPULATED ROUTE:')
                    console.log(response)
                });
    
                this.consoleConnector.get('/notexistingroute').then(response => {
                    console.log('NOT POPULATED ROUTE:')
                    console.log(response)
                });
    
                setTimeout(() => {
                    this.consoleConnector.get('/guilds', { source: "Bot::ConsoleConnectorDev" }).then(response => {
                        console.log('GUILDS:')
                        console.log(response)
                    });
                }, 100)
            });


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
