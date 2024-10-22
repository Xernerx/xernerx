/** @format */

import * as Discord from 'discord.js';

export class XernerxSlashCommand extends Discord.SlashCommandBuilder {
	public declare readonly _id: string;
	public declare readonly global: boolean;
	public declare readonly filetype: 'XernerxSlashCommand';
	public declare readonly collection: 'slash.commands';

	constructor(options: any) {
		super();

		this._id = options.id;

		this.setName(options.name);

		this.setDescription(options.description);

		this.global = options.global ?? true;

		this.filetype = 'XernerxSlashCommand';

		this.collection = 'slash.commands';
	}
}
