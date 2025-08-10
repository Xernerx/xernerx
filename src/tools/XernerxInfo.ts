/** @format */

import ora from 'ora';
import { XernerxBase } from './XernerxBase.js';

export class XernerxInfo extends XernerxBase {
	constructor(message: string) {
		super();

		ora().info(`${this.base()}${message}`);
	}
}
