const { Event } = require('../commands/Event.js');
const { messageArgs } = require("./../data/Functions.js");

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
                    message.client.emit("error", message, error);
                }
            }
        }
    }
};

module.exports = BuildInMessageEvent;