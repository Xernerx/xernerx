/** @format */

import { BaseValidator } from './BaseValidator.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '../build/SlashCommandBuilder.js';

export class SlashCommandValidator extends BaseValidator {
	constructor(interaction: ChatInputCommandInteraction, command: SlashCommandBuilder) {
		super(interaction, command);
	}
}
