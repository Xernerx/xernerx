const { Event } = require('../commands/Event.js');
const { messageArgs } = require("./../utils/Arguments.js");
const { commandValidation } = require('./../utils/CommandValidation.js');
const { messageUtil } = require('../utils/Util.js');
const { inhibitorsValidation } = require('../utils/InhibitorsValidation.js');

/**
 * @returns message command executor.
 */
class BuildInMessageEvent extends Event {
    constructor() {
        super('messageCreate', {
            name: 'messageCreate',
            type: 'client',
            once: false,
        })
    }

    async run(message) {
        if (!message.author.bot) {
            await messageUtil(message, "create");

            let commands = message.client.commands.message;

            commands.filter(c => c.regex).map(async command => {
                let regex = command.regex.split(/\//).slice(1);

                regex = RegExp(...regex);

                if (message.content.match(regex)) {
                    try {
                        if (command.conditions && (await command.conditions(message))) return;

                        return await command.exec(message);
                    }
                    catch (error) {
                        message.client.emit("error", message, error);
                    }
                };
            })

            if (message?.client?.settings?.prefix?.length <= 0) return;

            commands.filter(c => !c.regex).map(async command => {
                command?.prefix?.map(prefix => {
                    this.commandCheck(message, prefix, command);
                })

                message.client.settings.prefix.map(prefix => {
                    this.commandCheck(message, prefix, command);
                });
            })
        }
    }

    async commandCheck(message, prefix, command) {
        for (const alias of command.aliases) {
            if (message.content.split(/ +/)[0] !== prefix + alias) continue;

            if (await inhibitorsValidation(message, command)) break;

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

module.exports = BuildInMessageEvent;