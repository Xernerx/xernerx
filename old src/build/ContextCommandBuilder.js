import { ContextMenuCommandBuilder } from 'discord.js';
import { z } from 'zod';
import XernerxClient from '../client/XernerxClient.js';
/**
 * @description The command builder for context commands.
 * @param {String} id - The unique ID of the command.
 * @param {ContextCommandOptions} options - The command options.
 */
export default class ContextCommandBuilder {
    id;
    data;
    name;
    type;
    description;
    info;
    category;
    channelType;
    cooldown;
    ignore;
    strict;
    permissions;
    defer;
    client;
    constructor(id, options) {
        this.id = id;
        this.data = new ContextMenuCommandBuilder();
        if (options.name)
            this.data.setName(options.name);
        if (options.type)
            this.data.setType(options.type);
        if (options.permissions?.users)
            this.data.setDefaultMemberPermissions(options.permissions?.users);
        if (options.permissions?.dm === false)
            this.data.setDMPermission(options.permissions?.dm);
        if (options.nameLocalizations)
            this.data.setNameLocalizations(options.nameLocalizations);
        z.object({
            description: z.string(),
            info: z.string(),
            category: z.string(),
            channelType: z.array(z.number()).or(z.number()),
            cooldown: z.number(),
            ignore: z.object({
                owner: z.boolean(),
                users: z.array(z.string()),
                channels: z.array(z.string()),
                guilds: z.array(z.string()),
            }),
            strict: z.object({
                owner: z.boolean(),
                users: z.array(z.string()),
                channels: z.array(z.string()),
                guilds: z.array(z.string()),
            }),
            permissions: z.object({
                client: z.array(z.string()),
                users: z.array(z.string()),
                dm: z.boolean(),
            }),
            defer: z.object({
                reply: z.boolean(),
                ephemeral: z.boolean(),
                fetch: z.boolean(),
            }),
        })
            .deepPartial()
            .parse(options);
        this.name = options.name;
        this.type = options.type;
        this.description = options.description;
        this.info = options.info;
        this.category = options.category;
        this.channelType = options.channelType;
        this.cooldown = options.cooldown;
        this.ignore = options.ignore;
        this.strict = options.strict;
        this.permissions = options.permissions;
        this.defer = options.defer;
        this.client = XernerxClient;
    }
    /**
     * @param {Interaction} interaction - The Discord interaction event data.
     * @description make any preconditions here.
     * TODO - update description
     */
    async conditions(interaction, args) { }
    /**
     * @param {Interaction} interaction - The Discord interaction event data.
     * @description Make your custom command here.
     * TODO - update description
     */
    async exec(interaction, args) { }
}