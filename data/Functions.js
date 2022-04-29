const FLAGS = require('./flags.json');
const { toTitleCase } = require('dumfunctions')

class Functions {
    constructor() { }

    color({ client: client, options: options }) {
        client.color = { FLAGS }

        if (options.color) {
            for (const [name, color] of Object.entries(options.color)) {
                client.color[name] = color;
            }
        }

        return client.color;
    }

    config({ client: client, options: options }) {
        client.config = {}

        if (options.config) {
            for (const [key, value] of Object.entries(options.config)) {
                client.config[key] = value;
            }
        }

        return client.config;
    }

    interactionArgs(interaction) {
        let group, sub, options = {};

        if (interaction?.options?._group) group = interaction.options._group;

        if (interaction?.options?._subcommand) sub = interaction.options._subcommand;

        if (interaction?.options?._hoistedOptions) {
            for (const option of interaction.options._hoistedOptions) {
                options[option.name] = option.value;
            }
        }

        return { group, sub, options };
    }

    messageArgs({ message: message, command: command }) {
        let args = {}, seperator = command.seperator || ' ', i = 0;

        for (const argument of command.args) {

            let content = message.content.split(seperator).slice(i + 1);

            if (argument.type == 'number') content = parseInt(content);

            if (argument.type != (typeof content.join(seperator)).toLowerCase()) console.error(new Error());

            if (content.join(seperator) != '') {

                if (argument.content.includes(content[0])) {
                    args[argument.name] = content[0];
                }

                if (argument.content == 'rest') {
                    args[argument.name] = content.join(seperator);
                    break;
                }
                i++
            }
        }

        return args;
    }
}

module.exports = new Functions();