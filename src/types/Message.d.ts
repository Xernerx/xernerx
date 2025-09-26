/** @format */
import 'discord.js';

import { XernerxClient } from '../client/XernerxClient.ts';
import { XernerxUser } from '../model/XernerxUser.ts';
import { MessageUtil } from '../util/MessageUtil.ts';

declare module 'discord.js' {
	interface Message {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: MessageUtil;
	}
}

export {};
