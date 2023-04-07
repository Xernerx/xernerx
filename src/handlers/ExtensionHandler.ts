import XernerxExtensionBuilder from 'xernerx-extension-builder';
import XernerxClient from '../main.js';
import Handler from './Handler.js';
import XernerxLog from '../tools/XernerxLog.js';
import { z } from 'zod';

export default class ExtensionHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }

    loadExtensions(...extensions: Array<XernerxExtensionBuilder>) {
        const active = extensions.map((extension) => {
            try {
                // extension.main(client);

                // extension.await(client);

                return extension.name;
            } catch (error) {
                new XernerxLog(this.client).error(`An error occurred while loading ${extension.name}`);
            }
        });

        new XernerxLog(this.client).info(`Loaded Extensions: ${active.filter((e) => e).join(', ')}`);
    }
}
