/** @format */

import { ChannelType, InteractionContextType, Locale, PermissionFlags } from 'discord.js';

export interface XernerxMessageCommandBuilderOptions {
	// Discord
	name: string;
	description?: string;
	alias?: string | string[];
	prefix?: string | string[];
	separator?: string;
	locales?: Partial<Record<Locale, { name: string; description: string }>>;
	contexts?: Array<keyof typeof InteractionContextType>;
	nsfw?: boolean;
	options?: Array<any>;

	// Xernerx
	premium?: boolean;
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
