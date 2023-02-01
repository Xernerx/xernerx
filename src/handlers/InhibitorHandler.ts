import XernerxClient from '../client/XernerxClient.js';
import { InhibitorHandlerOptions } from '../types/options.js';
import { Handler } from './Handler.js';

/**
 * @description - Inhibitor loader.
 * @param {XernerxClient} client - The XernerxClient.
 */
export default class InhibitorHandler {
	private client: XernerxClient;
	private handler: Handler;

	constructor(client: XernerxClient) {
		this.client = client;

		this.handler = new Handler(client);
	}

	/**
	 * @description - The loader for all inhibitors.
	 * @param {InhibitorLoadOptions} options - the inhibitor loader options.
	 * @returns undefined
	 */
	public loadAllInhibitors(options: InhibitorHandlerOptions) {
		this.handler.loadAllInhibitors(options);
	}
}
