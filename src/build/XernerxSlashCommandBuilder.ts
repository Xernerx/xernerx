/** @format */

import { XernerxSlashCommandBuilderOptions } from '../types/interfaces.js';
import { XernerxBaseBuilder } from './XernerxBaseBuilder.js';

export class XernerxSlashCommandBuilder extends XernerxBaseBuilder {
	declare public readonly collection;

	constructor(id: string, options: XernerxSlashCommandBuilderOptions) {
		super(id, options);

		this.collection = 'commands.slash';
	}
}
