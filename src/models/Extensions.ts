import { Style } from 'dumfunctions';
import XernerxExtensionBuilder from 'xernerx-extension-builder';
import XernerxClient from '../client/XernerxClient.js';

export default class Extensions {
	client: XernerxClient;

	constructor(client: XernerxClient) {
		this.client = client;
	}

	async load(extensions: Array<XernerxExtensionBuilder>, logging: boolean = false) {
		const exts: Array<string> = [];

		extensions.map((extension) => {
			try {
				this.client.extensions[extension.name] = extension;

				exts.push(extension.name);
			} catch (error) {
				console.error(
					Style.log(`Xernerx | An error occurred trying to load ${extension.name}, error: <${error}>`, {
						color: Style.BackgroundColor.Red,
					})
				);
			}
		});

		if (logging)
			console.info(
				Style.log(`Xernerx | Loaded ${exts.length} extensions: ${exts.join(', ')}`, { color: Style.TextColor.Cyan })
			);
	}
}
