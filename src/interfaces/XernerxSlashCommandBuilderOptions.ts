/** @format */

import { ApplicationIntegrationType, ChannelType, InteractionContextType, Locale, PermissionFlags } from 'discord.js';

export interface XernerxSlashCommandBuilderOptions {
	// Discord
	name: string;
	locales?: Partial<Record<Locale, { name: string; description: string }>>;
	description: string;
	contexts?: Array<keyof typeof InteractionContextType>;
	integration?: Array<keyof typeof ApplicationIntegrationType>;
	nsfw?: boolean;
	options?: Array<XernerxSlashCommandBuilderOption>;
	subcommands?: Array<XernerxSlashCommandBuilderSubcommand>;
	groups?: Array<XernerxSlashCommandBuilderGroup>;

	// Xernerx
	defer?: boolean;
	deploy?: { global?: boolean; guilds?: Array<string> | string };
	info?: string;
	usage?: string;
	category?: string;
	cooldown?: number;
	permissions?: {
		client?: Array<keyof PermissionFlags> | bigint | number | null;
		user?: Array<keyof PermissionFlags> | bigint | number | null;
	};
	strict?: {
		owner?: boolean;
		users?: Array<string>;
		channels?: Array<string>;
		guilds?: Array<string>;
		types?: ChannelType;
	};
	ignore?: {
		owner?: boolean;
		users?: Array<string>;
		channels?: Array<string>;
		guilds?: Array<string>;
		types?: ChannelType;
	};
}

export interface XernerxSlashCommandBuilderOption {
	type: 'attachment' | 'boolean' | 'channel' | 'integer' | 'mentionable' | 'number' | 'role' | 'string' | 'user';
	name: string;
	locales?: Partial<Record<Locale, { name: string; description: string }>>;
	description: string;
	required?: boolean;
	autocomplete?: boolean;
	// string only
	maxLength?: number;
	minLength?: number;
	choices?: Array<{ name: string; value: string; locales?: Partial<Record<Locale, string>> }>;
}

export interface XernerxSlashCommandBuilderSubcommand {
	name: string;
	description: string;
	options?: Array<XernerxSlashCommandBuilderOption>;
	locales?: Partial<Record<Locale, { name: string; description: string }>>;
}

export interface XernerxSlashCommandBuilderGroup {
	name: string;
	description: string;
	subcommands: Array<XernerxSlashCommandBuilderSubcommand>;
	locales?: Partial<Record<Locale, { name: string; description: string }>>;
}
