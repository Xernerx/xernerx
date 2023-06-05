import { Client, ClientOptions, Collection } from 'discord.js';
import { XernerxOptions, ModuleOptions, XernerxCommands, XernerxCache } from '../types/interfaces.js';
import ClientUtil from '../utils/ClientUtil.js';
import { InhibitorBuilder, EventBuilder } from '../main.js';
export default class XernerxClient extends Client {
    readonly settings: {
        ownerId: (string | string[]) & (string | string[] | undefined);
        local?: string | undefined;
        global?: boolean | undefined;
        permissions?: {
            user: string[];
            client: string[];
            dm: boolean;
        } | undefined;
        ignore?: {
            owner: boolean;
            users: string[];
            channels: string[];
            guilds: string[];
        } | undefined;
        log?: {
            ready: boolean;
            error: boolean;
            info: boolean;
            table: string[] | null;
        } | undefined;
        cooldown?: {
            command: number;
            cache: number;
        } | undefined;
    };
    readonly config: Record<string, unknown> | null;
    readonly commands: XernerxCommands;
    readonly events: Collection<string, EventBuilder>;
    readonly inhibitors: Collection<string, InhibitorBuilder>;
    readonly modules: ModuleOptions;
    readonly util: ClientUtil;
    readonly stats: Record<string, number>;
    readonly cache: XernerxCache;
    constructor(discordOptions: ClientOptions, xernerxOptions: XernerxOptions, config?: Record<string, unknown>);
    connect(token: string): void;
}
//# sourceMappingURL=XernerxClient.d.ts.map