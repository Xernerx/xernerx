import { TextChannel, Message, User, Guild, GuildMember, Channel, Role, InteractionResponse } from 'discord.js';
import { InteractionCommandUtil, MessageCommandUtil } from '../utils/CommandUtil.js';

export interface XernerxMessage extends Message {
    util?: MessageCommandUtil;
    response?: string;
}

export interface XernerxInteraction extends InteractionResponse {
    util: InteractionCommandUtil;
    options?: {
        _group: string;
        _subcommand: string;
        _hoistedOptions: Array<{
            name: string;
            channel: Channel;
            user: XernerxUser;
            role: XernerxRole;
            value: string;
        }>;
    };
}

export interface XernerxUser extends User {
    isOwner: boolean;
}

export interface XernerxRole extends Role {}

export interface XernerxTextChannel extends TextChannel {}

export interface XernerxGuild extends Guild {}

export interface XernerxMember extends GuildMember {}

export type MessageCommandArgsTypes = 'rest' | 'option' | 'flag' | 'string' | 'number' | 'channel' | 'user' | 'member' | 'boolean' | 'role';

export type Localizations =
    | 'id'
    | 'da'
    | 'de'
    | 'en-GB'
    | 'en-US'
    | 'es-ES'
    | 'fr'
    | 'hr'
    | 'it'
    | 'lt'
    | 'hu'
    | 'nl'
    | 'no'
    | 'pl'
    | 'pt-BR'
    | 'ro'
    | 'fi'
    | 'sv-SE'
    | 'vi'
    | 'tr'
    | 'cs'
    | 'el'
    | 'bg'
    | 'ru'
    | 'uk'
    | 'hi'
    | 'th'
    | 'zh-CN'
    | 'ja'
    | 'zh-TW'
    | 'ko';

export type EventEmitterType = 'client' | 'process';
