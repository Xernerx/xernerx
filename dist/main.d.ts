import * as Discord from 'discord.js';

/** @format */
interface XernerxStats {
    guilds: null | number;
    users: null | number;
    shardId: null | number;
    shardCount: null | number;
    shards: null | number;
    voteCount: null | number;
    votes: null | number;
}
interface XernerxSlashCommandHandlerOptions {
    directory: string;
    global: boolean;
}
interface XernerxMessageCommandHandlerOptions {
    directory: string;
    global: boolean;
}
interface XernerxContextCommandHandlerOptions {
    directory: string;
    global: boolean;
}

/** @format */
declare class XernerxContextCommand {
    readonly _id: string;
    readonly name: string;
    readonly description: string;
    readonly global: boolean;
    readonly filetype: 'XernerxContextCommand';
    readonly collection: 'context.commands';
    constructor(options: any);
}

/** @format */
declare class XernerxEvent {
    readonly _id: string;
    readonly name: string;
    readonly description: string;
    readonly filetype: 'XernerxEvent';
    readonly collection: 'events';
    constructor(options: any);
}

/** @format */
declare class XernerxInhibitor {
    readonly _id: string;
    readonly name: string;
    readonly description: string;
    readonly filetype: 'XernerxInhibitor';
    readonly collection: 'inhibitors';
    constructor(options: any);
}

/** @format */
declare class XernerxMessageCommand {
    readonly _id: string;
    readonly name: string;
    readonly description: string;
    readonly global: boolean;
    readonly filetype: 'XernerxMessageCommand';
    readonly collection: 'message.commands';
    constructor(options: any);
}

/** @format */

declare class XernerxSlashCommand extends Discord.SlashCommandBuilder {
    readonly _id: string;
    readonly global: boolean;
    readonly filetype: 'XernerxSlashCommand';
    readonly collection: 'slash.commands';
    constructor(options: any);
}

/** @format */

type XernerxFileType = 'XernerxSlashCommand' | 'XernerxMessageCommand' | 'XernerxContextCommand' | 'XernerxEvent' | 'XernerxInhibitor';
type XernerxFile<T = XernerxFileType> = T extends 'XernerxSlashCommand' ? XernerxSlashCommand : T extends 'XernerxMessageCommand' ? XernerxMessageCommand : T extends 'XernerxContextCommand' ? XernerxContextCommand : T extends 'XernerxEvent' ? XernerxEvent : T extends 'XernerxInhibitor' ? XernerxInhibitor : XernerxSlashCommand | XernerxMessageCommand | XernerxSlashCommand | XernerxEvent | XernerxInhibitor;

/** @format */

declare class Handler {
    readonly client: XernerxClient;
    constructor(client: XernerxClient);
    protected readdir(directory: string): Promise<string[]>;
    protected load(filepath: string): Promise<XernerxFile | null>;
}

/** @format */

declare class CommandHandler extends Handler {
    constructor(client: XernerxClient);
    protected loadSlashCommands(options: XernerxSlashCommandHandlerOptions): Promise<void>;
    protected loadMessageCommands(options: XernerxMessageCommandHandlerOptions): Promise<void>;
    protected loadContextCommands(options: XernerxContextCommandHandlerOptions): Promise<void>;
}

/** @format */

declare class Util {
    readonly client: XernerxClient;
    constructor(client: XernerxClient);
}

/** @format */

declare class ClientUtil extends Util {
    constructor(client: XernerxClient);
    uptime(timestamp?: number | null): string;
}

/** @format */

declare class XernerxClient<T = {}> extends Discord.Client {
    readonly settings: {
        token: string;
        global: boolean;
        owners: string[];
        guilds: string[];
        debug: boolean;
    };
    readonly stats: XernerxStats;
    readonly modules: {
        commandHandler: CommandHandler;
        options: {
            message?: {
                global?: boolean;
            };
            slash?: {
                global?: boolean;
            };
            context?: {
                global?: boolean;
            };
        };
    };
    readonly util: ClientUtil;
    readonly commands: {
        message: Discord.Collection<string, XernerxMessageCommand>;
        slash: Discord.Collection<string, XernerxSlashCommand>;
        context: Discord.Collection<string, XernerxContextCommand>;
        stats: {
            slash: {
                local: number;
                global: number;
            };
            message: {
                local: number;
                global: number;
            };
            context: {
                local: number;
                global: number;
            };
        };
    };
    readonly events: Discord.Collection<string, XernerxEvent>;
    readonly inhibitors: Discord.Collection<string, XernerxInhibitor>;
    constructor(DiscordOptions: any, XernerxOptions: any, config: T);
    private connect;
    private deploy;
}

export { XernerxClient, XernerxSlashCommand };
