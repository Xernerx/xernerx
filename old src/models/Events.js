import { GatewayVersion, InteractionType, REST, Routes } from 'discord.js';
import { InteractionCommandUtil, MessageCommandUtil } from '../utils/CommandUtil.js';
import { InteractionArguments, messageArguments } from './CommandArguments.js';
import commandValidation from '../validators/CommandValidations.js';
import { Style } from 'dumfunctions';
import { InhibitorValidation } from '../validators/InhibitorValidations.js';
import User from './XernerxUser.js';
export class MessageCommandEvents {
    client;
    constructor(client) {
        this.client = client;
    }
    messageCreate() {
        this.client.on('messageCreate', async (message) => {
            if (!message.author.bot) {
                let command = undefined, px = undefined;
                message.author = await User(message);
                message.util = new MessageCommandUtil(this.client, message);
                const commands = this.client.commands.message;
                commands
                    .filter((c) => !c.regex)
                    .map(async (cmd) => {
                    if (cmd.prefix) {
                        cmd.prefix.map((prefix) => {
                            if (message.content.startsWith(prefix)) {
                                command = message.content.replace(prefix, '').split(/ +/).shift();
                                px = prefix;
                            }
                        });
                    }
                    if (this.client.handlerOptions.message?.prefix) {
                        const prefix = Array.isArray(this.client.handlerOptions.message.prefix) ? this.client.handlerOptions.message.prefix : [this.client.handlerOptions.message.prefix];
                        prefix.map((prefix) => {
                            if (message.content.startsWith(prefix)) {
                                command = message.content.replace(prefix, '').split(/ +/).shift();
                                px = prefix;
                            }
                        });
                    }
                    if (this.client.handlerOptions.message?.allowMention) {
                        if (message.mentions.users.has(this.client.user?.id) || message.mentions.repliedUser?.id === this.client.user?.id) {
                            command = message.content.replace(`<@${this.client.user?.id}>`, '').trim().split(/ +/).shift();
                            px = 'MentionPrefix';
                        }
                    }
                    const prefix = Array.isArray(this.client.handlerOptions.message?.prefix) ? this.client.handlerOptions.message?.prefix : [this.client.handlerOptions.message?.prefix];
                    if ((cmd.name.toLowerCase() == command?.toLowerCase() || cmd.aliases?.map((c) => c.toLowerCase())?.includes(command?.toLowerCase())) &&
                        (cmd.prefix.includes(px) || prefix?.includes(px) || px === 'MentionPrefix')) {
                        try {
                            if (this.client.handlerOptions.message?.handleTyping)
                                message.channel.sendTyping();
                            const inhibitor = new InhibitorValidation(this.client, message, command);
                            if (commandValidation(message, cmd, this.client))
                                return;
                            if (await inhibitor.inhibit())
                                return;
                            if (cmd.conditions && (await cmd.conditions(message, (await messageArguments(message, cmd)))))
                                return;
                            await cmd.exec(message, (await messageArguments(message, cmd)));
                            this.client.emit('commandRun', message, cmd);
                        }
                        catch (error) {
                            return this.client.emit('commandError', message, error, cmd);
                        }
                    }
                });
            }
        });
    }
    messageUpdate() {
        this.client.on('messageUpdate', async (old, message) => {
            message = message;
            if (!message.author?.bot) {
                let command = undefined, px = undefined;
                message.author = await User(message);
                message.util = new MessageCommandUtil(this.client, message);
                const commands = this.client.commands.message;
                commands
                    .filter((c) => !c.regex)
                    .map(async (cmd) => {
                    if (cmd.prefix) {
                        cmd.prefix.map((prefix) => {
                            if (message?.content?.startsWith(prefix)) {
                                command = message.content.replace(prefix, '').split(/ +/).shift();
                                px = prefix;
                            }
                        });
                    }
                    if (this.client.handlerOptions.message?.prefix) {
                        const prefix = Array.isArray(this.client.handlerOptions.message.prefix) ? this.client.handlerOptions.message.prefix : [this.client.handlerOptions.message.prefix];
                        prefix.map((prefix) => {
                            if (message?.content?.startsWith(prefix)) {
                                command = message.content.replace(prefix, '').split(/ +/).shift();
                                px = prefix;
                            }
                        });
                    }
                    if (this.client.handlerOptions.message?.allowMention) {
                        if (message.mentions.users.has(this.client.user?.id || '') || message.mentions.repliedUser?.id === this.client.user?.id) {
                            command = message?.content?.replace(`<@${this.client.user?.id}>`, '').trim().split(/ +/).shift();
                            px = 'MentionPrefix';
                        }
                    }
                    const prefix = Array.isArray(this.client.handlerOptions.message?.prefix) ? this.client.handlerOptions.message?.prefix : [this.client.handlerOptions.message?.prefix];
                    if ((cmd.name.toLowerCase() == command?.toLowerCase() || cmd.aliases?.map((c) => c.toLowerCase())?.includes(command?.toLowerCase())) &&
                        (cmd.prefix.includes(px) || prefix?.includes(px) || px === 'MentionPrefix')) {
                        try {
                            if (this.client.handlerOptions.message?.handleTyping)
                                message.channel.sendTyping();
                            message = message;
                            const inhibitor = new InhibitorValidation(this.client, message, command);
                            if (commandValidation(message, cmd, this.client))
                                return;
                            if (await inhibitor.inhibit())
                                return;
                            if (cmd.conditions && (await cmd.conditions(message, (await messageArguments(message, cmd)))))
                                return;
                            await cmd.exec(message, (await messageArguments(message, cmd)));
                            this.client.emit('commandRun', message, cmd);
                        }
                        catch (error) {
                            return this.client.emit('commandError', message, error, cmd);
                        }
                    }
                });
            }
        });
    }
    messageDelete() {
        this.client.on('messageDelete', async (message) => {
            if (this.client.cache.messages.has(message.id) && this.client.handlerOptions.message?.handleDeletes) {
                try {
                    if (this.client.handlerOptions.message?.handleTyping)
                        message.channel.sendTyping();
                    message.author = await User(message);
                    const msg = this.client.cache.messages.get(message.id);
                    const response = await message.channel.messages.fetch(msg?.response);
                    await response.delete();
                }
                catch (error) {
                    this.client.emit('commandError', message, error, null);
                }
            }
        });
    }
}
export class SlashCommandEvents {
    client;
    constructor(client) {
        this.client = client;
    }
    slashCreate() {
        this.client.on('interactionCreate', async (interaction) => {
            interaction.util = new InteractionCommandUtil(this.client, interaction);
            interaction.author = await User(interaction);
            if (interaction.type === InteractionType.ApplicationCommand) {
                if (this.client.commands.slash.has(interaction.commandName)) {
                    let command = this.client.commands.slash.get(interaction.commandName);
                    const argumentsInfo = new InteractionArguments(interaction);
                    try {
                        const inhibitor = new InhibitorValidation(this.client, interaction, command);
                        if (await inhibitor.inhibit())
                            return;
                        if (commandValidation(interaction, command, this.client))
                            return;
                        if (command.defer?.reply !== false && this.client.handlerOptions.slash?.defer?.reply)
                            await interaction.deferReply({
                                ephemeral: this.client.handlerOptions.slash?.defer?.ephemeral,
                                fetchReply: this.client.handlerOptions.slash?.defer?.fetchReply,
                            });
                        if (!(interaction.deferred || interaction.replied) && command.defer?.reply)
                            await interaction.deferReply({
                                ephemeral: command.defer?.ephemeral,
                                fetchReply: command.defer?.fetchReply,
                            });
                        if (command.conditions &&
                            (await command.conditions(interaction, {
                                group: argumentsInfo.group(),
                                subcommand: argumentsInfo.subcommand(),
                                args: await argumentsInfo.arguments(),
                            })))
                            return;
                        await command.exec(interaction, {
                            group: argumentsInfo.group(),
                            subcommand: argumentsInfo.subcommand(),
                            args: await argumentsInfo.arguments(),
                        });
                        this.client.emit('commandRun', interaction, command);
                    }
                    catch (error) {
                        this.client.emit('commandError', interaction, error, command);
                    }
                }
            }
        });
    }
}
export class ContextCommandEvents {
    client;
    constructor(client) {
        this.client = client;
    }
    contextCreate() {
        this.client.on('interactionCreate', async (interaction) => {
            interaction.util = new InteractionCommandUtil(this.client, interaction);
            interaction.author = await User(interaction);
            if (interaction.type === InteractionType.ApplicationCommand) {
                if (this.client.commands.context.has(interaction.commandName)) {
                    let command = this.client.commands.context.get(interaction.commandName);
                    try {
                        const inhibitor = new InhibitorValidation(this.client, interaction, command);
                        if (commandValidation(interaction, command, this.client))
                            return;
                        if (await inhibitor.inhibit())
                            return;
                        if (command.conditions && (await command.conditions(interaction)))
                            return;
                        if (command.defer?.reply !== false && this.client.handlerOptions.context?.defer?.reply)
                            await interaction.deferReply({
                                ephemeral: this.client.handlerOptions.context?.defer?.ephemeral,
                                fetchReply: this.client.handlerOptions.context?.defer?.fetchReply,
                            });
                        if (!(interaction.deferred || interaction.replied) && command.defer?.reply)
                            await interaction.deferReply({
                                ephemeral: command.defer?.ephemeral,
                                fetchReply: command.defer?.fetchReply,
                            });
                        let args = {};
                        if (command.type === 3)
                            args = await interaction.channel.messages.fetch(interaction.targetId);
                        if (command.type === 2)
                            args = await this.client.users.fetch(interaction.targetId);
                        await command.exec(interaction, args);
                        this.client.emit('commandRun', interaction, command);
                    }
                    catch (error) {
                        this.client.emit('commandError', interaction, error, command);
                    }
                }
            }
        });
    }
}
export class CommandsDeploy {
    client;
    constructor(client) {
        this.client = client;
    }
    deploy() {
        this.client.once('ready', async (client) => {
            const slashCommands = [], contextCommands = [];
            this.client.commands.context.map((command) => (command.data ? contextCommands.push(command.data.toJSON()) : null));
            this.client.commands.slash.map((command) => (command.data ? slashCommands.push(command.data.toJSON()) : null));
            try {
                const global = {
                    slash: this.client.handlerOptions.slash?.global,
                    context: this.client.handlerOptions.context?.global,
                };
                const guild = {
                    slash: this.client.handlerOptions.slash?.guildId,
                    context: this.client.handlerOptions.context?.guildId,
                };
                if (!guild.slash && !guild.context)
                    return;
                if (global.slash && global.context) {
                    if (guild.slash !== guild.context)
                        console.info(Style.log(`Xernerx | Warning: slash and context commands are both set to global, but don't have a matching guildId, using ${(await this.client.guilds.fetch(this.client.handlerOptions.slash?.guildId)).name}!`, { color: Style.TextColor.Red }));
                    this.put('global', guild.slash, [...contextCommands, ...slashCommands]);
                    this.put('guild', guild.slash, []);
                }
                if (global.slash && global.context === false) {
                    this.put('global', guild.slash, slashCommands);
                }
                if (global.slash === false && global.context) {
                    this.put('global', guild.context, contextCommands);
                }
                if (global.slash === false && global.context === false) {
                    this.put('guild', guild.slash, [...contextCommands, ...slashCommands]);
                }
                if (this.client.handlerOptions.context?.logging || this.client.handlerOptions.slash?.logging)
                    console.info(Style.log(`Xernerx | Deployed ${slashCommands.length} slash commands ${global.slash ? 'globally' : 'locally'} and ${contextCommands.length} context commands ${global.context ? 'globally' : 'locally'}.`, { color: Style.TextColor.Purple }));
            }
            catch (error) {
                console.error(Style.log(`Xernerx | Couldn't deploy interaction commands because <${error}>.`, {
                    color: Style.BackgroundColor.Red,
                }));
            }
        });
    }
    put(type, guild, body) {
        const rest = new REST({ version: GatewayVersion }).setToken(this.client.token);
        if (type === 'guild')
            rest.put(Routes.applicationGuildCommands(this.client.user?.id, guild), { body });
        else
            rest.put(Routes.applicationCommands(this.client.user?.id), { body });
    }
}
