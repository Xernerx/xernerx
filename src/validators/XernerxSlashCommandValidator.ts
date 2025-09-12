/** @format */

import { ChatInputCommandInteraction } from 'discord.js';
import { XernerxBaseValidator } from './XernerxBaseValidator.js';
import { XernerxSlashCommandBuilder } from '../build/XernerxSlashCommandBuilder.js';

export class XernerxSlashCommandValidator extends XernerxBaseValidator {
	constructor(interaction: ChatInputCommandInteraction, command: XernerxSlashCommandBuilder) {
		super(interaction, command);
	}
}
