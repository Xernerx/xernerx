const { Error } = require("../handlers/Error.js");
const { Event } = require('../handlers/Event.js');


class BuildInMessageEvent extends Event {
    constructor() {
        super('messageCreate', {
            name: 'messageCreate',
            once: false,
        })
    }

    async run(message) {
        for (const prefix of message.client.prefix) {
            if (!message.content.startsWith(prefix))
                continue;
            let cmd = message.content.replace(prefix, "").split(/ +/).shift().toLowerCase();
            if (cmd == "") return;
            if (!message.client.messageCommands.has(cmd)) return;
            let command = message.client.messageCommands.get(cmd);
            command.client = message.client;
            try {
                const rest = message.content.split(/ +/).slice(1).join(" ");
                command.exec(message, rest);
            }
            catch (error) {
                console.log(error)
                new Error({ error: error });
            }
        }
    }
};

module.exports = BuildInMessageEvent;