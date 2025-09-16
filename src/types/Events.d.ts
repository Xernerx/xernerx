/** @format */

import 'discord.js';

import { XernerxMessageCommandBuilder } from '../build/XernerxMessageCommandBuilder.ts';
import { XernerxSlashCommandBuilder } from '../build/XernerxSlashCommandBuilder.ts';
import { XernerxContextCommandBuilder } from '../main.ts';

declare module 'discord.js' {
	interface ClientEvents {
		selectMenuInteraction: [interaction: AnySelectMenuInteraction];
		buttonInteraction: [interaction: ButtonInteraction];
		modalInteraction: [interaction: ModalSubmitInteraction];
		contextCommandInteraction: [interaction: ContextMenuCommandInteraction];
		slashCommandInteraction: [interaction: ChatInputCommandInteraction];
		commandError: [interaction: Interaction | Message, args: any, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder | XernerxContextCommandBuilder, error: Error];
		commandBlock: [interaction: Interaction | Message, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder | XernerxContextCommandBuilder, error: any];
		commandStart: [interaction: Interaction | Message, args: any, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder | XernerxContextCommandBuilder];
		commandFinish: [interaction: Interaction | Message, args: any, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder | XernerxContextCommandBuilder];
		commandDelete: [interaction: Interaction | Message, error: Error];
	}
}
