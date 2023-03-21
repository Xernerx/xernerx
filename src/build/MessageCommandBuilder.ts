import { z } from 'zod';
import XernerxClient, { PermissionFlagsBits, PermissionsBitField } from '../main.js';
import { XernerxMessage } from '../types/extenders.js';
import { MessageCommandOptions } from '../types/interfaces.js';

export default class MessageCommandBuilder {
    public id;
    public name;
    public prefix;
    public regex;
    public separator;
    public args;
    public permissions;
    public client;

    constructor(id: string, options: MessageCommandOptions) {
        this.id = id;

        options = z
            .object({
                name: z.string(),
                description: z.string().or(z.null()).default(null),
                info: z.string().or(z.null()).default(null),
                category: z.string().or(z.null()).default(null),
                cooldown: z.number().or(z.null()).default(null),
                prefix: z.array(z.string()).or(z.string()).default([]),
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
            })
            .parse(options);

        this.name = options.name;

        this.prefix = options.prefix;

        this.regex = options.regex;

        this.separator = options.separator;

        this.args = options.args;

        this.permissions = options.permissions;

        this.client = XernerxClient;
    }

    public async conditions(message: XernerxMessage, args?: any, flags?: any) {}

    public async exec(message: XernerxMessage, args?: any, flags?: any) {}
}
