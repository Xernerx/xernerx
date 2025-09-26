/** @format */

import { MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from 'discord.js';

import { BaseValidator } from './BaseValidator.js';
import { ContextCommandBuilder } from '../build/ContextCommandBuilder.js';

export class ContextCommandValidator extends BaseValidator {
	constructor(interaction: UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction, command: ContextCommandBuilder) {
		super(interaction, command);
	}
}
