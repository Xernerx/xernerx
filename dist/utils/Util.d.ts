/** @format */
import XernerxClient from '../client/XernerxClient.js';
import XernerxText from '../tools/XernerxText.js';
export default class Util {
	readonly client: XernerxClient<unknown>;
	readonly text: XernerxText;
	constructor(client: XernerxClient);
	delay(time: number): Promise<unknown>;
}
