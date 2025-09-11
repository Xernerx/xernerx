/** @format */

import 'discord.js';

import { XernerxMessageCommandBuilder } from '../build/XernerxMessageCommandBuilder.ts';
import { XernerxSlashCommandBuilder } from '../build/XernerxSlashCommandBuilder.ts';

declare module 'discord.js' {
	interface ClientEvents {
		selectMenuInteraction: [interaction: AnySelectMenuInteraction];
		buttonInteraction: [interaction: ButtonInteraction];
		modalInteraction: [interaction: ModalSubmitInteraction];
		contextCommandInteraction: [interaction: ContextMenuCommandInteraction];
		slashCommandInteraction: [interaction: ChatInputCommandInteraction];
		commandError: [interaction: Interaction | Message, args: any, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder, error: Error];
		commandBlock: [interaction: Interaction | Message, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder, error: any];
		commandStart: [interaction: Interaction | Message, args: any, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder];
		commandFinish: [interaction: Interaction | Message, args: any, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder];
		commandDelete: [interaction: Interaction | Message, error: Error];
	}
}
