import * as Discord from 'discord.js';
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { z } from 'zod';
import XernerxError from '../tools/XernerxError.js';
import XernerxClient from '../client/XernerxClient.js';
/**
 * @description - The command builder for slash commands.
 * @param {String} id - The unique ID of the command.
 * @param {SlashCommandOptions} options - The command options.
 */
export default class SlashCommandBuilder {
    id;
    data;
    name;
    description;
    info;
    category;
    channelType;
    cooldown;
    ignore;
    strict;
    permissions;
    args;
    subcommands;
    groups;
    defer;
    client;
    constructor(id, options) {
        this.id = id;
        this.data = new Discord.SlashCommandBuilder().setName(options.name).setDescription(options.description);
        if (options.args && options?.args?.length > 0) {
            this.addArgs(this.data, options.args);
        }
        if (options.subcommands && options?.subcommands?.length > 0) {
            this.addSubcommands(this.data, options.subcommands);
        }
        if (options.groups && options?.groups?.length > 0) {
            this.addSubcommandGroups(options.groups);
        }
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
     * TODO - update description
     * @param interaction
     */
    async conditions(interaction) { }
    /**
     * TODO - update description
     * @param interaction
     */
    async exec(interaction) { }
    addArgs(command, args) {
        const types = ['boolean', 'integer', 'number', 'string', 'user', 'role', 'channel', 'mentionable'];
        for (const argument of args) {
            if (!types.includes(argument.type.toLowerCase()))
                throw new XernerxError(`Expected one of ${types.join(', ')}, received ${argument.type} instead.`);
            let slashArgumentType = `${argument.type.slice(0, 1).toUpperCase()}${argument.type.slice(1).toLowerCase()}`;
            command[`add${slashArgumentType}Option`]((option) => {
                option
                    .setName(argument.name)
                    .setDescription(argument.description)
                    .setRequired(argument.required || false);
                if (argument.choices)
                    option.setChoices(...argument?.choices);
                return option;
            });
        }
    }
    addSubcommands(method, subcommands) {
        for (const subcommand of subcommands) {
            let sub = new SlashCommandSubcommandBuilder().setName(subcommand.name).setDescription(subcommand.description);
            if (subcommand.args?.length > 0)
                this.addArgs(sub, subcommand.args);
            method.addSubcommand(sub);
        }
    }
    addSubcommandGroups(groups) {
        for (const group of groups) {
            let subcommandGroup = new SlashCommandSubcommandGroupBuilder().setName(group.name).setDescription(group.description);
            if (group.subcommands?.length > 0)
                this.addSubcommands(subcommandGroup, group.subcommands);
            this.data.addSubcommandGroup(subcommandGroup);
        }
    }
}
