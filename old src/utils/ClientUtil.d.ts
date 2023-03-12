import { ActivityType, ClientPresenceStatus } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
interface Presence {
    text?: string;
    type?: ActivityType.Playing | ActivityType.Streaming | ActivityType.Listening | ActivityType.Watching | ActivityType.Competing;
    link?: string;
    status?: ClientPresenceStatus;
    interval?: number;
}
export declare class ClientUtil {
    client: XernerxClient;
    [index: string]: Function | XernerxClient;
    constructor(client: XernerxClient);
    uptime(timestamp: number | null): string;
    getSubcommands(name: string): object[];
    isOwner(userId: string): boolean;
    getAllCommands(): object[];
    getAllMessageCommands(): object[];
    getAllSlashCommands(): object[];
    getAllContextCommands(): object[];
    setPresence(options: Presence): void;
    getCooldowns(id: string, command?: string): any;
    getCooldownTimers(id: string, command?: string): any;
    defer(time: number): Promise<unknown>;
}
export {};
