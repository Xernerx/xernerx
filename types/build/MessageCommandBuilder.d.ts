import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/extenders.js';
import { MessageCommandOptions } from '../types/interfaces.js';
export default class MessageCommandBuilder {
    readonly id: string;
    readonly name: string;
    readonly aliases: string[] | undefined;
    readonly regex: RegExp | undefined;
    readonly prefix: string | string[] | undefined;
    readonly description: string | null | undefined;
    readonly usage: string | null | undefined;
    readonly info: string | null | undefined;
    readonly separator: string | undefined;
    readonly args: import("../types/interfaces.js").MessageCommandArgumentOptions[] | undefined;
    readonly flags: import("../types/interfaces.js").MessageCommandFlagOptions[] | undefined;
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
    readonly fileType: 'MessageCommand';
    readonly filePath: string;
    readonly client: typeof XernerxClient;
    constructor(id: string, options: MessageCommandOptions);
    conditions<T>(message: XernerxMessage, { args, flags }: any): Promise<void | undefined | T>;
    exec<T>(message: XernerxMessage, { args, flags }: any): Promise<void | undefined | T>;
}
//# sourceMappingURL=MessageCommandBuilder.d.ts.map