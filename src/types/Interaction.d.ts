/** @format */

import 'discord.js';
import { XernerxClient } from '../client/XernerxClient.ts';
import { XernerxUser } from '../model/XernerxUser.ts';
import { XernerxInteractionUtil } from '../util/XernerxInteractionUtil.ts';
import { ChatInputCommandInteraction } from 'discord.js';

declare module 'discord.js' {
	interface Interaction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface ChatInputCommandInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface MessageContextMenuCommandInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface UserContextMenuCommandInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface PrimaryEntryPointCommandInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface StringSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface UserSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface RoleSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface MentionableSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface ChannelSelectMenuInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface ButtonInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface AutocompleteInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}

	interface ModalSubmitInteraction {
		user: XernerxUser;
		client: Client<true> & XernerxClient;
		util: XernerxInteractionUtil;
	}
}

export {};
