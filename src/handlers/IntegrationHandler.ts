/** @format */

import dbl from 'dbl-sdk';

import XernerxClient from '../client/XernerxClient.js';
import { XernerxUser } from '../types/extenders.js';
import XernerxLog from '../tools/XernerxLog.js';
import Handler from './Handler.js';

export default class IntegrationHandler extends Handler {
	public declare readonly readyTimestamp;
	public declare readonly dbl;

	constructor(client: XernerxClient) {
		super(client);

		this.dbl = new dbl(client as any, client.config as any);

		this.readyTimestamp = Number(Date.now());
	}

	public async loadIntegrations(options: DBLOptions = { votes: true }) {
		this.client.once('ready', async (client) => {
			this.client.dbl.validate = (user: XernerxUser) => this.dbl.validate(user);

			if (options.post) {
				this.dbl.post();
			}
			if (options.votes) {
				this.dbl.votes();

				this.client.on('dbl-sync', (client, responses) => {
					this.client.stats.voteCount = responses.voteCount;
				});
			}
		});

		new XernerxLog(this.client).info(`Successfully syncing with top.gg.`);
	}
}

interface DBLOptions {
	post?: boolean;
	votes?: boolean;
}
