/** @format */

import { ApplicationIntegrationType, ChannelType, InteractionContextType, Locale, PermissionFlags } from 'discord.js';

export interface SlashCommandBuilderOptions {
	// Discord
	name: string;
	locales?: Partial<Record<Locale, { name: string; description: string }>>;
	description: string;
	contexts?: Array<keyof typeof InteractionContextType>;
	integration?: Array<keyof typeof ApplicationIntegrationType>;
	nsfw?: boolean;
	options?: Array<SlashCommandBuilderOption>;
	subcommands?: Array<SlashCommandBuilderSubcommand>;
	groups?: Array<SlashCommandBuilderGroup>;

	// Xernerx
	premium?: boolean;
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

export interface SlashCommandBuilderOption {
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

export interface SlashCommandBuilderSubcommand {
	name: string;
	description: string;
	options?: Array<SlashCommandBuilderOption>;
	locales?: Partial<Record<Locale, { name: string; description: string }>>;
}

export interface SlashCommandBuilderGroup {
	name: string;
	description: string;
	subcommands: Array<SlashCommandBuilderSubcommand>;
	locales?: Partial<Record<Locale, { name: string; description: string }>>;
}
