/** @format */

import { ApplicationIntegrationType, ChannelType, ContextMenuCommandType, InteractionContextType, Locale, PermissionFlags } from 'discord.js';

export interface XernerxContextCommandBuilderOptions {
	// Discord
	name: string;
	locales?: Partial<Record<Locale, { name: string; description: string }>>;
	description: string;
	contexts?: Array<keyof typeof InteractionContextType>;
	integration?: Array<keyof typeof ApplicationIntegrationType>;
	type: ContextMenuCommandType;

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
