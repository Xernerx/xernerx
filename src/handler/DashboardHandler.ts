/** @format */

import express from 'express';
import { XernerxLog } from '../tools/XernerxLog.js';
import { XernerxClient } from '../main.js';
export default class DashboardHandler {
	declare public readonly client: XernerxClient;
	declare public readonly server;

	constructor(client: XernerxClient) {
		this.client = client;

		this.server = express();

		this.server.get('/', (req, res) => {
			res.send(`${this.client.user?.username}`);

			// TODO: add a dashboard
		});
	}

	async loadDashboard() {
		return this.server.listen(4444, () => XernerxLog.info('Server is running on port 4444'));
	}
}
