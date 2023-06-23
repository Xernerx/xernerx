import { Client, ClientOptions, Collection } from 'discord.js';
import { z } from 'zod';

import CommandHandler from '../handlers/CommandHandler.js';
import EventHandler from '../handlers/EventHandler.js';
import InhibitorHandler from '../handlers/InhibitorHandler.js';
import WebhookHandler from '../handlers/WebhookHandler.js';
import XernerxLog from '../tools/XernerxLog.js';
import { XernerxOptions, ModuleOptions, XernerxCommands, XernerxCache } from '../types/interfaces.js';
import ClientUtil from '../utils/ClientUtil.js';
import { InhibitorBuilder, EventBuilder } from '../main.js';
import ExtensionHandler from '../handlers/ExtensionHandler.js';
import deploy from '../functions/deploy.js';

export default class XernerxClient extends Client {
    public declare readonly settings;
    public declare readonly config;
    public declare readonly commands: XernerxCommands;
    public declare readonly events: Collection<string, EventBuilder>;
    public declare readonly inhibitors: Collection<string, InhibitorBuilder>;
    public declare readonly modules: ModuleOptions;
    public declare readonly util: ClientUtil;
    public declare readonly stats: Record<string, number>;
    public declare readonly cache: XernerxCache;

    public constructor(discordOptions: ClientOptions, xernerxOptions: XernerxOptions, config?: Record<string, unknown>) {
        super(discordOptions);

        this.settings = z
            .object({
                local: z.string().or(z.undefined()).optional(),
                global: z.boolean().default(false).optional(),
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
                        users: z.array(z.string()).default([]),
                        channels: z.array(z.string()).default([]),
                        guilds: z.array(z.string()).default([]),
                    })
                    .optional(),
                log: z
                    .object({
                        ready: z.boolean().default(false),
                        info: z.boolean().default(false),
                        error: z.boolean().default(false),
                        table: z.array(z.string()).or(z.null()).default(null),
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

        this.config = config || null;

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
        } as const;

        this.util = new ClientUtil(this);

        this.stats = {
            guildCount: this.guilds.cache.size,
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

        deploy(this);

        new XernerxLog(this).ready();
    }
}
