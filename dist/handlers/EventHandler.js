/** @format */
import { z } from 'zod';
import { Style } from 'dumfunctions';
import * as path from 'path';
import Handler from './Handler.js';
import XernerxLog from '../tools/XernerxLog.js';
export default class EventHandler extends Handler {
	constructor(client) {
		super(client);
		this.readyTimestamp = Number(Date.now());
	}
	async loadEvents(options) {
		const events = [];
		options = z
			.object({
				directory: z.string(),
			})
			.parse(options);
		this.client.modules.options.events = options;
		const files = await this.readdir(options.directory, 'Events');
		for (const file of files) {
			const filepath = `${path.resolve(options.directory)}\\${file}`;
			const event = await this.load(filepath, 'Event');
			this.emit(event);
			events.push(event.id);
		}
		new XernerxLog(this.client).info(
			`Loaded ${Style.log(String(this.client.events.size), { color: Style.TextColor.Cyan })} Events: ${events.map((event) => Style.log(event, { color: Style.TextColor.LightYellow })).join(', ')}`
		);
		process.on('unhandledRejection', async (error) => {
			if (this.client.settings.ceaseless) new XernerxLog(this.client).error('An uncaught error happpened, this is triggered from the ceaseless setting.', error);
			const data = {
				channel: null,
				message: null,
				user: null,
				url: error.url || null,
				stack: error.stack || error,
			};
			if (error.url) {
				await error.url.match(/(channels|messages|servers|users)\/\d{10,100}/gim)?.map(async (identifier) => {
					const [type, id] = identifier.split('/');
					console.log(type, id);
					switch (type) {
						case 'channels':
							return (data.channel = (await this.client.channels.fetch(id)) || id);
						case 'messages' && data.channel:
							return (data.message = (await data.channel.messages.cache.get(id)) || id);
						case 'users':
							return (data.user = (await this.client.users.fetch(id)) || id);
					}
				});
			}
			this.client.emit('processError', this.client, data);
		});
	}
}
