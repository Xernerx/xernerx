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

export type FileType = 'MessageCommand' | 'SlashCommand' | 'ContextCommand' | 'Event' | 'Inhibitor';

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

export type MessageCommandArgumentType = 'string' | 'number' | 'boolean' | 'channel' | 'guild' | 'integer' | 'mentionable' | 'role' | 'user' | 'member' | 'list' | 'option' | 'rest' | 'flag';

export type DiscordEventType =
    | 'applicationCommandPermissionsUpdate'
    | 'autoModerationActionExecution'
    | 'autoModerationRuleCreate'
    | 'autoModerationRuleDelete'
    | 'autoModerationRuleUpdate'
    | 'ready'
    | 'guildCreate'
    | 'guildDelete'
    | 'guildUpdate'
    | 'guildUnavailable'
    | 'guildMemberAdd'
    | 'guildMemberRemove'
    | 'guildMemberUpdate'
    | 'guildMemberAvailable'
    | 'guildMembersChunk'
    | 'guildIntegrationsUpdate'
    | 'roleCreate'
    | 'roleDelete'
    | 'inviteCreate'
    | 'inviteDelete'
    | 'roleUpdate'
    | 'emojiCreate'
    | 'emojiDelete'
    | 'emojiUpdate'
    | 'guildBanAdd'
    | 'guildBanRemove'
    | 'channelCreate'
    | 'channelDelete'
    | 'channelUpdate'
    | 'channelPinsUpdate'
    | 'messageCreate'
    | 'messageDelete'
    | 'messageUpdate'
    | 'messageDeleteBulk'
    | 'messageReactionAdd'
    | 'messageReactionRemove'
    | 'messageReactionRemoveAll'
    | 'messageReactionRemoveEmoji'
    | 'threadCreate'
    | 'threadDelete'
    | 'threadUpdate'
    | 'threadListSync'
    | 'threadMemberUpdate'
    | 'threadMembersUpdate'
    | 'userUpdate'
    | 'presenceUpdate'
    | 'voiceServerUpdate'
    | 'voiceStateUpdate'
    | 'typingStart'
    | 'webhookUpdate'
    | 'interactionCreate'
    | 'error'
    | 'warn'
    | 'debug'
    | 'cacheSweep'
    | 'shardDisconnect'
    | 'shardError'
    | 'shardReconnecting'
    | 'shardReady'
    | 'shardResume'
    | 'invalidated'
    | 'raw'
    | 'stageInstanceCreate'
    | 'stageInstanceUpdate'
    | 'stageInstanceDelete'
    | 'stickerCreate'
    | 'stickerDelete'
    | 'stickerUpdate'
    | 'guildScheduledEventCreate'
    | 'guildScheduledEventUpdate'
    | 'guildScheduledEventDelete'
    | 'guildScheduledEventUserAdd'
    | 'guildScheduledEventUserRemove';

export type EventType = DiscordEventType;

export type XernerxInteraction = XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction;
