module.exports = {
    name: 'messageCreate',
    once: false,

    async execute(message) {
        for (const prefix of message.client.prefix) {
            if (!message.content.startsWith(prefix))
                continue;
            let cmd = message.content.replace(prefix, "").split(/ +/).shift().toLowerCase();
            if (cmd == "") return;
            if (!message.client.messageCommands.has(cmd)) return;
            let command = message.client.messageCommands.get(cmd);
            command.client = message.client;
            command.exec(message);
        }
    },
};