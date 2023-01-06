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
            example: "",
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
        CommandHandler: {},
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
        CommandError: {}
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
