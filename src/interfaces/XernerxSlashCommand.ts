/** @format */

import { AutocompleteFocusedOption, AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';

import { XernerxSlashCommandBuilder } from '../main.js';

export interface XernerxSlashCommand {
	interaction: ChatInputCommandInteraction;
	options?: Record<string, { name: string; type: number; value: string | number | boolean | object }> | null;
	subcommand: string | null;
	group: string | null;
	command: XernerxSlashCommandBuilder;
}

export interface XernerxSlashCommandAutocomplete {
	interaction: AutocompleteInteraction;
	focused: AutocompleteFocusedOption;
	options: any;
}
