export default {
    info: {
        description: "The third version of Xernerx, coming in with TypeScript support and ESM.",
        deprecated: false,
        versions: [
            "3.2.2",
            "3.2.0",
            "3.1.4",
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
            example: `import XernerxClient from 'xernerx';
            
            new class MyClient extends XernerxClient({
                constructor() {
                    super(discordOptions, clientOptions, config)
                }
            });`,
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
            methods: [{
                name: "register",
                description: "Used to register the client to discord.",
                parameters: [{
                    name: "token",
                    type: "string",
                    default: undefined,
                    required: true,
                    description: "The client token"
                }]
            }, {
                name: "loadExtensions",
                description: "Used to load any extensions.",
                parameters: [{
                    name: "options",
                    type: "ExtensionOptions",
                    default: undefined,
                    required: true,
                    description: "Options for the extension handler."
                }]
            }],
            events: [{
                name: "commandRun",
                description: "Custom event for when someone runs a command .",
                parameters: [{
                    name: "interaction",
                    type: "XernerxInteraction",
                    default: "XernerxInteraction",
                    required: false,
                    description: "The interaction or message event."
                }, {
                    name: "command",
                    type: "MessageCommand | ContextCommand | SlashCommand",
                    default: "MessageCommand | ContextCommand | SlashCommand",
                    required: false,
                    description: "The command that triggered the event."
                }]
            }, {
                name: "commandBlock",
                description: "Custom event for when someone is blocked for not having the validations to run the command .",
                parameters: [{
                    name: "interaction",
                    type: "XernerxInteraction",
                    default: "XernerxInteraction",
                    required: false,
                    description: "The interaction or message event."
                }, {
                    name: "command",
                    type: "MessageCommand | ContextCommand | SlashCommand",
                    default: "MessageCommand | ContextCommand | SlashCommand",
                    required: false,
                    description: "The command that triggered the event."
                }]
            }, {
                name: "commandError",
                description: "Custom event for when a command raises an error .",
                parameters: [{
                    name: "interaction",
                    type: "XernerxInteraction",
                    default: "XernerxInteraction",
                    required: false,
                    description: "The interaction or message event."
                }, {
                    name: "error",
                    type: "string",
                    default: "string",
                    required: false,
                    description: "The error raised on the command."
                }, {
                    name: "command",
                    type: "MessageCommand | ContextCommand | SlashCommand",
                    default: "MessageCommand | ContextCommand | SlashCommand",
                    required: false,
                    description: "The command that triggered the event."
                }, {
                    name: "details",
                    type: "string | array | undefined",
                    default: "string | array | undefined",
                    required: false,
                    description: "Any extra details provided"
                }]
            }, {
                name: "webhookPost",
                description: "Custom event for when the top.gg post response is successful ."
                , parameters: [{
                    name: "response",
                    type: "object",
                    default: "object",
                    required: false,
                    description: "The response received from Top.gg."
                }]
            }, {
                name: "webhookError",
                description: "Custom event for when the top.gg post response raises an error."
                , parameters: [{
                    name: "error",
                    type: "object",
                    default: "object",
                    required: false,
                    description: "The error raised."
                }]
            }],
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
                    name: 'options',
                    type: "HandlerOptions#Message",
                    default: "{}",
                    required: true,
                    description: "The message command handler options."
                }]
                //     parameters: [{
                //         name: "directory",
                //         type: "string",
                //         default: undefined,
                //         required: true,
                //         description: "The directory where the message command files are made."
                //     }, {

                //         name: "prefix",
                //         type: "string | Array<string>",
                //         default: "[]",
                //         required: true,
                //         description: "A string, or array of prefixes used to trigger message commands."

                //     }, {
                //         name: "allowMention",
                //         type: "boolean",
                //         default: false,
                //         required: false,
                //         description: "Whether the client mention should trigger commands or not."
                //     }, {
                //         name: "cooldown",
                //         type: "number",
                //         default: 0,
                //         required: false,
                //         description: "A number of milliseconds that a user requires to wait in between command runs."
                //     }, {
                //         name: "userPermissions",
                //         type: "Array<Discord#Permissions>",
                //         default: "[]",
                //         required: false,
                //         description: "An array of permissions that the user is required to have in order to use the message commands."
                //     }, {
                //         name: "clientPermissions",
                //         type: "Array<Discord#Permissions>",
                //         default: "[]",
                //         required: false,
                //         description: "An array of permissions that the client is required to have in order to execute message commands."
                //     }, {
                //         name: "handleEdits",
                //         type: "boolean",
                //         default: false,
                //         required: false,
                //         description: "Whether the client should trigger on message edits or not."
                //     }, {
                //         name: "handleDeletes",
                //         type: "boolean",
                //         default: false,
                //         required: false,
                //         description: "Whether the client should delete the command response on message delete or not."
                //     }, {
                //         name: "logging",
                //         type: "boolean",
                //         default: false,
                //         required: false,
                //         description: "Whether the client should log when message commands are loaded on ready."
                //     }]
            }, {
                name: "loadAllSlashCommands",
                description: "A method to load all slash commands.",
                parameters: [{
                    name: 'options',
                    type: "HandlerOptions#Slash",
                    default: "{}",
                    required: true,
                    description: "The slash command handler options."
                }]
                //     parameters: [{
                //         name: "directory",
                //         type: "string",
                //         default: undefined,
                //         required: true,
                //         description: "The directory where the message command files are made."
                //     }, {

                //         name: "guildId",
                //         type: "string",
                //         default: undefined,
                //         required: true,
                //         description: "The guild ID used to locally load commands."

                //     }, {
                //         name: "global",
                //         type: "boolean",
                //         default: false,
                //         required: true,
                //         description: "Whether to load all slash commands globally or not."
                //     }, {
                //         name: "cooldown",
                //         type: "number",
                //         default: 0,
                //         required: false,
                //         description: "A number of milliseconds that a user requires to wait in between command runs."
                //     }, {
                //         name: "userPermissions",
                //         type: "Array<Discord#Permissions>",
                //         default: "[]",
                //         required: false,
                //         description: "An array of permissions that the user is required to have in order to use the message commands."
                //     }, {
                //         name: "clientPermissions",
                //         type: "Array<Discord#Permissions>",
                //         default: "[]",
                //         required: false,
                //         description: "An array of permissions that the client is required to have in order to execute message commands."
                //     }, {
                //         name: "defer",
                //         type: "Xernerx#DeferOptions",
                //         default: false,
                //         required: false,
                //         description: "Whether to apply defer options on all slash commands."
                //     }, {
                //         name: "logging",
                //         type: "boolean",
                //         default: false,
                //         required: false,
                //         description: "Whether the client should log when slash commands are loaded on ready."
                //     }]
            }, {
                name: "loadAllContextCommands",
                description: "A method to load all context commands.",
                parameters: [{
                    name: 'options',
                    type: "HandlerOptions#Context",
                    default: "{}",
                    required: true,
                    description: "The context command handler options."
                }]
                // parameters: [{
                //     name: "directory",
                //     type: "string",
                //     default: undefined,
                //     required: true,
                //     description: "The directory where the message command files are made."
                // }, {

                //     name: "guildId",
                //     type: "string",
                //     default: undefined,
                //     required: true,
                //     description: "The guild ID used to locally load commands."

                // }, {
                //     name: "global",
                //     type: "boolean",
                //     default: false,
                //     required: true,
                //     description: "Whether to load all context commands globally or not."
                // }, {
                //     name: "cooldown",
                //     type: "number",
                //     default: 0,
                //     required: false,
                //     description: "A number of milliseconds that a user requires to wait in between command runs."
                // }, {
                //     name: "userPermissions",
                //     type: "Array<Discord#Permissions>",
                //     default: "[]",
                //     required: false,
                //     description: "An array of permissions that the user is required to have in order to use the message commands."
                // }, {
                //     name: "clientPermissions",
                //     type: "Array<Discord#Permissions>",
                //     default: "[]",
                //     required: false,
                //     description: "An array of permissions that the client is required to have in order to execute message commands."
                // }, {
                //     name: "defer",
                //     type: "Xernerx#DeferOptions",
                //     default: false,
                //     required: false,
                //     description: "Whether to apply defer options on all context commands."
                // }, {
                //     name: "logging",
                //     type: "boolean",
                //     default: false,
                //     required: false,
                //     description: "Whether the client should log when context commands are loaded on ready."
                // }]
            }]
        },
        EventHandler: {
            description: "The handler for all client or process events.",
            methods: [{
                name: "loadAllEvents",
                description: "A method to load all events.",
                parameters: [{
                    name: 'options',
                    type: "HandlerOptions#Event",
                    default: "{}",
                    required: true,
                    description: "The event handler options."
                }]
                // parameters: [{
                //     name: "directory",
                //     type: "string",
                //     default: undefined,
                //     required: true,
                //     description: "The directory where all event files are saved."
                // }, {
                //     name: "logging",
                //     type: "boolean",
                //     default: false,
                //     required: false,
                //     description: "Whether to log when all events are loaded or not."
                // }]
            }]
        },
        InhibitorHandler: {
            description: "The handler for all inhibitors.",
            methods: [{
                name: "loadAllInhibitors",
                description: "A method to load all inhibitors.",
                parameters: [{
                    name: 'options',
                    type: "HandlerOptions#Inhibitor",
                    default: "{}",
                    required: true,
                    description: "The inhibitor handler options."
                }]
                // parameters: [{
                //     name: "directory",
                //     type: "string",
                //     default: undefined,
                //     required: true,
                //     description: "The directory where all inhibitor files are saved."
                // }, {
                //     name: "logging",
                //     type: "boolean",
                //     default: false,
                //     required: false,
                //     description: "Whether to log when all inhibitors are loaded or not."
                // }]
            }]
        },
        WebhookHandler: {
            description: "The handler for all webhooks.",
            methods: [{
                name: "post",
                description: "A method to post stats to top.gg.",
                parameters: [{
                    name: 'options',
                    type: "HandlerOptions#Webhook",
                    default: "{}",
                    required: true,
                    description: "The webhook handler options."
                }]
                // parameters: [{
                //     name: "token",
                //     type: "string",
                //     default: undefined,
                //     required: true,
                //     description: "The token provided by Top.gg whenever your bot is approved."
                // }, {
                //     name: "logging",
                //     type: "boolean",
                //     default: false,
                //     required: false,
                //     description: "Whether to log when there is a successful or failed response from top.gg."
                // }]
            }, {
                name: "vote",
                description: "A method to handle all vote responses from top.gg [BETA].",
                parameters: [{
                    name: 'options',
                    type: "HandlerOptions#Vote",
                    default: "{}",
                    required: true,
                    description: "The vote handler options."
                }]
                // parameters: [{
                //     name: "token",
                //     type: "string",
                //     default: undefined,
                //     required: true,
                //     description: "The webhook auth token you can make on top.gg when your bot is approved."
                // }]
            }]
        }
    },
    Builders: {
        ContextCommand: {
            description: "The context command builder for context commands.",
            properties: [{ client: "The XernerxClient" }, { data: "The Discord.js Context Command Builder Data." }],
            methods: [{
                name: "conditions",
                description: "Check if any conditions are met before running this command.",
                parameters: [{
                    name: "interaction",
                    type: "XernerxInteraction",
                    default: "XernerxInteraction",
                    required: false,
                    description: "The interaction object."
                }]
            }, {
                name: "exec",
                description: "The executor of the command.",
                parameters: [{
                    name: "interaction",
                    type: "XernerxInteraction",
                    default: "XernerxInteraction",
                    required: false,
                    description: "The interaction object."
                }]
            }],
            parameters: [{
                name: "options",
                type: "ContextCommandOptions",
                default: "ContextCommandOptions",
                required: true,
                description: "The context command options."
            }]
        },
        Event: {
            description: "The event builder for client and process events.",
            properties: [{ client: "The XernerxClient" }],
            methods: [{
                name: "run",
                description: "The executor of the event.",
                parameters: [{
                    name: "...args",
                    type: "any",
                    default: "any",
                    required: false,
                    description: "Any argument supplied by the client. (For custom events checkout the custom events.)"
                }]
            }],
            parameters: [{
                name: "options",
                type: "EventOptions",
                default: "EventOptions",
                required: true,
                description: "The context command options."
            }]
        },
        Inhibitor: {
            description: "The inhibitor builder for inhibitors",
            properties: [{ client: "The XernerxClient" }],
            methods: [{
                name: "check",
                description: "The executor of the inhibitor.",
                parameters: [{
                    name: "interaction",
                    type: "XernerxInteraction | XernerxMessage",
                    default: "XernerxInteraction | XernerxMessage",
                    required: false,
                    description: "The interaction or message"
                }, {
                    name: "...args",
                    type: "any",
                    default: "any",
                    required: false,
                    description: "Any argument supplied by the client. (For the arguments checkout the InhibitorTypes.)"
                }]
            }],
            parameters: [{
                name: "options",
                type: "InhibitorOptions",
                default: "InhibitorOptions",
                required: true,
                description: "The context command options."
            }]
        },
        MessageCommand: {
            description: "The message command builder for message commands.",
            properties: [{ client: "The XernerxClient" }],
            methods: [{
                name: "conditions",
                description: "Check if any conditions are met before running this command.",
                parameters: [{
                    name: "message",
                    type: "XernerxMessage",
                    default: "XernerxMessage",
                    required: false,
                    description: "The message object."
                }, {
                    name: "args",
                    type: "MessageCommandArguments",
                    default: "MessageCommandArguments",
                    required: false,
                    description: "Any argument made by you."
                }]
            }, {
                name: "exec",
                description: "The executor of the command.",
                parameters: [{
                    name: "message",
                    type: "XernerxMessage",
                    default: "XernerxMessage",
                    required: false,
                    description: "The message object."
                }, {
                    name: "args",
                    type: "MessageCommandArguments",
                    default: "MessageCommandArguments",
                    required: false,
                    description: "Any argument made by you."
                }]
            }],
            parameters: [{
                name: "options",
                type: "MessageCommandOptions",
                default: "MessageCommandOptions",
                required: true,
                description: "The message command options."
            }]
        },
        SlashCommand: {
            description: "The slash command builder for slash commands.",
            properties: [{ client: "The XernerxClient" }],
            methods: [{
                name: "conditions",
                description: "Check if any conditions are met before running this command.",
                parameters: [{
                    name: "interaction",
                    type: "XernerxInteraction",
                    default: "XernerxInteraction",
                    required: false,
                    description: "The interaction object."
                }, {
                    name: "options",
                    type: "SlashCommandOptions",
                    default: "SlashCommandOptions",
                    required: false,
                    description: "Any slash command options you made."
                }]
            }, {
                name: "exec",
                description: "The executor of the command.",
                parameters: [{
                    name: "interaction",
                    type: "XernerxInteraction",
                    default: "XernerxInteraction",
                    required: false,
                    description: "The interaction object."
                }, {
                    name: "options",
                    type: "SlashCommandOptions",
                    default: "SlashCommandOptions",
                    required: false,
                    description: "Any slash command options you made."
                }]
            }],
            parameters: [{
                name: "options",
                type: "SlashCommandOptions",
                default: "SlashCommandOptions",
                required: true,
                description: "The slash command options."
            }]
        }
    },
    Types: {
        CommandType: {
            description: "The types of commands",
            types: ["Message", "Slash", "Context", "Event", "Inhibitor", "MessageCommand", "SlashCommand", "ContextCommand"]
        },
        InhibitorType: {
            description: "The types of inhibitors",
            types: ["Member", "User", "Guild", "SlashCommand", "MessageCommand", "ContextCommand", "Command", "Message", "Interaction", "Channel",]
        },
        EventEmitterType: {
            description: "The types of client emitters.",
            types: ["Client", "Rest", "Process"]
        },
        ContextCommandType: {
            description: "The types of context command.",
            types: ["Message", "User"]
        }
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
