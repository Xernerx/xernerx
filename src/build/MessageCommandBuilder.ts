import { z } from 'zod';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/extenders.js';
import { MessageCommandOptions } from '../types/interfaces.js';

export default class MessageCommandBuilder {
    public declare readonly id;
    public declare readonly name;
    public declare readonly aliases;
    public declare readonly regex;
    public declare readonly prefix;
    public declare readonly description;
    public declare readonly usage;
    public declare readonly info;
    public declare readonly separator;
    public declare readonly args;
    public declare readonly flags;
    public declare readonly category;
    public declare readonly cooldown;
    public declare readonly ignore;
    public declare readonly strict;
    public declare readonly permissions;
    public declare readonly fileType: 'MessageCommand';
    public declare readonly filePath: string;
    public declare readonly client;

    public constructor(id: string, options: MessageCommandOptions) {
        this.id = id;

        this.regex = options.regex;

        this.args = options.args;

        this.flags = options.flags;

        options = z
            .object({
                name: z.string(),
                aliases: z.array(z.string()).default([]),
                description: z.string().or(z.null()).default(null),
                usage: z.string().or(z.null()).default(null),
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

        this.aliases = options.aliases;

        this.prefix = options.prefix;

        this.description = options.description;

        this.usage = options.usage;

        this.info = options.info;

        this.category = options.category;

        this.cooldown = options.cooldown;

        this.ignore = options.ignore;

        this.strict = options.strict;

        this.separator = options.separator;

        this.permissions = options.permissions;

        this.client = XernerxClient;
    }

    public async conditions<T>(message: XernerxMessage, { args, flags }: any): Promise<void | any | T> {}

    public async exec<T>(message: XernerxMessage, { args, flags }: any): Promise<void | any | T> {}
}
