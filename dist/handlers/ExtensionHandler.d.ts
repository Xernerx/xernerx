/** @format */
import XernerxExtensionBuilder from 'xernerx-extension-builder';
import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
export default class ExtensionHandler extends Handler {
	readonly readyTimestamp: number;
	constructor(client: XernerxClient);
	loadExtensions(...extensions: Array<XernerxExtensionBuilder>): void;
}
