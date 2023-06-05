import XernerxClient from '../client/XernerxClient.js';
import { PresenceOptions } from '../types/interfaces.js';
import Util from './Util.js';
export default class ClientUtil extends Util {
    hasVoted?: Function;
    constructor(client: XernerxClient);
    setPresence(options: PresenceOptions): import("discord.js").ClientPresence | undefined;
    resolveChannel(query: string | Record<string, string>): Promise<import("discord.js").Channel | null>;
    resolveGuild(query: string | Record<string, string>): Promise<import("discord.js").Guild | null>;
}
//# sourceMappingURL=ClientUtil.d.ts.map