const { Event } = require('../handlers/Event.js');
const Discord = require('discord.js');
const { messageArgs } = require("../../data/Functions.js");
const { ErrorHandler } = require("../handlers/ErrorHandler.js");

/**
 * @returns message command executor.
 */
class BuildInMessageEvent extends Event {
    constructor() {
        super('messageCreate', {
            name: 'messageCreate',
            once: false,
        })
    }

    async run(message) {
        if (!message.author.bot) {
            message.client.messages.set(message.id, null)
            setTimeout(() => message.client.messages.delete(message.id), 300000)

            for (const prefix of message.client.prefix) {
                if (!message.content.startsWith(prefix)) continue;

                let command = message.content.replace(prefix, "").split(/ +/).shift().toLowerCase();

                if (!message.client.messageCommands.has(command) || command == '') return;

                command = message.client.messageCommands.get(command);

                command.client = message.client;

                const args = await messageArgs({ message: message, command: command });

                try {
                    await command.exec(message, args);
                }
                catch (error) {
                    this.onError(error)
                }
            }
        }
    }

    onError(error) {
        console.log(error)
    }
};

module.exports = BuildInMessageEvent;