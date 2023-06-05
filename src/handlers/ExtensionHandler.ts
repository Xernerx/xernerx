import XernerxExtensionBuilder from 'xernerx-extension-builder';
import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
import XernerxLog from '../tools/XernerxLog.js';

export default class ExtensionHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }

    loadExtensions(...extensions: Array<XernerxExtensionBuilder>) {
        const active = extensions.map((extension) => {
            try {
                if (extension.main) extension.main(this.client);

                if (extension.defer) {
                    this.client.on('ready', (client) => extension.defer(client));
                }

                return extension.name;
            } catch (error) {
                return new XernerxLog(this.client).error(`An error occurred while loading ${extension.name}`, error);
            }
        });

        new XernerxLog(this.client).info(`Loaded ${extensions.length} Extensions: ${active.filter((e) => e).join(', ')}`);
    }
}
