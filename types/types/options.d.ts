import { CacheFactory, ChannelType, ContextMenuCommandType, MessageMentionOptions, Partials, PresenceData, RESTOptions, SweeperOptions, WebSocketOptions } from 'discord.js';
import XernerxExtensionBuilder from 'xernerx-extension-builder';
import { InhibitorType } from './enums.js';
import { EventEmitterType, Localizations, MessageCommandArgsTypes } from './types.js';
export interface DiscordOptions {
    shards?: number | number[] | 'auto';
    closeTimeout?: number;
    shardCount?: number;
    makeCache?: CacheFactory;
    allowedMentions?: MessageMentionOptions;
    partials?: Array<Partials>;
    failIfNotExists?: boolean;
    presence?: PresenceData;
    intents: number[];
    waitGuildTimeout?: number;
    sweepers?: SweeperOptions;
    ws?: WebSocketOptions;
    rest?: RESTOptions;
    jsonTransformer?: (obj: unknown) => unknown;
}
export interface ClientOptions {
    ownerId?: string | string[];
    permissions?: {
        client?: Array<string>;
        user?: Array<string>;
        dm?: boolean;
    };
    ignore?: {
        owner?: boolean;
        users: Array<string>;
        channels: Array<string>;
        guilds: Array<string>;
    };
    log?: {
        ready: boolean;
        error: boolean;
    };
    cooldown?: {
        command?: number;
        cache?: number;
    };
}
export interface HandlerOptions {
    message?: MessageCommandHandlerOptions;
    slash?: SlashCommandHandlerOptions;
    context?: ContextCommandHandlerOptions;
    events?: EventHandlerOptions;
    inhibitors?: InhibitorHandlerOptions;
}
export interface ExtensionOptions {
    extensions: Array<XernerxExtensionBuilder>;
    logging?: boolean;
}
export interface MessageCommandOptions {
    name: string;
    aliases?: Array<string>;
    separator?: string;
    description?: string;
    info?: string;
    category?: string;
    prefix?: Array<string> | string;
    regex?: string;
    channelType?: Array<number>;
    cooldown?: number;
    ignore?: {
        owner?: boolean;
        users?: Array<string>;
        channels?: Array<string>;
        guilds?: Array<string>;
    };
    strict?: {
        owner?: boolean;
        users?: Array<string>;
        channels?: Array<string>;
        guilds?: Array<string>;
    };
    permissions?: {
        client?: Array<string>;
        user?: Array<string>;
        dm?: boolean;
    };
    args?: Array<MessageArgumentOptions>;
}
export interface ContextCommandOptions {
    name: string;
    type: ContextMenuCommandType;
    nameLocalizations: Record<Localizations, string>;
    description?: string;
    info?: string;
    category?: string;
    channelType?: Array<number> | number;
    cooldown?: number;
    ignore?: {
        owner?: boolean;
        users?: Array<string>;
        channels?: Array<string>;
        guilds?: Array<string>;
    };
    strict?: {
        owner?: boolean;
        users?: Array<string>;
        channels?: Array<string>;
        guilds?: Array<string>;
    };
    permissions?: {
        client?: Array<string>;
        users?: Array<string>;
        dm?: boolean;
    };
    defer?: {
        reply?: boolean;
        ephemeral?: boolean;
        fetch?: boolean;
    };
}
export interface MessageArgumentOptions {
    type: MessageCommandArgsTypes;
    content?: Array<string>;
    match?: string;
    name: string;
    prompt?: {
        reply: string;
        send: string;
    };
    default?: string | Function;
}
export interface SlashArgumentOptions {
    type: 'string' | 'number' | 'boolean' | 'user' | 'channel' | 'role' | 'mentionable' | 'integer';
    name: string;
    choices: Array<{
        name: string;
        value: string;
    }>;
    required: boolean;
    description: string;
}
export interface SlashSubcommandOptions {
    name: string;
    description: string;
    args: Array<SlashArgumentOptions>;
}
export interface SlashGroupOptions {
    name: string;
    description: string;
    subcommands: Array<SlashSubcommandOptions>;
}
export interface SlashCommandOptions {
    name: string;
    description: string;
    info?: string;
    category?: string;
    owner?: boolean;
    channelType?: ChannelType;
    cooldown?: number;
    ignore?: {
        owner?: boolean;
        users?: Array<string>;
        channels?: Array<string>;
        guilds?: Array<string>;
    };
    strict?: {
        owner?: boolean;
        users?: Array<string>;
        channels?: Array<string>;
        guilds?: Array<string>;
    };
    permissions: {
        client?: Array<string>;
        users?: Array<string>;
        dm?: boolean;
    };
    defer?: {
        reply?: boolean;
        ephemeral?: boolean;
        fetchReply?: boolean;
    };
    args?: Array<SlashArgumentOptions>;
    subcommands?: Array<SlashSubcommandOptions>;
    groups?: Array<SlashGroupOptions>;
}
export interface MessageCommandHandlerOptions {
    directory: string;
    prefix: string[] | string;
    allowMention?: boolean;
    cooldown?: number;
    userPermissions?: bigint[];
    clientPermissions?: bigint[];
    handleEdits?: boolean;
    handleDeletes?: boolean;
    handleTyping?: boolean;
    util?: boolean;
    logging?: boolean;
}
export interface SlashCommandHandlerOptions {
    directory: string;
    guildId: string;
    global: boolean;
    cooldown?: number;
    userPermissions?: bigint[];
    clientPermissions?: bigint[];
    util?: boolean;
    logging?: boolean;
    defer?: {
        reply?: boolean;
        ephemeral?: boolean;
        fetchReply?: boolean;
    };
}
export interface ContextCommandHandlerOptions {
    directory: string;
    guildId: string;
    global: boolean;
    cooldown?: number;
    userPermissions?: bigint[];
    clientPermissions?: bigint[];
    util?: boolean;
    logging?: boolean;
    defer?: {
        reply?: boolean;
        ephemeral?: boolean;
        fetchReply?: boolean;
    };
}
export interface EventHandlerOptions {
    directory: string;
    logging?: boolean;
}
export interface EventOptions {
    name: string;
    emitter?: EventEmitterType | string;
    type?: 'discord' | string;
    once?: boolean;
}
export interface InhibitorHandlerOptions {
    directory: string;
    logging?: boolean;
}
export interface InhibitorOptions {
    name: string;
    type: InhibitorType;
}
