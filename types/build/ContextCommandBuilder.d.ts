import { ContextMenuCommandBuilder } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage, XernerxMessageContextInteraction, XernerxUser, XernerxUserContextInteraction } from '../types/extenders.js';
import { ContextCommandOptions } from '../types/interfaces.js';
export default class ContextCommandBuilder {
    readonly id: string;
    readonly data: ContextMenuCommandBuilder;
    readonly name: string;
    readonly type: 'user' | 'message';
    readonly description: string | null | undefined;
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
    readonly fileType: 'ContextCommand';
    readonly filePath: string;
    readonly client: typeof XernerxClient;
    constructor(id: string, options: ContextCommandOptions);
    exec<T>(interaction: XernerxUserContextInteraction | XernerxMessageContextInteraction, args: XernerxUser | XernerxMessage): Promise<void | T | undefined>;
}
//# sourceMappingURL=ContextCommandBuilder.d.ts.map