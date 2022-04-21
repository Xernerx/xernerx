const Discord = require('discord.js');
const fs = require('fs')
/**
 * @param {object} Client - Client constructor.
 * @param {Array} intents - these are required in Discord API v9 or higher @required
 * @param {Array} prefix - bot prefix'
 * @param {Array} ownerId - array of ownerId's
 * @param {string} cientId - bot id
 * @param {string} guildId - test server id
 * @param {string} token - bot token
 * @param {boolean} logging - ready logging
 */
class Client extends Discord.Client {
    constructor(options = {}) {
        super(options)

        const {
            intents = [],
            prefix = [],
            ownerId = [],
            clientId = "",
            guildId = "",
            token = "",
            logging = false
        } = options;


        this.intents = typeof intents == 'number' ? intents : console.log(new Error(`Expected intents to be a number, got ${typeof intents} instead.`))

        const client = new Discord.Client({ intents: [intents] })

        this.prefix = Array.isArray(prefix) ? prefix : console.log(new Error(`Expected prefix to be an array, got ${typeof prefix} instead.`));

        this.ownerId = Array.isArray(ownerId) ? ownerId : console.log(new Error(`Expected ownerId to be an array, got ${typeof ownerId} instead.`));

        this.clientId = typeof clientId == 'string' ? clientId : console.log(new Error(`Expected clientId to be a string, got ${typeof clientId} instead.`));

        this.guildId = typeof guildId == 'string' ? guildId : console.log(new Error(`Expected guildId to be a string, got ${typeof guildId} instead.`));

        this.token = typeof token == 'string' ? token : console.log(new Error(`Expected token to be a string, got ${typeof token} instead.`));

        this.logging = typeof logging == 'boolean' ? logging : console.log(new Error(`Expected logging to be a boolean, got ${typeof logging} instead.`))

        client.login(this.token)
            .then(() => {
                if (logging == true) {
                    let log = `[xernerx] ${client.user.username} logged in`;
                    if (prefix.length > 0) log += ` with prefix: [${prefix.join(', ')}]`;
                    if (guildId) log += `, in guild: ${guildId}`
                    console.info(`${log}.`)
                }
                return client;
            })
            .catch(error => {
                throw error
            })
    }
}

module.exports = { Client };