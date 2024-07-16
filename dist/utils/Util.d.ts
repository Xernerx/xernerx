/** @format */
import XernerxClient from '../client/XernerxClient.js';
import XernerxText from '../tools/XernerxText.js';
export default class Util {
	readonly client: XernerxClient<{
		[index: string]: any;
		[index: number]: any;
	}>;
	readonly text: XernerxText;
	constructor(client: XernerxClient);
	delay(time: number): Promise<unknown>;
}
