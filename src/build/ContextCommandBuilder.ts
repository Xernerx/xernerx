import { ContextMenuCommandBuilder } from 'discord.js';
import { z } from 'zod';

import XernerxClient from '../main.js';
import { XernerxMessageContextInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { ContextCommandOptions } from '../types/interfaces.js';
import { PermissionNames } from '../types/types.js';

export default class ContextCommandBuilder {
    public id;
    public data;
    public name;
    public permissions;
    public client;

    constructor(id: string, options: ContextCommandOptions) {
        this.id = id;

        options = z
            .object({
                type: z.enum(['user', 'message']),
                name: z.string(),
                description: z.string().or(z.null()).default(null),
                info: z.string().or(z.null()).default(null),
                category: z.string().or(z.null()).default(null),
                channelType: z.array(z.number()).or(z.null()).default(null),
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

        this.data = new ContextMenuCommandBuilder();

        this.data.setName(options.name);

        this.data.setNameLocalizations(options.nameLocalizations || null);

        this.data.setType(options.type === 'user' ? 2 : 3);

        this.data.setDMPermission(options.permissions?.dm || null);

        this.name = options.name;

        this.permissions = options.permissions;

        this.client = XernerxClient;
    }

    public async exec(interaction: XernerxUserContextInteraction | XernerxMessageContextInteraction) {}
}
