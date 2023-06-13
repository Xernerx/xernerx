import { ContextMenuCommandBuilder } from 'discord.js';
import { z } from 'zod';

import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessageContextInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { ContextCommandArguments, ContextCommandOptions } from '../types/interfaces.js';

export default class ContextCommandBuilder {
    public declare readonly id;
    public declare readonly data;
    public declare readonly name;
    public declare readonly type: 'user' | 'message';
    public declare readonly description;
    public declare readonly usage;
    public declare readonly info;
    public declare readonly category;
    public declare readonly cooldown;
    public declare readonly ignore;
    public declare readonly strict;
    public declare readonly permissions;
    public declare readonly defer;
    public declare readonly fileType: 'ContextCommand';
    public declare readonly filePath: string;
    public declare readonly client;

    public constructor(id: string, options: ContextCommandOptions) {
        this.id = id;

        this.data = new ContextMenuCommandBuilder();

        this.data.setName(options.name);

        this.data.setNameLocalizations(options.nameLocalizations || null);

        this.data.setType(options.type === 'user' ? 2 : 3);

        this.data.setDMPermission(options.permissions?.dm || null);

        options = z
            .object({
                name: z.string(),
                type: z.enum(['user', 'message']),
                description: z.string().or(z.null()).default(null),
                usage: z.string().or(z.null()).default(null),
                info: z.string().or(z.null()).default(null),
                category: z.string().or(z.null()).default(null),
                cooldown: z.number().or(z.null()).default(null),
                ignore: z
                    .object({
                        owner: z.boolean().default(false),
                        users: z.array(z.string()).default([]),
                        channels: z.array(z.string()).default([]),
                        guilds: z.array(z.string()).default([]),
                    })
                    .default({}),
                strict: z
                    .object({
                        owner: z.boolean().default(false),
                        users: z.array(z.string()).default([]),
                        channels: z.array(z.string()).default([]),
                        guilds: z.array(z.string()).default([]),
                    })
                    .default({}),
                permissions: z
                    .object({
                        user: z.array(z.string()).default([]),
                        client: z.array(z.string()).default([]),
                        dm: z.boolean().default(true),
                    })
                    .default({}),
                defer: z
                    .object({
                        reply: z.boolean().default(false),
                        ephemeral: z.boolean().default(false),
                        fetch: z.boolean().default(false),
                    })
                    .default({}),
            })
            .parse(options);

        this.name = options.name;

        this.type = options.type;

        this.description = options.description;

        this.usage = options.usage;

        this.info = options.info;

        this.category = options.category;

        this.cooldown = options.cooldown;

        this.ignore = options.ignore;

        this.strict = options.strict;

        this.permissions = options.permissions;

        this.defer = options.defer;

        this.client = XernerxClient;
    }

    public async exec<T>(interaction: XernerxUserContextInteraction | XernerxMessageContextInteraction, args: ContextCommandArguments<'user' | 'message'>): Promise<void | any | T> {}
}
