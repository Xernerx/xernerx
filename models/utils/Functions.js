const colors = require('../data/colors.json');
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Embed, ButtonBuilder, ButtonStyle } = require('discord.js');
const opts = require('../data/options.json');

function reply(interaction, text) {
    return (interaction.replied || interaction.deferred) ? interaction.editReply(text) : interaction.reply(text);
}

/**
 * @param {object} Functions - Build in functions of the bot hidden away in the handlers/setters.
 */
module.exports = new class Functions {
    /**
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

    reply(interaction, text) {
        return (interaction.replied || interaction.deferred) ? interaction.editReply(text) : interaction.reply(text);
    }

    selectMenuPaginator(interaction, embeds, options = {}) {
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

            if (!options.components) options.components = [];

            let m = options.send ? await interaction.channel.send({ embeds: [embed], components: [options.row, ...options.components] }) : await reply(interaction, { embeds: [embed], components: [options.row, ...options.components] })

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

    commandName(interaction, cmd) {
        if (cmd) {
            let cmds = [];

            for (const commands of Object.values(interaction.client.commands)) {
                let commandInfo = {};

                const command = commands.find(command => command?.data?.name === cmd.toLowerCase() || command?.name === cmd.toLowerCase() || command?.id == cmd.toLowerCase());

                if (command) {
                    if (command?.data?.options?.length > 0) {
                        command?.data?.options?.map(option => {
                            if (!option?.type) {
                                if (option?.options?.length > 0) {
                                    option?.options?.map(opt => {
                                        if (!opt.type) {
                                            commandInfo = {
                                                name: command?.data?.name + " " + option?.name + " " + opt?.name,
                                                description: opt.description,
                                                category: command.category
                                            }

                                            if (!cmds.find(c => c.name === commandInfo.name)) cmds.push(commandInfo);
                                        }

                                        else {
                                            commandInfo = {
                                                name: command?.data?.name + " " + option?.name,
                                                description: option?.description,
                                                category: command.category
                                            }

                                            if (!cmds.find(c => c.name === commandInfo.name)) cmds.push(commandInfo);
                                        }
                                    })
                                }

                                else {
                                    commandInfo = {
                                        name: command?.data?.name + " " + option?.name,
                                        description: option?.description,
                                        category: command.category
                                    }

                                    if (!cmds.find(c => c.name === commandInfo.name)) cmds.push(commandInfo);
                                }
                            }

                            else {
                                commandInfo = {
                                    name: command?.data?.name || command?.name || command?.id,
                                    description: command?.data?.description || command?.description,
                                    category: command.category
                                }

                                if (!cmds.find(c => c.name === commandInfo.name)) cmds.push(commandInfo);
                            }
                        })
                    }

                    else {
                        commandInfo = {
                            name: command?.data?.name || command?.name || command?.id,
                            description: command?.data?.description || command?.description,
                            category: command.category
                        }

                        if (!cmds.find(c => c.name === commandInfo.name)) cmds.push(commandInfo);
                    }
                }
            }
            return cmds;
        }

        if (!cmd) return [interaction?.commandName || interaction.name || interaction.content?.replace(interaction.client.settings.prefix.find(p => interaction.content.startsWith(p)), "").split(/ +/)[0], interaction?.options?._group, interaction?.options?._subcommand].join(' ').replace(/  +/g, " ").trim();
    }

    buttonPaginator(interaction, embeds, options = {}) {
        if (!options.buttons) options.buttons = ["⏪", "◀️", "⏹️", "▶️", "⏩"];

        if (options.buttons.length <= 4 || options.buttons.length > 5) throw new Error('Must specify 5 emotes.');

        options.row = new ActionRowBuilder();

        for (const button of options.buttons) {
            options.row
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${interaction.id}-${opts[options.buttons.indexOf(button)]}`)
                        .setStyle(ButtonStyle[options.style || 'Primary'])
                        .setEmoji(button)
                )
        };

        (async () => {
            let embed = embeds[options.index || 0];

            let m = options.send ? await interaction.channel.send({ embeds: [embed], components: [options.row, ...options.components] }) : await reply(interaction, { embeds: [embed], components: [options.row, ...options.components] });

            const collector = interaction.channel.createMessageComponentCollector({ filter: options.filter, time: options.time || 300000 })

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
                        collector.stop();
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

    uptime(interaction, timestamp) {
        if (!timestamp) timestamp = interaction.client.uptime;
        let totalSeconds = timestamp / 1000;
        let years = Math.floor(totalSeconds / 31536000);
        totalSeconds %= 31536000;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        if (years >= 1) return `${years}y ${days}d ${hours}h ${minutes}m`
        else if (days >= 1) return `${days}d ${hours}h ${minutes}m`;
        else if (hours >= 1) return `${hours}h ${minutes}m`;
        else if (minutes >= 1) return `${minutes}m ${seconds}s`;
        else return `${seconds}s`;
    }
}