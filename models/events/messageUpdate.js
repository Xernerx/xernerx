const { Event } = require('../commands/Event.js');
const Discord = require('discord.js');
const { messageArgs } = require("./../data/Functions.js");

/**
 * @returns message command executor.
 */
class BuildInMessageUpdateEvent extends Event {
    constructor() {
        super('messageUpdate', {
            name: 'messageUpdate',
            once: false,
        })
    }

    async run(oldMessage, newMessage) {
        if (!oldMessage.author.bot && !newMessage.author.bot) {
            if (!newMessage.client.messages.has(newMessage.id)) return;
            for (const prefix of newMessage.client.prefix) {
                if (!newMessage.content.startsWith(prefix)) continue;

                let command = newMessage.content.replace(prefix, "").split(/ +/).shift().toLowerCase();

                if (!newMessage.client.messageCommands.has(command) || command == '') return;

                command = newMessage.client.messageCommands.get(command);

                command.client = newMessage.client;

                const args = await messageArgs({ message: newMessage, command: command });

                if (access(newMessage, command)) return;

                try {
                    command.exec(newMessage, args);
                }
                catch (error) {
                    newMessage.client.emit("error", newMessage, error);
                }
            }
        }
    }
};

module.exports = BuildInMessageUpdateEvent;