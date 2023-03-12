import { z } from 'zod';

import { MessageArgumentOptions, MessageCommandOptions } from '../types/options.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/types.js';

/**
 * @description - The command builder for message commands.
 * @param {String} id - The unique ID of the command.
 * @param {MessageCommandOptions} options - The command options.
 */
export default class MessageCommandBuilder {
    public id;
    public name;
    public aliases;
    public separator;
    public description;
    public info;
    public category;
    public prefix;
    public regex;
    public channelType;
    public ignore;
    public strict;
    public permissions;
    public cooldown;
    public args;
    public client;

    constructor(id: string, options: MessageCommandOptions) {
        this.id = id;

        z.object({
            name: z.string(),
            aliases: z.array(z.string()).optional(),
            separator: z.string().min(1).max(1).optional(),
            description: z.string().optional(),
            info: z.string().optional(),
            category: z.string().optional(),
            prefix: z.array(z.string()).or(z.string()).optional(),
            regex: z.unknown(),
            channelType: z.array(z.number()).or(z.number()).optional(),
            cooldown: z.number().optional(),
            ignore: z
                .object({
                    owners: z.boolean().optional(),
                    users: z.array(z.string()).or(z.string()).optional(),
                    channels: z.array(z.string()).or(z.string()).optional(),
                    guilds: z.array(z.string()).or(z.string()).optional(),
                })
                .optional(),
            strict: z
                .object({
                    owners: z.boolean().optional(),
                    users: z.array(z.string()).or(z.string()).optional(),
                    channels: z.array(z.string()).or(z.string()).optional(),
                    guilds: z.array(z.string()).or(z.string()).optional(),
                })
                .optional(),
            permissions: z
                .object({
                    client: z.array(z.string()).optional(),
                    users: z.array(z.string()).optional(),
                    dm: z.boolean().optional(),
                })
                .optional(),
        }).parse(options);

        this.name = options.name;

        this.aliases = options.aliases;

        this.separator = options.separator || ' ';

        this.description = options.description;

        this.info = options.info;

        this.category = options.category;

        this.prefix = options.prefix ? (Array.isArray(options.prefix) ? options.prefix : [options.prefix]) : [];

        this.regex = options.regex;

        this.channelType = options.channelType;

        this.ignore = options.ignore;

        this.strict = options.strict;

        this.permissions = options.permissions;

        this.cooldown = options.cooldown || 0;

        this.args = options.args || [];

        this.client = XernerxClient;
    }

    /**
     * @param {Message} message - The Discord message event data.
     * @param {object} args - The arguments you created.
     * @description make any preconditions here.
     */
    public async conditions(message: XernerxMessage, args: MessageArgumentOptions) {}

    /**
     * @param {Message} message - The Discord message event data.
     * @param {object} args - The arguments you created.
     * @description Make your custom command here.
     */
    public async exec(message: XernerxMessage, args: MessageArgumentOptions) {}
}
