import XernerxExtensionBuilder from 'xernerx-extension-builder';
import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
export default class ExtensionHandler extends Handler {
    constructor(client: XernerxClient);
    loadExtensions(...extensions: Array<XernerxExtensionBuilder>): void;
}
//# sourceMappingURL=ExtensionHandler.d.ts.map