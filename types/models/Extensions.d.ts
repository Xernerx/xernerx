import XernerxExtensionBuilder from 'xernerx-extension-builder';
import XernerxClient from '../client/XernerxClient.js';
export default class Extensions {
    client: XernerxClient;
    constructor(client: XernerxClient);
    load(extensions: Array<XernerxExtensionBuilder>, logging?: boolean): Promise<void>;
}
