const { Event } = require('../commands/Event.js');
const { messageArgs } = require("./../utils/Arguments.js");
const { commandValidation } = require('./../utils/CommandValidation.js');
const { messageUtil } = require('../utils/Util.js');
const { inhibitorsValidation } = require('../utils/InhibitorsValidation.js');

/**
 * @returns message command executor.
 */
class BuildInMessageUpdateEvent extends Event {
    constructor() {
        super('messageUpdate', {
            name: 'messageUpdate',
            type: 'client',
            once: false,
        })
    }

    async run(oldMessage, newMessage) {
        if (!oldMessage.author.bot && !newMessage.author.bot) {
            await messageUtil(newMessage, "edit");

            let commands = newMessage.client.commands.message;

            commands.filter(c => c.regex).map(async command => {
                let regex = command.regex.split(/\//).slice(1);

                regex = RegExp(...regex);

                if (newMessage.content.match(regex)) {
                    try {
                        if (command.conditions && (await command.conditions(newMessage))) return;

                        return await command.exec(newMessage);
                    }
                    catch (error) {
                        newMessage.client.emit("error", newMessage, error);
                    }
                };
            })

            if (newMessage?.client?.settings?.prefix?.length <= 0) return;

            if (!newMessage.client.data.messages[newMessage.id] === undefined) return;

            commands.filter(c => !c.regex).map(async command => {
                command?.prefix?.map(prefix => {
                    this.commandCheck(newMessage, prefix, command);
                })

                newMessage.client.settings.prefix.map(prefix => {
                    this.commandCheck(newMessage, prefix, command);
                });
            })
        }
    }

    async commandCheck(message, prefix, command) {
        for (const alias of command.aliases) {
            if (message.content.split(/ +/)[0] !== prefix + alias) continue;

            if (inhibitorsValidation(message, command)) break;

            const args = await messageArgs({ message: message, command: command });

            if (commandValidation(message, command)) break;

            try {
                if (command.conditions && (await command.conditions(message, args))) break;

                await command.exec(message, args);

                return message.client.emit('commandRun', message, 'message', command);
            }
            catch (error) {
                message.client.emit("error", message, error);
                break;
            }
        }
    }
};

module.exports = BuildInMessageUpdateEvent;