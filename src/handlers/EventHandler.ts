import { EventLoadOptions } from "../interfaces/HandlerInterfaces.js";
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
	 * @description - The event loader
	 * @param {EventLoadOptions} options - message command options
	 */
	loadAllEvents(options: EventLoadOptions) {
		this.handler.loadAllEvents(options);
	}
}
