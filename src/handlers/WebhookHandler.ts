import XernerxClient from '../client/XernerxClient.js';
import XernerxLog from '../tools/XernerxLog.js';
import Handler from './Handler.js';

export default class WebhookHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }

    public async loadWebhooks(options: { token: string }) {
        this.client.once('ready', async (client) => {
            this.post(options.token);

            setInterval(() => {
                this.post(client.token);
            }, 60000 * 30);

            this.client.util.hasVoted = async (userId: string) => {
                return !!(
                    await (
                        await fetch(`https://top.gg/api/bots/${this.client.user?.id}/check?userId=${userId}`, {
                            headers: { Authorization: options.token, 'Content-Type': 'application/json' },
                        })
                    ).json()
                ).voted;
            };
        });
    }

    private async post(token: string) {
        const guilds = await this.client.guilds.fetch();

        this.client.stats.guildCount = this.client.guilds.cache.size;

        this.client.stats.userCount = (await Promise.all(guilds.map(async (guild) => (await this.client.guilds.fetch(guild.id)).memberCount))).reduce((a, b) => (a += b));

        this.client.stats.shardId = (this.client.options.shards as Array<number>)?.at(0) || 0;

        this.client.stats.shardCount = this.client.options.shardCount || (this.client.options.shards as Array<number>)?.length || 1;

        try {
            new XernerxLog(this.client).info(`Posted Stats to Top.gg!`);

            this.client.emit('webhookCreate', this.client, this.client.stats);

            return await fetch(`https://top.gg/api/bots/stats`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    server_count: this.client.stats.guildCount,
                    shard_id: this.client.stats.shardId,
                    shard_count: this.client.stats.shardCount,
                }),
            });
        } catch (error) {
            new XernerxLog(this.client).error(`An error occurred while posting stats to Top.gg`, error);

            return this.client.emit('webhookError', this.client, this.client.stats);
        }
    }
}
