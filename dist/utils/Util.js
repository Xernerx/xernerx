/** @format */
import XernerxText from '../tools/XernerxText.js';
export default class Util {
	constructor(client) {
		this.client = client;
		this.text = new XernerxText();
	}
	async delay(time) {
		return await new Promise((resolve) => setTimeout(resolve, time));
	}
}
