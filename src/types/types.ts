/** @format */

import {
	SlashCommandBooleanOption,
	SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandMentionableOption,
	SlashCommandNumberOption,
	SlashCommandRoleOption,
	SlashCommandStringOption,
	SlashCommandUserOption,
} from 'discord.js';

import { XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from './extenders.js';

export type filetype = 'MessageCommand' | 'SlashCommand' | 'ContextCommand' | 'Event' | 'Inhibitor';

export type Locales =
	| 'en-US'
	| 'en-GB'
	| 'bg'
	| 'zh-CN'
	| 'zh-TW'
	| 'hr'
	| 'cs'
	| 'da'
	| 'nl'
	| 'fi'
	| 'fr'
	| 'de'
	| 'el'
	| 'hi'
	| 'hu'
	| 'it'
	| 'ja'
	| 'ko'
	| 'lt'
	| 'no'
	| 'pl'
	| 'pt-BR'
	| 'ro'
	| 'ru'
	| 'es-ES'
	| 'sv-SE'
	| 'th'
	| 'tr'
	| 'uk'
	| 'vi';

export type SlashCommandArgumentType = 'attachment' | 'boolean' | 'channel' | 'integer' | 'mentionable' | 'number' | 'role' | 'string' | 'user';

export type SlashCommandOptionChoices = SlashCommandStringOption | SlashCommandNumberOption | SlashCommandIntegerOption;

export type SlashCommandOption = SlashCommandOptionChoices | SlashCommandBooleanOption | SlashCommandUserOption | SlashCommandChannelOption | SlashCommandRoleOption | SlashCommandMentionableOption;

export type MessageCommandArgumentType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'confirm'
	| 'channel'
	| 'guild'
	| 'integer'
	| 'mentionable'
	| 'role'
	| 'user'
	| 'message'
	| 'member'
	| 'list'
	| 'option'
	| 'rest';

export type XernerxInteraction<T extends XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction> = T extends XernerxSlashInteraction
	? XernerxSlashInteraction
	: T extends XernerxUserContextInteraction
	? XernerxUserContextInteraction
	: XernerxMessageContextInteraction;

export type PermissionNames =
	| 'create instant invite'
	| 'kick members'
	| 'ban members'
	| 'administrator'
	| 'manage channels'
	| 'manage guild'
	| 'add reactions'
	| 'view audit log'
	| 'priority speaker'
	| 'stream'
	| 'view channel'
	| 'send messages'
	| 'send tts messages'
	| 'manage messages'
	| 'embed links'
	| 'attach files'
	| 'read message history'
	| 'mention everyone'
	| 'use external emojis'
	| 'view guild insights'
	| 'connect'
	| 'speak'
	| 'mute members'
	| 'deafen members'
	| 'move members'
	| 'use vad'
	| 'change nickname'
	| 'manage nicknames'
	| 'manage roles'
	| 'manage webhooks'
	| 'manage emojis and stickers'
	| 'use application commands'
	| 'request to speak'
	| 'manage events'
	| 'manage threads'
	| 'create public threads'
	| 'create private threads'
	| 'use external stickers'
	| 'send messages in threads'
	| 'start embedded activities'
	| 'moderate members';

export type InhibitorType = '*' | 'message' | 'interaction' | 'command' | 'channel' | 'user' | 'member' | 'guild' | 'contextCommand' | 'messageCommand' | 'slashCommand';
