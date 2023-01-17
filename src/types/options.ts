import { CacheFactory, ChannelType, ContextMenuCommandType, MessageMentionOptions, Partials, PresenceData, RESTOptions, SweeperOptions, WebSocketOptions } from "discord.js";
import { ContextCommandType, EventEmitterType, ExtensionBuilder, InhibitorType } from "../main.js";
import { MessageCommandArgsTypes } from "./types.js";

export interface DiscordOptions {
    shards?: number | number[] | "auto";
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
    clientPermissions?: bigint[];
    userPermissions?: bigint[];
    ignoreOwner?: boolean;
    logging?: boolean;
    cooldown?: {
        default?: number;
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
    extensions: Array<ExtensionBuilder>;
    logging?: boolean;
}

export interface MessageCommandOptions {
    name: string;
    regex?: string;
    aliases?: string[];
    description?: string;
    prefix?: string | string[];
    info?: string;
    category?: string;
    owner?: boolean;
    channelType?: ChannelType | ChannelType[];
    separator?: string;
    cooldown?: number;
    ignoreOwner?: boolean;
    channels?: string[];
    guilds?: string[];
    userPermissions?: bigint[];
    clientPermissions?: bigint[];
    commandType?: string;
    args: Array<MessageArgOptions>;
}

export interface ContextCommandOptions {
    name: string;
    type: ContextMenuCommandType | ContextCommandType | number;
    description?: string;
    info?: string;
    category?: string;
    owner?: boolean;
    channelType?: ChannelType;
    cooldown?: number;
    ignoreOwner?: boolean;
    channels?: string[];
    guilds?: string[];
    userPermissions?: bigint[];
    clientPermissions?: bigint[];
    defaultMemberPermissions?: bigint | number | bigint | null | undefined;
    DMPermission?: undefined | null | boolean;
    nameLocalization?: {
        locale:
        | "en-US"
        | "en-GB"
        | "bg"
        | "zh-CN"
        | "zh-TW"
        | "hr"
        | "cs"
        | "da"
        | "nl"
        | "fi"
        | "fr"
        | "de"
        | "el"
        | "hi"
        | "hu"
        | "it"
        | "ja"
        | "ko"
        | "lt"
        | "no"
        | "pl"
        | "pt-BR"
        | "ro"
        | "ru"
        | "es-ES"
        | "sv-SE"
        | "th"
        | "tr"
        | "uk"
        | "vi";
        localizedName: null | string;
    };
    nameLocalizations?: null | Partial<
        Record<
            | "en-US"
            | "en-GB"
            | "bg"
            | "zh-CN"
            | "zh-TW"
            | "hr"
            | "cs"
            | "da"
            | "nl"
            | "fi"
            | "fr"
            | "de"
            | "el"
            | "hi"
            | "hu"
            | "it"
            | "ja"
            | "ko"
            | "lt"
            | "no"
            | "pl"
            | "pt-BR"
            | "ro"
            | "ru"
            | "es-ES"
            | "sv-SE"
            | "th"
            | "tr"
            | "uk"
            | "vi",
            null | string
        >
    >;
    commandType?: string;
    defer?: {
        reply?: boolean;
        ephemeral?: boolean;
        fetchReply?: boolean;
    };
}

export interface MessageArgOptions {
    type: MessageCommandArgsTypes;
    content?: string;
    name: string;
    prompt: {
        reply: string;
        send: string;
    };
    default: string | Function;
}

export interface SlashArgOptions {
    type:
    | "string"
    | "number"
    | "boolean"
    | "user"
    | "channel"
    | "role"
    | "mentionable"
    | "integer";

    name: string;
    choices: Array<{ name: string; value: string }>;
    required: boolean;
    description: string;
}

export interface SlashSubcommandOptions {
    name: string;
    description: string;
    args: Array<SlashArgOptions>;
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
    separator?: string;
    cooldown?: number;
    ignoreOwner?: boolean;
    channels?: string[];
    guilds?: string[];
    userPermissions?: bigint[];
    clientPermissions?: bigint[];
    args?: Array<SlashArgOptions>;
    subcommands?: Array<SlashSubcommandOptions>;
    groups?: Array<SlashGroupOptions>;
    commandType?: string;
    defer?: {
        reply?: boolean;
        ephemeral?: boolean;
        fetchReply?: boolean;
    };
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
    emitter?: EventEmitterType;
    type?: string;
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
