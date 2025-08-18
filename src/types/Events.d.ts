/** @format */

import 'discord.js';
import { XernerxMessageCommandBuilder, XernerxSlashCommandBuilder } from '../main.ts';

declare module 'discord.js' {
	interface ClientEvents {
		commandError: [interaction: Interaction | Message, args: any, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder, error: Error];
		commandStart: [interaction: Interaction | Message, args: any, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder];
		commandFinish: [interaction: Interaction | Message, args: any, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder];
		commandDelete: [interaction: Interaction | Message, error: Error];
	}
}
