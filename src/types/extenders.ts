import { DMChannel, Guild, GuildChannel, GuildMember, InteractionResponse, Message, User } from 'discord.js';

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

export interface XernerxMessage extends Message {
    util: any;
}

export interface XernerxInteraction extends InteractionResponse {}
