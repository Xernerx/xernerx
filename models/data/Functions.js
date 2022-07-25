const colors = require('./colors.json');

const Cooldown = new Set();
/**
 * @param {object} Functions - Build in functions of the bot hidden away in the handlers/setters.
 */
class Functions {

    /**
     * 
     * @param {object} client - Client object.
     * @param {object} options - Client options.   
     * @returns an object of default colors and custom colors to be imported anywhere without having to import them.
     */
    color({ client: client, options: options }) {
        client.color = { FLAGS: colors }

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
        let args = {}, separator = command.separator || ' ', i = 0;

        if (!command.args) return;

        for (const argument of command.args) {

            let content = message.content.split(separator).slice(i + 1);

            if (content.join(separator) != '') {

                if (argument?.content?.includes(content[0])) {
                    args[argument.name] = content[0];
                }

                else if (argument.type == 'number') {
                    args[argument.name] = parseInt(content[0]);
                }

                else if (argument.type == 'boolean') {
                    if (content[0]?.toLowerCase() != 'true' && content[0]?.toLowerCase() != 'false') content[0] = undefined;
                    args[argument.name] = content[0];
                }

                else if (argument.type == 'user') {
                    let user;
                    try { user = await message.client.users.fetch(content[0].replace(/<@|>/g, "")) } catch (e) { user = e }
                    args[argument.name] = user;
                }

                else if (argument.type == 'member') {
                    let member;
                    try { member = await message.guild.members.fetch(content[0].replace(/<@|>/g, "")) } catch (e) { member = e }
                    args[argument.name] = member;
                }

                else if (argument.type == 'channel') {
                    let channel;
                    try { channel = await message.client.channels.fetch(content[0].replace(/<#|>/g, "")) } catch (e) { channel = e }
                    args[argument.name] = channel;
                }

                else if (argument.type == 'rest') {
                    args[argument.name] = content.join(separator);
                    break;
                }

                else if (argument.prompt) {
                    if (argument.prompt.reply) return message.reply(argument.prompt.reply);
                    else if (argument.prompt.send) return message.channel.send(argument.prompt.send);
                }

                else args[argument.name] = undefined;

                i++
            }

            else args[argument.name] = undefined;
        }

        return args;
    }

    access(event, command, res = false) {
        if ((command.ignoreOwner || event.client.ignoreOwner) && event.client.ownerId.includes((event.user || event.author).id)) return res;

        if (Cooldown.has((event.user || event.author).id)) {
            res = false
            return event.client.emit('commandBlocked', event, "command is on cooldown");
        }

        if (!Cooldown.has((event.user || event.author).id)) {
            Cooldown.add((event.user || event.author).id);

            setTimeout(() => {
                Cooldown.delete((event.user || event.author).id);
            }, command.cooldown || event.client.defaultCooldown || 0)
        }

        if (command.owner && !event.client.ownerId.includes((event.user || event.author).id)) {
            res = true;
            return event.client.emit('commandBlocked', event, "missing ownership")
        }

        if (command.admin && event?.member?.permissions?.has(Discord.Permissions.FLAGS.ADMINISTRATOR) == false) {
            res = true;
            return event.client.emit('commandBlocked', event, "missing admin permission")
        }

        if (command?.channel == "guild" && event?.channel?.type != "GUILD_TEXT") {
            res = true
            return event.client.emit('commandBlocked', event, "not a guild channel");
        }

        if (command?.channel == "dm" && event?.type != null) {
            res = true;
            return event.client.emit('commandBlocked', event, "not a dm channel");
        }

        if (command.inVoice && !event?.member?.voice?.channelId) {
            res = true;
            return event.client.emit('commandBlocked', event, "not a in a voice channel");
        }

        return res;
    }
}

module.exports = new Functions();