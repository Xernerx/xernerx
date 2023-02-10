import { Client, Collection } from 'discord.js';
import ExtensionBuilder from 'xernerx-extension-builder';
import { ClientUtil } from '../utils/ClientUtil.js';
import { ClientOptions, DiscordOptions, ExtensionOptions, HandlerOptions } from '../types/options.js';
import { ClientCache, ClientCommands, ClientModules } from '../types/interfaces.js';
import EventBuilder from '../build/EventBuilder.js';
import InhibitorBuilder from '../build/InhibitorBuilder.js';
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
    modules: ClientModules;
    util: ClientUtil;
    handlerOptions: HandlerOptions;
    events: Collection<string, EventBuilder>;
    extensions: Record<string, ExtensionBuilder>;
    inhibitors: Collection<string, InhibitorBuilder>;
    config: object;
    constructor(discordOptions: DiscordOptions, clientOptions: ClientOptions, config?: object);
    register(token: string): void;
    loadAllExtensions(options: ExtensionOptions): Promise<void>;
}
