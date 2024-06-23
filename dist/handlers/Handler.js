/** @format */
import * as fs from 'fs';
import * as path from 'path';
import load from '../functions/load.js';
import { Style, XernerxLog } from '../main.js';
export default class Handler {
	client;
	files;
	constructor(client) {
		this.client = client;
		this.files = [];
	}
	async readdir(dir, type) {
		try {
			return fs.readdirSync(path.resolve(dir)).filter((file) => file.endsWith('.js'));
		} catch (error) {
			// const spinner = clack.spinner();
			// spinner.start();
			new XernerxLog(this.client).error(`Cannot load ${type.toLowerCase()}, there is no such directory ${Style.log(dir, { color: Style.BackgroundColor.Grey })}.`);
			// spinner.stop();
			// console.log(c);
		}
		return [];
	}
	async load(filepath, type) {
		const file = await load(this.client, filepath, type);
		this.files.push(file);
		return file;
	}
	/**
	 * Emits a file that has been loaded into the handler.
	 * @param file - The file to emit.
	 */
	async emit(file) {
		if (!file?.filetype) return;
		if (file.filetype === 'Inhibitor') return;
		if (file.filetype === 'Event' && file.emitter) {
			if (file.emitter === 'client') {
				this.client[file.once ? 'once' : 'on'](file.name, (...args) => file.run(...args));
			} else if (file.emitter === 'process') {
				process[file.once ? 'once' : 'on'](file.name, (...args) => file.run(...args));
			} else if (file.emitter === 'rest') {
				this.client.rest[file.once ? 'once' : 'on'](file.name, (...args) => file.run(...args));
			} else {
				// @ts-expect-error
				this.client[file.emitter][file.once ? 'once' : 'on'](file.name, (...args) => file.run(...args));
			}
		} else {
			this.client.on(file.name, (...args) => file.run(...args));
		}
	}
}
