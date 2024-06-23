/** @format */
import XernerxError from './XernerxError.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxClientType } from '../types/extenders.js';
export default class XernerxLog {
	private readonly client;
	private readonly errorLog;
	private readonly infoLog;
	private readonly warnLog;
	private readonly readyLog;
	private readonly tableLog;
	private readonly format;
	private readonly time;
	private readonly ram;
	private shard;
	private readonly base;
	constructor(client: XernerxClient | XernerxClientType | true);
	info(message: string, force?: boolean): void | null;
	warn(message: string): void | null;
	update(version: string, url: string): Promise<void>;
	error(message: string, error?: XernerxError | unknown): void | null;
	ready(): void;
	private cyan;
	private blue;
	private yellow;
	private purple;
	private red;
	private green;
}
