import { EventOptions } from "../interfaces/HandlerInterfaces.js";
import XernerxClient from "../client/XernerxClient.js";
import { Handler } from "./Handler.js";

export default class EventHandler {
	client: XernerxClient;
	handler: Handler;

	constructor(client: XernerxClient) {
		this.client = client;

		this.handler = new Handler(client);
	}

	/**
	 *
	 * @param {object} options - message command options
	 */
	loadAllEvents(options: EventOptions) {
		this.handler.loadAllEvents(options);
	}
}
