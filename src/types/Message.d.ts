/** @format */
import 'discord.js';

import { XernerxClient } from '../client/XernerxClient.ts';
import { XernerxUser } from '../model/XernerxUser.ts';
import { XernerxMessageUtil } from '../util/XernerxMessageUtil.ts';

declare module 'discord.js' {
	interface Message {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxMessageUtil;
	}
}

export {};
