export default {
    info: {
        deprecated: true,
        description: "The first version of Xernerx",
        versions: ["1.2.6"]
    },
    Client: {
        Client: {
            description: "The extended Discord.js client.",
            properties: [{ messages: "The location where messages get saved for message util." }],
            parameters: [{
                name: "intents",
                type: "Discord#Intents",
                default: undefined,
                required: true,
                description: "The intents needed for your client."
            }, {
                name: "partials",
                type: "Discord#Partials",
                default: undefined,
                required: false,
                description: "Discord Partials."
            }, {
                name: "prefix",
                type: "Array<string>",
                default: undefined,
                required: false,
                description: "The prefixes used for message commands."
            }, {
                name: "ownerId",
                type: "Array<string>",
                default: undefined,
                required: false,
                description: "An array of Discord ID's that are considered owner to the client."
            }, {
                name: "guildId",
                type: "string",
                default: undefined,
                required: true,
                description: "The guild ID used for deploying commands locally."
            }, {
                name: "global",
                type: "boolean",
                default: false,
                required: true,
                description: "Whether to deploy the commands globally or locally."
            }, {
                name: "ignoreOwner",
                type: "boolean",
                default: false,
                required: false,
                description: "Whether to ignoreOwner on command validations or not."
            }, {
                name: "defaultCooldown",
                type: "number",
                default: 0,
                required: false,
                description: "The default cooldown in order to use a command."
            }, {
                name: "color",
                type: "object",
                default: "ColorFlags",
                required: false,
                description: "Set colors to the bot in order to use in certain areas."
            }, {
                name: "config",
                type: "object",
                default: "{}",
                required: false,
                description: "Set your config to the client."
            }, {
                name: "logging",
                type: "boolean",
                default: false,
                required: false,
                description: "Whether to log when the client is ready."
            }, {
                name: "cacheTime",
                type: "number",
                default: 300000,
                required: false,
                description: "The time before cached messages will get deleted."
            }]
        }
    },
    Handlers: {
        CommandHandler: {
            description: "The handler for commands.",
            methods: [{
                name: "loadMessageCommands",
                description: "Used to load all message commands.",
                parameters: [{
                    name: "path",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The directory used to store message commands."
                }, {
                    name: "logging",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether to log when message commands are loaded."
                }]
            }, {
                name: "loadInteractionCommands",
                description: "Used to load all slash commands.",
                parameters: [{
                    name: "path",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The directory used to store slash commands."
                }, {
                    name: "logging",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether to log when slash commands are loaded."
                }]
            }, {
                name: "loadContextMenuCommands",
                description: "Used to load all slash commands.",
                parameters: [{
                    name: "path",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The directory used to store context menu commands."
                }, {
                    name: "logging",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether to log when context menu commands are loaded."
                }]
            }]
        },
        EventHandler: {
            description: "The handler for events.",
            methods: [{
                name: "loadEvents",
                description: "Used to load all events.",
                parameters: [{
                    name: "path",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The directory used to store events."
                }, {
                    name: "logging",
                    type: "boolean",
                    default: false,
                    required: false,
                    description: "Whether to log when events are loaded."
                }]
            }]
        }
    },
    Builds: {
        ContextCommand: {},
        Event: {},
        MessageCommand: {},
        InteractionCommand: {}
    },
    Events: {
        CommandRun: {},
        CommandBlock: {},
        CommandError: {}
    },
    Exports: {
        Discord: {},
        DumFunctions: {}
    }
}
