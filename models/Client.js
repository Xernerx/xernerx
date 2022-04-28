const Discord = require('discord.js');
const { s } = require('@sapphire/shapeshift');
const { ErrorHandler } = require('./handlers/ErrorHandler.js');

/**
 * @param {Array} ownerId - All Id's of the bot owners. 
 * @returns Discord client ready to login.
 */
class Client extends Discord.Client {
    constructor(options = {}) {
        super(options)

        s.object({
            prefix: s.array(s.string).optional,
            ownerId: s.array(s.string).optional,
            guildId: s.string,
            global: s.boolean,
        }).parse(options)

        this.client = new Discord.Client({ intents: [this.options.intents] })

        this.client.prefix = this.options.prefix;

        this.client.ownerId = this.options.ownerId;

        this.client.guildId = this.options.guildId;

        this.client.global = this.options.global;

        this.client.errorHandler = new ErrorHandler(this.client);

        return this.client;
    }
}

module.exports = { Client };