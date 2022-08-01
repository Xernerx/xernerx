const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Embed, ButtonBuilder, ButtonStyle } = require('discord.js');
const opts = require('./options.json');

function reply(interaction, text) {
    return (interaction.replied || interaction.deferred) ? interaction.editReply(text) : interaction.reply(text);
}

function selectMenuPaginator(interaction, embeds, options = {}) {
    if (!embeds) return interaction.client.emit('error', interaction, "no embeds");

    if (!Array.isArray(embeds)) return interaction.client.emit('error', interaction, "no array of embeds")

    if (!options.index) {
        options.index = new EmbedBuilder()
            .setTitle(`${embeds.length} pages`)

        embeds.map((embed, i = 0) => options.index.addFields([{ name: embed?.data?.title || embed?.data?.author?.name || "No name", value: embed?.data?.description || `Page ${i + 1}` }]))
    }

    if (!options.row) {
        options.row = new ActionRowBuilder();

        if (!options.id) options.id = `${interaction.id}-menu`;

        options.comp = new SelectMenuBuilder()
            .setCustomId(options.id)
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder('Select a page.')
            .addOptions({ label: 'Index', description: 'Index Page', value: 'index' })

        embeds.map((embed, i = 0) => options.comp.addOptions({ label: embed?.data?.title || embed?.data?.author?.name, description: embed?.data?.description?.slice(0, 100) || `Page ${i + 1}`, value: opts[embeds.indexOf(embed)] }))

        options.row.addComponents(options.comp);
    }

    if (!options.id) options.id = options.row.components[0].data.custom_id;

    (async () => {
        let embed = options.index;

        let m = options.send ? await interaction.channel.send({ embeds: [embed], components: [options.row] }) : await reply(interaction, { embeds: [embed], components: [options.row] })

        interaction.channel.createMessageComponentCollector({ filter: options.filter, time: options.time || 300000 })

            .on('collect', async (a) => {
                if (a.customId != options.id) return;

                let chosen = a.values[0];

                if (chosen === options.row.components[0]?.options[0]?.data?.value) embed = options.index;

                else embed = embeds[opts.indexOf(chosen)];

                a.update({ embeds: [embed] });
            })

            .on('end', async () => {
                if (interaction.editReply) interaction.editReply({ components: [] });

                if (interaction.edit) await m.edit({ components: [] });
            })
    })();
}

function buttonPaginator(interaction, embeds, options = {}) {
    if (!options.buttons) options.buttons = ["⏪", "◀️", "⏹️", "▶️", "⏩"];

    if (options.buttons.length <= 4 || options.buttons.length > 5) throw new Error('Must specify 5 emotes.')

    options.row = new ActionRowBuilder()

    for (const button of options.buttons) {
        options.row
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${interaction.id}-${opts[options.buttons.indexOf(button)]}`)
                    .setStyle(ButtonStyle[options.style || 'Primary'])
                    .setEmoji(button)
            )
    }

    (async () => {
        let embed = embeds[options.index || 0];

        let m = options.send ? await interaction.channel.send({ embeds: [embed], components: [options.row] }) : await reply(interaction, { embeds: [embed], components: [options.row] });

        interaction.channel.createMessageComponentCollector({ filter: options.filter, time: options.time || 300000 })

            .on('collect', async (a) => {
                if (a.customId == `${interaction.id}-one`) {
                    embed = embeds[0];
                    a.update({ embeds: [embed] });
                }

                if (a.customId == `${interaction.id}-two`) {
                    embed = embeds[embeds.indexOf(embed) >= 1 ? embeds.indexOf(embed) - 1 : 0];
                    a.update({ embeds: [embed] });
                }

                if (a.customId == `${interaction.id}-three`) {
                    a.update({ components: [] });
                }

                if (a.customId == `${interaction.id}-four`) {
                    embed = embeds[embeds.indexOf(embed) < embeds.length - 1 ? embeds.indexOf(embed) + 1 : embeds.length - 1];
                    a.update({ embeds: [embed] });
                }

                if (a.customId == `${interaction.id}-five`) {
                    embed = embeds[embeds.length - 1];
                    a.update({ embeds: [embed] });
                }
            })

            .on('end', async () => {
                if (interaction.editReply) interaction.editReply({ components: [] });

                if (interaction.edit) await m.edit({ components: [] });
            })
    })();
}

class Util {
    async messageUtil(message, type) {
        setTimeout(() => {
            if (message.client.messages[message.id] === null || message.client.messages[message.id]) delete message.client.messages[message.id];

            if (message.channel.messages.cache.has(message.id)) message.channel.messages.cache.delete(message.id);
        }, message.client.settings.cacheTime);

        message.util = {};

        message.util.selectMenuPaginator = (embeds, options) => selectMenuPaginator(message, embeds, options);

        message.util.buttonPaginator = (embeds, options) => buttonPaginator(message, embeds, options);

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
                    return await msg.edit(e);
                }

                message.util.reply = async (e) => {
                    return await msg.edit(e);
                }

                return;
            }
        }
    }

    interactionUtil(interaction) {
        interaction.util = {}

        interaction.util.reply = (text) => reply(interaction, text);

        interaction.util.selectMenuPaginator = (embeds, options) => selectMenuPaginator(interaction, embeds, options);

        interaction.util.buttonPaginator = (embeds, options) => buttonPaginator(interaction, embeds, options);
    }
}

u = new Util;

module.exports = {
    messageUtil: u.messageUtil,
    interactionUtil: u.interactionUtil
};