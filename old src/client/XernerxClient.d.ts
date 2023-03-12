import { Client, Collection } from 'discord.js';
import ExtensionBuilder from 'xernerx-extension-builder';
import { ClientUtil } from '../utils/ClientUtil.js';
import { ClientOptions, DiscordOptions, ExtensionOptions, HandlerOptions } from '../types/options.js';
import { ClientCache, ClientCommands, ClientModules } from '../types/interfaces.js';
import EventBuilder from '../build/EventBuilder.js';
/**
 * @description - The Client.
 * @param {DiscordOptions} discordOptions - The options for discord.js.
 * @param {ClientOptions} clientOptions - The options for the Xernerx Client.
 * @extends {Client}
 */
export default class XernerxClient extends Client {
    settings: ClientOptions;
    commands: ClientCommands;
    cache: ClientCache;
    modules: ClientModules | any;
    util: ClientUtil;
    handlerOptions: HandlerOptions;
    events: Collection<string, EventBuilder>;
    stats: object;
    extensions: Record<string, ExtensionBuilder>;
    config: object;
    constructor(discordOptions: DiscordOptions, clientOptions: ClientOptions, config?: object);
    register(token: string): void;
    loadAllExtensions(options: ExtensionOptions): Promise<void>;
}
