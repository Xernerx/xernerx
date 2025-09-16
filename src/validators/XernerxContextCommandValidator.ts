/** @format */

import { MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from 'discord.js';

import { XernerxBaseValidator } from './XernerxBaseValidator.js';
import { XernerxContextCommandBuilder } from '../build/XernerxContextCommandBuilder.js';

export class XernerxContextCommandValidator extends XernerxBaseValidator {
	constructor(interaction: UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction, command: XernerxContextCommandBuilder) {
		super(interaction, command);
	}
}
