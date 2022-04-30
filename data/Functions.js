const FLAGS = require('./flags.json');
const { toTitleCase } = require('dumfunctions')

/**
 * @param {object} Functions - Build in functions of the bot hidden away in the handlers/setters.
 */
class Functions {
    constructor() { }

    /**
     * 
     * @param {object} client - Client object.
     * @param {object} options - Client options.   
     * @returns an object of default colors and custom colors to be imported anywhere witout having to import them.
     */
    color({ client: client, options: options }) {
        client.color = { FLAGS }

        if (options.color) {
            for (const [name, color] of Object.entries(options.color)) {
                client.color[name] = color;
            }
        }

        return client.color;
    }

    /**
     * 
     * @param {object} client - Client object.
     * @param {object} options - Client options. 
     * @returns custom config settings for the bot.
     */
    config({ client: client, options: options }) {
        client.config = {}

        if (options.config) {
            for (const [key, value] of Object.entries(options.config)) {
                client.config[key] = value;
            }
        }

        return client.config;
    }

    /**
     * 
     * @param {object} interaction - Interaction event.
     * @returns argument options without having to do the whole builders way.
     */
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

    /**
     * 
     * @param {object} message - Message Object. 
     * @param {object} command - Command Class.
     * @returns argument options without having to make them yourself.
     */
    async messageArgs({ message: message, command: command }) {
        let args = {}, seperator = command.seperator || ' ', i = 0;

        for (const argument of command.args) {

            let content = message.content.split(seperator).slice(i + 1);

            // if (argument.type != (typeof content.join(seperator)).toLowerCase()) console.error(new Error());

            if (content.join(seperator) != '') {

                if (argument?.content?.includes(content[0])) {
                    args[argument.name] = content[0];
                }

                if (argument.type == 'number') {
                    args[argument.name] = parseInt(content[0]);
                }

                if (argument.type == 'boolean') {
                    if (content[0]?.toLowerCase() != 'true' && content[0]?.toLowerCase() != 'false') content[0] = undefined;
                    args[argument.name] = content[0];
                }

                if (argument.type == 'user') {
                    let user = await message.client.users.fetch(content[0].replace(/<@|>/g, ""))
                    args[argument.name] = user;
                }

                if (argument.type == 'member') {
                    let member = await message.guild.members.fetch(content[0].replace(/<@|>/g, ""))
                    args[argument.name] = member;
                }

                if (argument.type == 'channel') {
                    let channel = await message.client.channels.fetch(content[0].replace(/<#|>/g, ""))
                    args[argument.name] = channel;
                }

                if (argument.type == 'rest') {
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