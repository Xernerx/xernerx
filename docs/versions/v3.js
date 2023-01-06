export default {
    info: {
        description: "The third version of Xernerx, coming in with TypeScript support and ESM.",
        deprecated: false,
        versions: [
            "3.1.3",
            "3.1.2",
            "3.1.1",
            "3.1.0",
            "3.0.3",
            "3.0.2",
            "3.0.1",
            "3.0.0"
        ]
    },
    Client: {
        XernerxClient: {
            description: "The Discord.js extended client.",
            properties: [
                { "settings": "The Xernerx Client settings" },
                { "commands": "A collection of your commands" },
                { "cache": "Cache for Xernerx" },
                { "modules": "All the modules used for the handlers" },
                { "util": "Build in util functions on the client" },
                { "handlerOptions": "Options set for any handlers" },
                { "events": "A collection of your events." },
                { "inhibitors": "A collection of your inhibitors" },
                { "config": "Your specified config." }
            ],
            parameters: [{
                name: "discordOptions",
                type: "DiscordOptions",
                default: "{}",
                required: true,
                description: "Options required for Discord.js Client."
            }, {
                name: "clientOptions",
                type: "ClientOptions",
                default: "{}",
                required: true,
                description: "Options required for the Xernerx Client."
            }, {
                name: "config",
                type: "object",
                default: "{}",
                required: false,
                description: "Whether to attach your config to the client."
            }]
        }
    },
    Handlers: {
        CommandHandler: {
            description: "The command handler for all the commands.",
            methods: [{
                name: "loadAllMessageCommands",
                description: "A method to load all message commands.",
                parameters: [{
                    name: "directory",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The directory where the message command files are made."
                }, {

                    name: "prefix",
                    type: "string | Array<string>",
                    default: "[]",
                    required: true,
                    description: "A string, or array of prefixes used to trigger message commands."

                }, {
                    name: "allowMention",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether the client mention should trigger commands or not."
                }, {
                    name: "cooldown",
                    type: "number",
                    default: 0,
                    required: false,
                    description: "A number of milliseconds that a user requires to wait in between command runs."
                }, {
                    name: "userPermissions",
                    type: "Array<Discord#Permissions>",
                    default: "[]",
                    required: false,
                    description: "An array of permissions that the user is required to have in order to use the message commands."
                }, {
                    name: "clientPermissions",
                    type: "Array<Discord#Permissions>",
                    default: "[]",
                    required: false,
                    description: "An array of permissions that the client is required to have in order to execute message commands."
                }, {
                    name: "handleEdits",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether the client should trigger on message edits or not."
                }, {
                    name: "handleDeletes",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether the client should delete the command response on message delete or not."
                }, {
                    name: "logging",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether the client should log when message commands are loaded on ready."
                }]
            }, {
                name: "loadAllSlashCommands",
                description: "A method to load all slash commands.",
                parameters: [{
                    name: "directory",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The directory where the message command files are made."
                }, {

                    name: "guildId",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The guild ID used to locally load commands."

                }, {
                    name: "global",
                    type: "boolean",
                    default: false,
                    required: true,
                    description: "Whether to load all slash commands globally or not."
                }, {
                    name: "cooldown",
                    type: "number",
                    default: 0,
                    required: false,
                    description: "A number of milliseconds that a user requires to wait in between command runs."
                }, {
                    name: "userPermissions",
                    type: "Array<Discord#Permissions>",
                    default: "[]",
                    required: false,
                    description: "An array of permissions that the user is required to have in order to use the message commands."
                }, {
                    name: "clientPermissions",
                    type: "Array<Discord#Permissions>",
                    default: "[]",
                    required: false,
                    description: "An array of permissions that the client is required to have in order to execute message commands."
                }, {
                    name: "defer",
                    type: "Xernerx#DeferOptions",
                    default: false,
                    required: false,
                    description: "Whether to apply defer options on all slash commands."
                }, {
                    name: "logging",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether the client should log when slash commands are loaded on ready."
                }]
            }, {
                name: "loadAllContextCommands",
                description: "A method to load all context commands.",
                parameters: [{
                    name: "directory",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The directory where the message command files are made."
                }, {

                    name: "guildId",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The guild ID used to locally load commands."

                }, {
                    name: "global",
                    type: "boolean",
                    default: false,
                    required: true,
                    description: "Whether to load all context commands globally or not."
                }, {
                    name: "cooldown",
                    type: "number",
                    default: 0,
                    required: false,
                    description: "A number of milliseconds that a user requires to wait in between command runs."
                }, {
                    name: "userPermissions",
                    type: "Array<Discord#Permissions>",
                    default: "[]",
                    required: false,
                    description: "An array of permissions that the user is required to have in order to use the message commands."
                }, {
                    name: "clientPermissions",
                    type: "Array<Discord#Permissions>",
                    default: "[]",
                    required: false,
                    description: "An array of permissions that the client is required to have in order to execute message commands."
                }, {
                    name: "defer",
                    type: "Xernerx#DeferOptions",
                    default: false,
                    required: false,
                    description: "Whether to apply defer options on all context commands."
                }, {
                    name: "logging",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether the client should log when context commands are loaded on ready."
                }]
            }]
        },
        EventHandler: {},
        InhibitorHandler: {},
        WebhookHandler: {}
    },
    Builds: {
        ContextCommand: {},
        Event: {},
        Inhibitor: {},
        MessageCommand: {},
        SlashCommand: {}
    },
    Events: {
        CommandRun: {},
        CommandBlock: {},
        CommandError: {},
        WebhookPost: {},
        WebhookError: {},
    },
    Types: {
        CommandType: {},
        InhibitorType: {},
        EventEmitterType: {}
    },
    Exports: {
        Discord: {
            description: "The latest Discord.js package."
        },
        DumFunctions: {
            description: "A package used for things missing in the javascript language."
        }
    }
}
