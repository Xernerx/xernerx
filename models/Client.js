const Discord = require('discord.js');
const { s } = require('@sapphire/shapeshift');
const { color } = require('./utils/Functions.js');
const { CommandHandler } = require('./handlers/CommandHandler.js');
const { EventHandler } = require('./handlers/EventHandler.js');
const { LanguageHandler } = require('./handlers/LanguageHandler.js');
const InhibitorHandler = require('./handlers/InhibitorHandler.js');
const Handler = require('./handlers/Handler.js');

class Client extends Discord.Client {
    constructor(options = {}, settings = {}, i18next = {}, config = {}) {
        super(options)

        this.client = new Discord.Client({ intents: options.intents });

        this.client.settings = s.object({
            guildId: s.string.default(undefined),
            global: s.boolean.default(false),
            prefix: s.array(s.string).default([]),
            mentionPrefix: s.boolean.optional,
            ownerId: s.array(s.string).default([]),
            ignoreOwner: s.boolean.default(false),
            defaultCooldown: s.number.default(0),
            cacheTime: s.number.default(300000),
            userPermissions: s.array(s.string).default([]),
            clientPermissions: s.array(s.string).default([]),
            logging: s.union(s.boolean, s.array(s.string)).default(false),
        }).parse(settings);

        this.client.language = i18next;

        this.client.color = color({ client: this.client, options: settings });

        this.client.config = config;

        this.client.data = {
            messages: {},

            cooldowns: {}
        };

        this.client.modules = {
            commandHandler: new CommandHandler({ client: this.client }),

            eventHandler: new EventHandler({ client: this.client }),

            inhibitorHandler: new InhibitorHandler(this.client),

            languageHandler: new LanguageHandler(this.client)
        }

        this.client.util = {
            handler: new Handler(this.client)
        }

        return this.client;
    }
}

module.exports = { Client };