const { Error } = require("../handlers/Error.js");
const { Event } = require('../handlers/Event.js');
const Discord = require('discord.js');
const { messageArgs } = require("../../data/Functions.js");

class BuildInMessageEvent extends Event {
    constructor() {
        super('messageCreate', {
            name: 'messageCreate',
            once: false,
        })
    }

    async run(message) {
        for (const prefix of message.client.prefix) {
            if (!message.content.startsWith(prefix)) continue;

            let command = message.content.replace(prefix, "").split(/ +/).shift().toLowerCase();

            if (!message.client.messageCommands.has(command) || command == '') return;

            command = message.client.messageCommands.get(command);

            command.client = message.client;

            const args = messageArgs({ message: message, command: command });

            try {
                command.exec(message, args);
            }
            catch (error) {
                console.error(error)
            }
        }
    }
};

module.exports = BuildInMessageEvent;