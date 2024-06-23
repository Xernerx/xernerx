/** @format */
import dbl from 'dbl-sdk';
import XernerxLog from '../tools/XernerxLog.js';
import Handler from './Handler.js';
export default class IntegrationHandler extends Handler {
	constructor(client) {
		super(client);
		this.dbl = new dbl(client, client.config);
		this.readyTimestamp = Number(Date.now());
	}
	async loadIntegrations(options = { votes: true }) {
		this.client.once('ready', async (client) => {
			this.client.dbl.validate = (user) => this.dbl.validate(user);
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
