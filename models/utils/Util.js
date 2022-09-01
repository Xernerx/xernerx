const { selectMenuPaginator, buttonPaginator, commandName, uptime, reply } = require('./Functions.js');

module.exports = new class Util {
    async messageUtil(message, type) {
        setTimeout(() => {
            if (message.client.messages[message.id] === null || message.client.messages[message.id]) delete message.client.messages[message.id];

            if (message.channel.messages.cache.has(message.id)) message.channel.messages.cache.delete(message.id);
        }, message.client.settings.cacheTime);

        message.util = {
            selectMenuPaginator: (embeds, options) => selectMenuPaginator(message, embeds, options),
            buttonPaginator: (embeds, options) => buttonPaginator(message, embeds, options),
            commandName: (command) => commandName(message, command),
            uptime: (timestamp) => uptime(message, timestamp)
        }

        if (type == "create") {
            message.client.messages[message.id] = null;

            message.util.send = async (e) => {
                const msg = await message.channel.send(e);

                message.client.messages[message.id] = msg.id;

                return msg;
            }

            message.util.reply = async (e) => {
                const msg = await message.reply(e);

                message.client.messages[message.id] = msg.id;

                return msg;
            }

            return;
        }

        if (type == 'edit') {
            if (message.client.messages[message.id] === null) {
                message.util.send = async (e) => {
                    const msg = await message.channel.send(e);

                    message.client.messages[message.id] = msg.id;

                    return msg;
                }

                message.util.reply = async (e) => {
                    const msg = await message.reply(e);

                    message.client.messages[message.id] = msg.id;

                    return msg;
                }

                return;
            }

            else if (message.client.messages[message.id] !== null) {
                const msg = await message.channel.messages.fetch(message.client.messages[message.id]);

                message.util.send = async (e) => {
                    try {
                        return await msg.edit(e);
                    }
                    catch {
                        message.channel.send(e);
                    }
                }

                message.util.reply = async (e) => {
                    try {
                        return await msg.edit(e);
                    }
                    catch {
                        message.reply(e);
                    }
                }

                return;
            }
        }
    }

    interactionUtil(interaction) {
        interaction.util = {
            reply: (text) => reply(interaction, text),
            selectMenuPaginator: (embeds, options) => selectMenuPaginator(interaction, embeds, options),
            buttonPaginator: (embeds, options) => buttonPaginator(interaction, embeds, options),
            commandName: (command) => commandName(interaction, command),
            uptime: (timestamp) => uptime(interaction, timestamp)
        }
    }
}