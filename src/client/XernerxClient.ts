import { Client, ClientOptions, Collection } from 'discord.js';
import { z } from 'zod';

import CommandHandler from '../handlers/CommandHandler.js';
import EventHandler from '../handlers/EventHandler.js';
import InhibitorHandler from '../handlers/InhibitorHandler.js';
import WebhookHandler from '../handlers/WebhookHandler.js';
import XernerxLog from '../tools/XernerxLog.js';
import { XernerxOptions, ModuleOptions, XernerxCommands, XernerxCache } from '../types/interfaces.js';
import ClientUtil from '../utils/ClientUtil.js';
import { InhibitorBuilder } from '../main.js';
import ExtensionHandler from '../handlers/ExtensionHandler.js';
export default class XernerxClient extends Client {
    public readonly settings;
    public readonly config;
    public readonly commands: XernerxCommands;
    public readonly events;
    public readonly inhibitors: Collection<string, InhibitorBuilder>;
    public readonly modules: ModuleOptions;
    public readonly util: ClientUtil;
    public readonly stats;
    public readonly cache: XernerxCache;

    constructor(discordOptions: ClientOptions, xernerxOptions: XernerxOptions, config: unknown) {
        super(discordOptions);

        this.settings = z
            .object({
                local: z.string(),
                global: z.boolean().default(false),
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
                        info: z.boolean().default(false),
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
            .parse(xernerxOptions);

        this.config = config;

        this.commands = {
            message: new Collection(),
            slash: new Collection(),
            context: new Collection(),
        };

        this.events = new Collection();

        this.inhibitors = new Collection();

        this.modules = {
            options: {},
            commandHandler: new CommandHandler(this),
            eventHandler: new EventHandler(this),
            inhibitorHandler: new InhibitorHandler(this),
            webhookHandler: new WebhookHandler(this),
            extensionHandler: new ExtensionHandler(this),
        };

        this.util = new ClientUtil(this);

        this.stats = {
            guildCount: 0,
            userCount: 0,
            shardId: 0,
            shardCount: 1,
        };

        this.cache = {
            messages: new Collection(),
            cooldowns: new Collection(),
        };

        return this;
    }

    public connect(token: string) {
        this.login(token);

        new XernerxLog(this).ready();
    }

    // public loadAllExtensions(options: ExtensionOptions) {
    //     const extensions = new Extensions(this);

    //     return extensions.load(options.extensions, options.logging || false);
    // }
}
