import { z } from 'zod';
import * as path from 'path';
import { GatewayIntentBits } from 'discord.js';

import XernerxClient from '../client/XernerxClient.js';
import { ContextHandlerOptions, MessageHandlerOptions, SlashHandlerOptions } from '../types/interfaces.js';
import Handler from './Handler.js';
import { XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import MessageUtil from '../utils/MessageUtil.js';
import ContextCommandBuilder from '../build/ContextCommandBuilder.js';
import MessageCommandBuilder from '../build/MessageCommandBuilder.js';
import SlashCommandBuilder from '../build/SlashCommandBuilder.js';
import { FileType } from '../types/types.js';
import { xernerxUser } from '../functions/xernerxUser.js';
import InteractionUtil from '../utils/InteractionUtil.js';
import reload from '../functions/reload.js';
import commandValidation from '../validators/commandValidation.js';
import XernerxLog from '../tools/XernerxLog.js';
import { interactionArguments, messageArguments } from '../models/Arguments.js';
import deploy from '../functions/deploy.js';
import { inhibitorValidation } from '../validators/inhibitorValidations.js';

export default class CommandHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }

    public loadMessageCommands(options: MessageHandlerOptions) {
        if (!this.client.options.intents.has(GatewayIntentBits.MessageContent)) new XernerxLog(this.client).warn(`Message commands might not work as you're missing the intent MessageContent!`);
        if (!this.client.options.intents.has(GatewayIntentBits.GuildMessages)) new XernerxLog(this.client).warn(`Message commands might not work as you're missing the intent GuildMessages!`);

        options = z
            .object({
                directory: z.string(),
                prefix: z.string().or(z.array(z.string())),
                allowMention: z.boolean().default(false),
                cooldown: z.number().default(0),
                permissions: z
                    .object({
                        user: z.array(z.string()).default([]),
                        client: z.array(z.string()).default([]),
                        dm: z.boolean().default(true),
                    })
                    .default({}),
                handleEdits: z.boolean().default(false),
                handleDeletes: z.boolean().default(false),
                handleTyping: z.boolean().default(false),
                logging: z.boolean().default(false),
            })
            .parse(options);

        this.client.modules.options.message = options;

        const files = this.readdir(options.directory);

        for (const file of files) {
            const filePath = `${path.resolve(options.directory)}\\${file}`;

            this.load(filePath, 'MessageCommand');
        }

        new XernerxLog(this.client).info(`Loaded Message Commands.`);

        this.emit({
            name: 'messageCreate',
            fileType: 'MessageCommand',
            run: (message: XernerxMessage) => this.messageCommandRun(message),
        });

        this.emit({
            name: 'messageUpdate',
            fileType: 'MessageCommand',
            run: (message: XernerxMessage, message2: XernerxMessage) => this.messageCommandRun(message, message2),
        });

        this.emit({
            name: 'messageDelete',
            fileType: 'MessageCommand',
            run: (message: XernerxMessage) => this.messageCommandRun(message, 'delete'),
        });
    }

    // public reloadMessageCommands() {
    //     return reload(this.client, 'message');
    // }

    public loadSlashCommands(options: SlashHandlerOptions) {
        options = z
            .object({
                directory: z.string(),
                cooldown: z.number().default(0),
                permissions: z
                    .object({
                        user: z.array(z.string()).default([]),
                        client: z.array(z.string()).default([]),
                        dm: z.boolean().default(true),
                    })
                    .default({}),
                logging: z.boolean().default(false),
                defer: z
                    .object({
                        reply: z.boolean().default(false),
                        ephemeral: z.boolean().default(false),
                        fetchReply: z.boolean().default(false),
                    })
                    .default({}),
            })
            .parse(options);

        this.client.modules.options.slash = options;

        const files = this.readdir(options.directory);

        for (const file of files) {
            const filePath = `${path.resolve(options.directory)}\\${file}`;

            this.load(filePath, 'SlashCommand');
        }

        new XernerxLog(this.client).info(`Loaded Slash Commands.`);

        deploy(this.client, 'slash');

        this.emit({
            name: 'interactionCreate',
            fileType: 'SlashCommand',
            run: (interaction: XernerxSlashInteraction) => this.slashCommandRun(interaction),
        });
    }
    public loadContextCommands(options: ContextHandlerOptions) {
        options = z
            .object({
                directory: z.string(),
                cooldown: z.number().default(0),
                permissions: z
                    .object({
                        user: z.array(z.string()).default([]),
                        client: z.array(z.string()).default([]),
                        dm: z.boolean().default(true),
                    })
                    .default({}),
                logging: z.boolean().default(false),
                defer: z
                    .object({
                        reply: z.boolean().default(false),
                        ephemeral: z.boolean().default(false),
                        fetchReply: z.boolean().default(false),
                    })
                    .default({}),
            })
            .parse(options);

        this.client.modules.options.context = options;

        const files = this.readdir(options.directory);

        for (const file of files) {
            const filePath = `${path.resolve(options.directory)}\\${file}`;

            this.load(filePath, 'ContextCommand');
        }

        new XernerxLog(this.client).info(`Loaded Context Commands.`);

        deploy(this.client, 'context');

        this.emit({
            name: 'interactionCreate',
            fileType: 'ContextCommand',
            run: (interaction: XernerxMessageContextInteraction | XernerxUserContextInteraction) => this.contextCommandRun(interaction),
        });
    }

    private async messageCommandRun<T extends XernerxMessage>(message: T, message2?: T | 'delete') {
        if (message.author.bot) return;

        message.util = new MessageUtil(this.client, message);

        message.user = await xernerxUser(message, this.client);

        if (typeof message2 === 'object') message = message2;

        if (message2 === 'delete') {
            if (!this.client.cache.messages.has(message.id)) return;

            const id = this.client.cache.messages.get(message.id);

            if (!id) return;

            (async () => {
                const msg = await message.channel.messages.fetch(id);

                await msg.delete();

                this.client.cache.messages.delete(message.id);
            })();

            return;
        }

        if (message.content && this.client.modules.options.message) {
            const commands = this.client.commands.message;

            const prefixes = Array.isArray(this.client.modules.options.message.prefix) ? this.client.modules.options.message.prefix : [this.client.modules.options.message.prefix];

            let commandName: string | undefined,
                cmd,
                alias: string | null = null;

            commands.map((command) => {
                let prefix: string | null = null;

                if (command.regex && message.content.match(command.regex)) {
                    const [match] = message.content.match(command.regex) || [null];

                    if (match) commandName = command.name;
                }

                const cp = Array.isArray(command.prefix) ? command.prefix : [command.prefix as string];

                prefixes.map((p) => {
                    if (message.content.startsWith(p)) prefix = p;
                });

                cp.map((p) => {
                    if (message.content.startsWith(p)) prefix = p;
                });

                if (!prefix) return;

                if (!commandName)
                    commandName =
                        message.content
                            .replace(prefix, '')
                            .split(command.separator || / +/)
                            .shift()
                            ?.trim()
                            ?.toLowerCase() || '';

                if (!this.client.commands.message.has(commandName) && command.aliases?.includes(commandName)) {
                    alias = commandName;

                    commandName = command.name;
                }
            });

            if (!cmd && this.client.modules.options.message.allowMention) {
                if (message.mentions.users.has(this.client.user?.id as string) || message.mentions.repliedUser?.id === this.client.user?.id) {
                    commandName = message.content.replace(`<@${this.client.user?.id}>`, '').trim().split(/ +/).shift()?.toLowerCase();
                }
            }

            if (!commandName) commandName = '';

            if (this.client.commands.message.has(commandName)) cmd = this.client.commands.message.get(commandName);

            if (await inhibitorValidation(message, cmd)) return;

            if (!cmd) return this.client.emit('commandNotFound');

            (message.util as MessageUtil).alias = alias === commandName ? null : alias;

            this.exec(cmd, message, await messageArguments(message, cmd), 'MessageCommand');
        }
    }

    private async slashCommandRun(interaction: XernerxSlashInteraction) {
        interaction.util = new InteractionUtil(this.client, interaction);

        interaction.user = await xernerxUser(interaction, this.client);

        let cmd;

        if (this.client.commands.slash.has(interaction.commandName)) cmd = this.client.commands.slash.get(interaction.commandName);

        if (await inhibitorValidation(interaction, cmd)) return;

        if (!cmd) return this.client.emit('commandNotFound', interaction);

        this.exec(cmd as unknown as SlashCommandBuilder, interaction, await interactionArguments(interaction, cmd), 'SlashCommand');
    }

    private async contextCommandRun(interaction: XernerxUserContextInteraction | XernerxMessageContextInteraction) {
        interaction.util = new InteractionUtil(this.client, interaction);

        interaction.user = await xernerxUser(interaction as XernerxUserContextInteraction, this.client);

        let cmd;

        if (this.client.commands.context.has(interaction.commandName)) cmd = this.client.commands.context.get(interaction.commandName);

        if (await inhibitorValidation(interaction, cmd)) return;

        if (!cmd) return this.client.emit('commandNotFound', interaction);

        this.exec(cmd as unknown as SlashCommandBuilder, interaction, await interactionArguments(interaction, cmd), 'ContextCommand');
    }

    private async exec(
        cmd: MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder,
        event: XernerxMessage | XernerxSlashInteraction | XernerxMessageContextInteraction | XernerxUserContextInteraction,
        args: any,
        type: FileType
    ) {
        try {
            if (await commandValidation(event, cmd)) return;

            if (((cmd as MessageCommandBuilder).conditions as unknown) && (await ((cmd as MessageCommandBuilder).conditions(event as never, args) as unknown))) return;

            cmd.exec(event as never, args);

            this.client.emit('commandExecute', event, type);
        } catch (error) {
            new XernerxLog(this.client).error(`An error occurred executing ${cmd.name}`, error);

            this.client.emit('commandError', event, error, type);
        }
    }
}
