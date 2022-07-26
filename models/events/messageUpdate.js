const { Event } = require('../commands/Event.js');
const { messageArgs, access, messageEdit } = require("./../data/Functions.js");

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

        await messageEdit(newMessage, "edit");

        if (!oldMessage.author.bot && !newMessage.author.bot) {

            if (!newMessage.client.messages[newMessage.id] == undefined) return;

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

                    return newMessage.client.emit('commandRun', newMessage, 'message', command);
                }
                catch (error) {
                    newMessage.client.emit("error", newMessage, error);
                }
            }
        }
    }
};

module.exports = BuildInMessageUpdateEvent;