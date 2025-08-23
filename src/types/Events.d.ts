/** @format */

import 'discord.js';
import { XernerxMessageCommandBuilder, XernerxSlashCommandBuilder } from '../main.ts';

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
