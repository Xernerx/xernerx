module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(interaction) {
        if (interaction.isCommand()) {
            if (interaction.client.interactionCommands.has(interaction.commandName)) {
                let command = interaction.client.interactionCommands.get(interaction.commandName);
                command.client = interaction.client;
                command.exec(interaction);
            }
        }
    },
};