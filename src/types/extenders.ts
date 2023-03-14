import {
    ChatInputCommandInteraction,
    DMChannel,
    Guild,
    GuildChannel,
    GuildMember,
    InteractionResponse,
    Message,
    MessageContextMenuCommandInteraction,
    User,
    UserContextMenuCommandInteraction,
} from 'discord.js';

export interface XernerxUser extends User {
    owner: boolean;
    voted: boolean;
}

export interface XernerxMember extends GuildMember {
    username: string;
}

export interface XernerxGuild extends Guild {}

export interface XernerxGuildChannel extends GuildChannel {}

export interface XernerxDMChannel extends DMChannel {}

interface XernerxCommand {
    util: any;
}

export interface XernerxMessage extends Message, XernerxCommand {
    user: XernerxUser;
}

export interface XernerxSlashInteraction extends ChatInputCommandInteraction, XernerxCommand {}

export interface XernerxUserContextInteraction extends UserContextMenuCommandInteraction, XernerxCommand {}

export interface XernerxMessageContextInteraction extends MessageContextMenuCommandInteraction, XernerxCommand {}
