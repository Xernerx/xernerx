import { Client, Collection } from 'discord.js';
import ExtensionBuilder from 'xernerx-extension-builder';
import { z } from 'zod';
import { Style } from 'dumfunctions';

import { ClientUtil } from '../utils/ClientUtil.js';
import { ClientOptions, DiscordOptions, ExtensionOptions, HandlerOptions } from '../types/options.js';
import { ClientCache, ClientCommands, ClientModules } from '../types/interfaces.js';

import CommandHandler from '../handlers/CommandHandler.js';
// import EventHandler from '../handlers/EventHandler.js';
// import InhibitorHandler from '../handlers/InhibitorHandler.js';
import Extensions from '../models/Extensions.js';
import EventBuilder from '../build/EventBuilder.js';
// import InhibitorBuilder from '../build/InhibitorBuilder.js';
// import WebhookHandler from '../handlers/WebhookHandler.js';

// TODO - Add commandNotFound as an event to the client.

/**
 * @description - The Client.
 * @param {DiscordOptions} discordOptions - The options for discord.js.
 * @param {ClientOptions} clientOptions - The options for the Xernerx Client.
 * @extends {Client}
 */
export default class XernerxClient extends Client {
    public settings: ClientOptions;
    public commands: ClientCommands;
    public cache: ClientCache;
    public modules: ClientModules | any;
    public util: ClientUtil;
    public handlerOptions: HandlerOptions;
    public events: Collection<string, EventBuilder>;
    public stats: object;
    public extensions: Record<string, ExtensionBuilder>;
    public inhibitors: Collection<string, InhibitorBuilder>;
    public config: object;

    constructor(discordOptions: DiscordOptions, clientOptions: ClientOptions, config?: object) {
        super(discordOptions);

        this.settings = z
            .object({
                ownerId: z.string().or(z.array(z.string())).default([]),
                permissions: z
                    .object({
                        client: z.array(z.string()).default([]),
                        user: z.array(z.string()).default([]),
                        dm: z.boolean().default(false),
                    })
                    .optional(),
                ignore: z
                    .object({
                        owner: z.boolean().default(false),
                        users: z.array(z.string()),
                        channels: z.array(z.string()),
                        guilds: z.array(z.string()),
                    })
                    .optional(),
                log: z
                    .object({
                        ready: z.boolean().default(false),
                        error: z.boolean().default(false),
                    })
                    .optional(),
                cooldown: z
                    .object({
                        command: z.number().default(0),
                        cache: z.number().default(0),
                    })
                    .optional(),
            })
            .parse(clientOptions);

        this.config = config || {};

        this.commands = {
            message: new Collection(),
            slash: new Collection(),
            context: new Collection(),
        };

        this.events = new Collection();

        // this.inhibitors = new Collection();

        this.cache = {
            messages: new Collection(),
            cooldowns: new Collection(),
            messageCommands: new Collection(),
            slashCommands: new Collection(),
            contextCommands: new Collection(),
            commands: new Collection(),
        };

        this.modules = {
            commandHandler: new CommandHandler(this),
            // eventHandler: new EventHandler(this),
            // inhibitorHandler: new InhibitorHandler(this),
            // webhookHandler: new WebhookHandler(this),
        };

        this.stats = {};

        this.extensions = {};

        this.util = new ClientUtil(this);

        this.handlerOptions = {};

        if (this.settings?.log?.ready) {
            this.once('ready', async (client) => {
                const size = (await client.guilds.fetch()).size;

                console.info(
                    Style.log(
                        `Xernerx | ${client.user.tag} signed in watching ${size} server${size > 1 ? 's' : ''}. ${
                            (this.handlerOptions.slash || this.handlerOptions.context)?.guildId
                                ? `Using ${(await this.guilds.fetch((this.handlerOptions.slash || this.handlerOptions.context)?.guildId || '0')).name} as local guild.`
                                : ''
                        }`,
                        { color: Style.TextColor.Purple }
                    )
                );
            });
        }
    }

    public register(token: string) {
        this.login(token);
    }

    public loadAllExtensions(options: ExtensionOptions) {
        const extensions = new Extensions(this);

        return extensions.load(options.extensions, options.logging || false);
    }
}
