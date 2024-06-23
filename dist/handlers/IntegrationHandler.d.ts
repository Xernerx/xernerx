/** @format */
import dbl from 'dbl-sdk';
import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
export default class IntegrationHandler extends Handler {
	readonly readyTimestamp: number;
	readonly dbl: dbl;
	constructor(client: XernerxClient);
	loadIntegrations(options?: DBLOptions): Promise<void>;
}
interface DBLOptions {
	post?: boolean;
	votes?: boolean;
}
export {};
