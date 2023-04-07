import { z } from 'zod';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/extenders.js';
import { MessageCommandArguments, MessageCommandOptions } from '../types/interfaces.js';

export default class MessageCommandBuilder {
    public id;
    public name;
    public regex;
    public prefix;
    public description;
    public info;
    public separator;
    public args;
    public flags;
    public category;
    public cooldown;
    public ignore;
    public strict;
    public permissions;
    public client;

    constructor(id: string, options: MessageCommandOptions) {
        this.id = id;

        this.regex = options.regex;

        this.args = options.args;

        this.flags = options.flags;

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

        this.description = options.description;

        this.info = options.info;

        this.category = options.category;

        this.cooldown = options.cooldown;

        this.ignore = options.ignore;

        this.strict = options.strict;

        this.separator = options.separator;

        this.permissions = options.permissions;

        this.client = XernerxClient;
    }

    public async conditions(message: XernerxMessage, args: MessageCommandArguments) {}

    public async exec(message: XernerxMessage, args: MessageCommandArguments) {}
}
