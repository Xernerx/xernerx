import * as Discord from 'discord.js';
import { Interaction } from 'discord.js';
import { SlashCommandOptions } from '../types/options.js';
import XernerxClient from '../client/XernerxClient.js';
/**
 * @description - The command builder for slash commands.
 * @param {String} id - The unique ID of the command.
 * @param {SlashCommandOptions} options - The command options.
 */
export default class SlashCommandBuilder {
    id: string;
    data: Discord.SlashCommandBuilder;
    name: string;
    description: string;
    info: string | undefined;
    category: string | undefined;
    channelType: Discord.ChannelType | undefined;
    cooldown: number | undefined;
    ignore: {
        owner?: boolean | undefined;
        users?: string[] | undefined;
        channels?: string[] | undefined;
        guilds?: string[] | undefined;
    } | undefined;
    strict: {
        owner?: boolean | undefined;
        users?: string[] | undefined;
        channels?: string[] | undefined;
        guilds?: string[] | undefined;
    } | undefined;
    permissions: {
        client?: string[] | undefined;
        users?: string[] | undefined;
        dm?: boolean | undefined;
    };
    args?: object[];
    subcommands?: object[];
    groups?: object[];
    defer: {
        reply?: boolean | undefined;
        ephemeral?: boolean | undefined;
        fetchReply?: boolean | undefined;
    } | undefined;
    client: typeof XernerxClient;
    constructor(id: string, options: SlashCommandOptions);
    /**
     * TODO - update description
     * @param interaction
     */
    conditions(interaction: Interaction): Promise<void>;
    /**
     * TODO - update description
     * @param interaction
     */
    exec(interaction: Interaction): Promise<void>;
    private addArgs;
    private addSubcommands;
    private addSubcommandGroups;
}
