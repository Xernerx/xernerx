const Discord = require('discord.js');
const { s } = require('@sapphire/shapeshift');
const { ErrorHandler } = require('./handlers/ErrorHandler.js');
const { color, config } = require('../data/Functions.js');

/**
 * @param {string} guildId - Test guild ID. 
 * @param {boolean} global - Whether the bot shoumd be globally or locally loaded. 
 * @param {string[]} prefix - An array of prefix'. 
 * @param {string[]} ownerId - An array of bot owners. 
 * @param {boolean} ignoreOwner - Whether the bot should ignore owner privileges. 
 * @param {number} defaultCooldown - A cooldown between each command in milliseconds. 
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

        this.client = new Discord.Client({ intents: [this.options.intents] });

        this.client.messages = new Discord.Collection();

        this.client.actions.ErrorCreate = new ErrorHandler('errorCreate', new Error());

        this.client.emit('errorCreate')

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