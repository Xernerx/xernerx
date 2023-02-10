import XernerxClient from '../client/XernerxClient.js';
export declare class MessageCommandEvents {
    client: XernerxClient;
    constructor(client: XernerxClient);
    messageCreate(): void;
    messageUpdate(): void;
    messageDelete(): void;
}
export declare class SlashCommandEvents {
    client: XernerxClient;
    constructor(client: XernerxClient);
    slashCreate(): void;
}
export declare class ContextCommandEvents {
    client: XernerxClient;
    constructor(client: XernerxClient);
    contextCreate(): void;
}
export declare class CommandsDeploy {
    private client;
    constructor(client: XernerxClient);
    deploy(): void;
    private put;
}
