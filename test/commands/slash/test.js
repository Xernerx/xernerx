/** @format */

import { XernerxSlashCommand } from '../../../dist/main.js';

export default class TestCommand extends XernerxSlashCommand {
	constructor() {
		super({
			id: 'test',
			name: 'test',
			description: 'Test the bot.',
		});
	}
}
