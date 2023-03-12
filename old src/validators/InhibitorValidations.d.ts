import XernerxClient from '../client/XernerxClient.js';
import { XernerxInteraction, XernerxMessage } from '../types/types.js';
export declare class InhibitorValidation {
    client: XernerxClient;
    action: XernerxMessage | XernerxInteraction;
    command: string;
    inhibited: Record<string, string | void>;
    constructor(client: XernerxClient, action: XernerxMessage | XernerxInteraction, command: string);
    inhibit(): Promise<Record<string, string | void> | undefined>;
    private args;
}
