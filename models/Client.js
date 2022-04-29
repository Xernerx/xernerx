const Discord = require('discord.js');
const { s } = require('@sapphire/shapeshift');
const { ErrorHandler } = require('./handlers/ErrorHandler.js');
const { color, config } = require('../data/Functions.js');

/**
 * @param {Array} ownerId - All Id's of the bot owners. 
 * @returns Discord client ready to login.
 */
class Client extends Discord.Client {
    constructor(options = {}) {
        super(options)

        s.object({
            // Required
            guildId: s.string,
            global: s.boolean,

            // optionals
            prefix: s.array(s.string).optional,
            ownerId: s.array(s.string).optional,
            ignoreOwner: s.boolean.optional,
            defaultCooldown: s.number.optional
        }).parse(options)

        this.client = new Discord.Client({ intents: [this.options.intents] })

        this.client.errorHandler = new ErrorHandler(this.client);

        this.client.prefix = options.prefix;

        this.client.ownerId = options.ownerId;

        this.client.guildId = options.guildId;

        this.client.global = options.global || false;

        this.client.ignoreOwner = options.ignoreOwner || false;

        this.client.defaultCooldown = options.defaultCooldown || 0;

        this.client.color = color({ client: this.client, options: options });

        this.client.config = config({ client: this.client, options: options });

        return this.client;
    }
}

module.exports = { Client };