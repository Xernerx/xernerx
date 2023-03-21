import { z } from 'zod';
import * as path from 'path';

import XernerxClient from '../client/XernerxClient.js';
import {
    ContextHandlerOptions,
    MessageCommandArgumentOptions,
    MessageHandlerOptions,
    SlashCommandArgumentOptions,
    SlashCommandGroupOptions,
    SlashCommandSubcommandOptions,
    SlashHandlerOptions,
} from '../types/interfaces.js';
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

export default class CommandHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }

    public loadMessageCommands(options: MessageHandlerOptions) {
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

    public reloadMessageCommands() {
        return reload(this.client, 'message');
    }

    public loadSlashCommands(options: SlashHandlerOptions) {
        options = z
            .object({
                directory: z.string(),
                guildId: z.string(),
                global: z.boolean(),
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
                guildId: z.string(),
                global: z.boolean(),
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

            let commandName, cmd;

            commands.map((command) => {
                let prefix: string | null = null;

                const cp = Array.isArray(command.prefix) ? command.prefix : [command.prefix as string];

                prefixes.map((p) => {
                    if (message.content.startsWith(p)) prefix = p;
                });

                cp.map((p) => {
                    if (message.content.startsWith(p)) prefix = p;
                });

                if (!prefix) return;

                commandName = message.content
                    .replace(prefix, '')
                    .split(command.separator || / +/)
                    .shift()
                    ?.trim()
                    ?.toLowerCase();
            });

            if (!cmd && this.client.modules.options.message.allowMention) {
                if (message.mentions.users.has(this.client.user?.id as string) || message.mentions.repliedUser?.id === this.client.user?.id) {
                    commandName = message.content.replace(`<@${this.client.user?.id}>`, '').trim().split(/ +/).shift()?.toLowerCase();
                }
            }

            if (!commandName) return;

            if (this.client.commands.message.has(commandName)) cmd = this.client.commands.message.get(commandName);

            if (!cmd) return this.client.emit('commandNotFound');

            this.exec(cmd, message, {}, 'MessageCommand');
        }
    }

    private async slashCommandRun(interaction: XernerxSlashInteraction) {
        interaction.util = new InteractionUtil(this.client, interaction);

        interaction.user = await xernerxUser(interaction, this.client);

        let cmd;

        if (this.client.commands.slash.has(interaction.commandName)) cmd = this.client.commands.slash.get(interaction.commandName);

        if (!cmd) return this.client.emit('commandNotFound', interaction);

        this.exec(cmd as unknown as SlashCommandBuilder, interaction, {}, 'SlashCommand');
    }

    private async contextCommandRun(interaction: XernerxUserContextInteraction | XernerxMessageContextInteraction) {
        interaction.util = new InteractionUtil(this.client, interaction);

        interaction.user = await xernerxUser(interaction as XernerxUserContextInteraction, this.client);

        let cmd;

        if (this.client.commands.context.has(interaction.commandName)) cmd = this.client.commands.context.get(interaction.commandName);

        if (!cmd) return this.client.emit('commandNotFound', interaction);

        this.exec(cmd as unknown as SlashCommandBuilder, interaction, {}, 'ContextCommand');
    }

    private async exec(
        cmd: MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder,
        event: XernerxMessage | XernerxSlashInteraction | XernerxMessageContextInteraction | XernerxUserContextInteraction,
        args: MessageCommandArgumentOptions | Record<string, SlashCommandArgumentOptions | SlashCommandSubcommandOptions | SlashCommandGroupOptions>,
        type: FileType
    ) {
        try {
            if (!(await commandValidation(event, cmd))) return;

            cmd.exec(event as never, args);

            this.client.emit('commandExecute', event, type);
        } catch (error) {
            new XernerxLog().error(`An error occurred executing ${cmd.name}`, error);

            this.client.emit('commandError', event, error, type);
        }
    }
}
