/** @format */

import 'discord.js';
import { ChatInputCommandInteraction } from 'discord.js';

import { XernerxClient } from '../client/XernerxClient.ts';
import { XernerxUser } from '../model/XernerxUser.ts';
import { InteractionUtil } from '../util/InteractionUtil.ts';

declare module 'discord.js' {
	interface Interaction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface ChatInputCommandInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface MessageContextMenuCommandInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface UserContextMenuCommandInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface PrimaryEntryPointCommandInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface StringSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface UserSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface RoleSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface MentionableSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface ChannelSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface ButtonInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface AutocompleteInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}

	interface ModalSubmitInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: InteractionUtil;
	}
}

export {};
