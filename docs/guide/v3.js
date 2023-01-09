export default {
    Setup: {
        Client: {
            description: "To setup the client it isn't hard. Follow the step by step guide.",
            steps: [{
                open: `To initiate your client there is much room for preference. The way I'll show you, is as I intended it to be used and what I recommend.`,
                code: `import XernerxClient from 'xernerx';

                new class Client extends XernerxClient {
                    constructor() {
                        super({}, {}, {})
                    }
                }`,
                close: "If you follow along then this should be your starting code. We'll add any of the code in the following guides to this."
            }, {
                open: "First off we want to set the options required for the Discord.js library.",
                code: `import XernerxClient, { Discord } from 'xernerx';

                new class Client extends XernerxClient {
                    constructor() {
                        super({
                            intents: [
                                Discord.GatewayIntentBits.Guilds 
                            ]
                        }, {}, {})
                    }
                }`,
                close: "The only required setting is 'intents', these are equivalent to rights as we humans have but then for bots. For now I'll continue by using the 'Guilds' intent.",
                note: "If your bot does not have the intent for something it is also not allowed to use this."
            }, {
                open: "This step will set any settings you want for the bot.",
                code: `import XernerxClient, { Discord } from 'xernerx';

                new class Client extends XernerxClient {
                    constructor() {
                        super({
                            intents: [
                                Discord.GatewayIntentBits.Guilds 
                            ]
                        }, {
                            ownerId: ["482513687417061376"], // An array of the owners/developers of this bot
                            logging: true // Whether the bot should log whenever it is ready
                        }, {})
                    }
                }`,
                close: "To keep it simple I will only set my ownerId and logging."
            }, {
                open: "This step is optional, this will set your config to the bot as 'XernerxClient.config'.",
                code: `import XernerxClient, { Discord } from 'xernerx';
                    import yourConfigFile from '*.js'; // import your config file

                    new class Client extends XernerxClient {
                        constructor() {
                            super({
                                intents: [
                                    Discord.GatewayIntentBits.Guilds 
                                ]
                            }, {
                                ownerId: ["482513687417061376"],
                                logging: true
                            }, yourConfigFile) // parse the config name through to this.
                        }
                    }`,
                close: "In a config file you usually put information that will be used over and over or is very confidential, like your bot token.",
                note: "You can also just use a local config object within the file, this is bad practice though!",
                alert: "Watch out with tokens for public views."
            }, {
                open: "The final step. This will require your bot token to be parsed from your config file from the previous step or as a string. In this example I'll continue with the config file.",
                code: `import XernerxClient, { Discord } from 'xernerx';
                    import yourConfigFile from '*.js';

                    new class Client extends XernerxClient {
                        constructor() {
                            super({
                                intents: [
                                    Discord.GatewayIntentBits.Guilds 
                                ]
                            }, {
                                ownerId: ["482513687417061376"],
                                logging: true
                            }, yourConfigFile)
                        }

                        this.register(yourConfigFile.token) // This line will allow the bot token to login.
                    }`,
                close: "If you run the process now, it will start your bot.",
                alert: "Your bot is online but doesn't have any commands yet!",
                note: "You can also make the client a variable and run the Discord.js way with 'client.login('yourToken')'!"
            }]
        },
        "Message commands": {
            description: "This guide will allow you to setup your message commands.",
            steps: [{
                open: "In your existing client class you want to add the following:",
                code: `/* existing code */
                }, yourConfigFile)
            }
            
                this.modules.commandHandler.loadAllMessageCommands() // This is the function used to call the message commands.

                this.register(yourConfigFile.token);
            }`,
                close: "This function is the beginning, however it still requires some options.",
                alert: "In order to use message commands you need the GuildMessages intent."
            }, {
                open: "Start by setting the required options, this being the directory of the commands, and the prefix.",
                code: `/* existing code */
            }, yourConfigFile)
        }
        
            this.modules.commandHandler.loadAllMessageCommands({
                directory: './commands/message' // This can be any directory
                prefix: ["?", "!"] // You can either set an array or a string of prefix(es)
            }) 

            this.register(yourConfigFile.token);
        }`,
                close: "Now that you've set your required settings you can make a message command!",
                alert: "In order to use prefixes you require the MessageContent intent, in order to get around this, set any prefix and add the option allowMention and set it to true."
            }, {
                open: "for the final step you should create a command in the directory you set. In my case I'll make it 'commands/message/ping.js'. Your command should look as followed:",
                code: `import { MessageCommand } from 'xernerx'
                    
                export default class PingCommand extends MessageCommand {
                    constructor() {
                        super('ping', {
                            name: 'ping'
                        })

                        exec(message) {
                            message.util.reply(\`**PONG!**\\nThis took me \\\`\${this.client.ws.ping}ms.\\\`\`)
                        }
                    }
                }`,
                close: "Congratulations! You've successfully made a message command! Go to your server and depending on your intents run '/yourPrefix/ping' or '@bot ping' and it should respond with its ping!"
            }]
        },
        "Slash commands": {},
        "Context commands": {},
        "Events": {},
        "Inhibitors": {},
        "Webhooks": {}
    },
    Methods: {
        "Client.util": {},
        "MessageCommand.util": {},
        "InteractionCommand.util": {}
    }
}