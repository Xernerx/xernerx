import Discord from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxSlashInteraction } from '../types/extenders.js';
import { SlashCommandOptions } from '../types/interfaces.js';
import { XernerxInteraction } from '../types/types.js';
export default class SlashCommandBuilder {
    readonly id: string;
    readonly data: Discord.SlashCommandBuilder;
    readonly name: string;
    readonly description: string;
    readonly usage: string | null | undefined;
    readonly info: string | null | undefined;
    readonly category: string | null | undefined;
    readonly cooldown: number | null | undefined;
    readonly ignore: {
        owner?: boolean | undefined;
        users?: string[] | undefined;
        channels?: string[] | undefined;
        guilds?: string[] | undefined;
    } | undefined;
    readonly strict: {
        owner?: boolean | undefined;
        users?: string[] | undefined;
        channels?: string[] | undefined;
        guilds?: string[] | undefined;
    } | undefined;
    readonly permissions: {
        user?: string[] | import("../types/types.js").PermissionNames[] | undefined;
        client?: string[] | import("../types/types.js").PermissionNames[] | undefined;
        dm?: boolean | undefined;
    } | undefined;
    readonly defer: {
        reply?: boolean | undefined;
        ephemeral?: boolean | undefined;
        fetchReply?: boolean | undefined;
    } | undefined;
    readonly fileType: 'SlashCommand';
    readonly filePath: string;
    readonly client: typeof XernerxClient;
    constructor(id: string, options: SlashCommandOptions);
    autocomplete<T>(interaction: XernerxInteraction, focused: T, options: T[]): Promise<void | undefined | T>;
    conditions<T>(interaction: XernerxSlashInteraction, { args, subcommand, group }: any): Promise<void | undefined | T>;
    exec<T>(interaction: XernerxSlashInteraction, { args, subcommand, group }: any): Promise<void | undefined | T>;
    private addArguments;
    private addSubcommands;
    private addSubcommandGroups;
}
//# sourceMappingURL=SlashCommandBuilder.d.ts.map