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
                extension.main(this.client);

                extension.await(this.client);

                return extension.name;
            } catch (error) {
                new XernerxLog(this.client).error(`An error occurred while loading ${extension.name}`);
            }
        });

        new XernerxLog(this.client).info(`Loaded Extensions: ${active.filter((e) => e).join(', ')}`);
    }
}
