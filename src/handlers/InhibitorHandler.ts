import { InhibitorLoadOptions } from "../interfaces/HandlerInterfaces.js";
import XernerxClient from "../client/XernerxClient.js";
import { Handler } from "./Handler.js";

/**
 * @description - Inhibitor loader.
 * @param {XernerxClient} client - The XernerxClient.
 */
export default class InhibitorHandler {
	client: XernerxClient;
	handler: Handler;

	constructor(client: XernerxClient) {
		this.client = client;

		this.handler = new Handler(client);
	}

	/**
	 * @description - The loader for all inhibitors.
	 * @param {InhibitorLoadOptions} options - the inhibitor loader options.
	 * @returns undefined
	 */
	loadAllInhibitors(options: InhibitorLoadOptions) {
		this.handler.loadAllInhibitors(options);
	}
}
