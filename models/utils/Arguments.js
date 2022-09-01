module.exports = new class Arguments {
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
                options[option.name] = option.channel || option.user || option.role || option.value;
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

            let content = message.content.replace(new RegExp(`${separator}${separator}+`, "g"), separator).split(separator).slice(i + 1);

            if (content.join(separator) != '') {

                if (argument?.content?.includes(content[0])) {
                    args[argument.name] = content[0];
                }

                else if (argument.type == 'string') {
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
                    try { user = await message.client.users.fetch(content[0].replace(/<@!?|>/g, "")) } catch (e) { user = e }
                    args[argument.name] = user;
                }

                else if (argument.type == 'role') {
                    let role;
                    try { role = await message.guild.roles.fetch(content[0].replace(/<@&?|>/g, "")) } catch (e) { role = e }
                    args[argument.name] = role;
                }

                else if (argument.type == 'member') {
                    let member;
                    try { member = await message.guild.members.fetch(content[0].replace(/<@!?|>/g, "")) } catch (e) { member = e }
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
}