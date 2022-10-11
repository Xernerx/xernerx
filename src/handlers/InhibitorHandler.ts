import { InhibitorOptions } from "../interfaces/HandlerInterfaces.js";
import XernerxClient from "../client/XernerxClient.js";
import { Handler } from "./Handler.js";

export default class InhibitorHandler {
	client: XernerxClient;
	handler: Handler;

	constructor(client: XernerxClient) {
		this.client = client;

		this.handler = new Handler(client);
	}

	loadAllInhibitors(options: InhibitorOptions) {
		this.handler.loadAllInhibitors(options);
	}
}
