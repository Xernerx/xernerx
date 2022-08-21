const Discord = require('discord.js');
const { s } = require('@sapphire/shapeshift');
const { color, config } = require('./data/Functions.js');
const { CommandHandler } = require('./handlers/CommandHandler.js');
const { EventHandler } = require('./handlers/EventHandler.js');
const { LanguageHandler } = require('./handlers/LanguageHandler.js');
const Loader = require('./handlers/Loader.js');

/**
 * @param {string} guildId - Test guild ID. 
 * @param {boolean} global - Whether the bot should be globally or locally loaded. 
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
            defaultCooldown: s.number.optional,
            logging: s.array(s.string).optional,
            cacheTime: s.number.optional,
            userPermissions: s.array(s.string).optional,
            clientPermissions: s.array(s.string).optional,
            defer: s.object({
                reply: s.boolean.optional,
                ephemeral: s.boolean.optional
            }).optional,
        }).parse(options)

        this.client = new Discord.Client({ intents: [options.intents || 0], partials: [options.partials] });

        this.client.settings = {
            prefix: options.prefix || [],

            ownerId: options.ownerId || [],

            guildId: options.guildId || undefined,

            global: options.global || false,

            ignoreOwner: options.ignoreOwner || false,

            defaultCooldown: options.defaultCooldown || 0,

            logging: options.logging || undefined,

            cacheTime: options.cacheTime || 300000,

            userPermissions: options.userPermissions || [],

            clientPermissions: options.clientPermissions || [],

            defer: {
                reply: options?.defer?.reply === undefined ? null : options?.defer?.reply,
                ephemeral: options?.defer?.ephemeral === undefined ? null : options?.defer?.ephemeral
            },

            language: options.language
        }

        this.client.color = color({ client: this.client, options: options });

        this.client.config = config({ client: this.client, options: options });

        this.client.messages = {};

        this.client.modules = {
            commandHandler: new CommandHandler({ client: this.client }),

            eventHandler: new EventHandler({ client: this.client }),

            languageHandler: new LanguageHandler(this.client),

            loader: new Loader(this.client)
        }

        return this.client;
    }
}

module.exports = { Client };