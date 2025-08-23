/** @format */

import { Interaction, Message } from 'discord.js';
import { XernerxBaseValidator } from './XernerxBaseValidator.js';
import { XernerxSlashCommandBuilder } from '../main.js';

export class XernerxSlashCommandValidator extends XernerxBaseValidator {
	constructor(interaction: Interaction | Message, command: XernerxSlashCommandBuilder) {
		super(interaction, command);
	}
}
