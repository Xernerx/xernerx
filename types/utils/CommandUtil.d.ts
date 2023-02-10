import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction, Message, MessagePayload, StringSelectMenuBuilder } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/types.js';
interface SelectMenuOptions {
    index?: EmbedBuilder;
    row?: ActionRowBuilder;
    component?: StringSelectMenuBuilder;
    components?: object[];
    reply?: boolean;
    id?: string;
    filter?: Function;
    time?: number;
    ephemeral?: boolean;
}
interface ButtonOptions {
    index?: number;
    buttons?: Array<string>;
    reply?: boolean;
    row?: ActionRowBuilder;
    component?: ButtonBuilder;
    components?: object[];
    id?: string;
    filter?: any;
    time?: number;
    ephemeral?: boolean;
}
export declare class MessageCommandUtil {
    client: XernerxClient;
    message: XernerxMessage;
    constructor(client: XernerxClient, message: Message & XernerxMessage);
    reply(content: MessagePayload | string): Promise<Message<boolean> | undefined>;
    send(content: MessagePayload | string): Promise<Message<true> | Message<false> | undefined>;
    defer(time: number): Promise<unknown>;
    getCommands(): import('@discordjs/collection').Collection<string, import('../main.js').MessageCommandBuilder>;
    getCommandName(): void;
    selectMenuPaginator(embeds: Array<EmbedBuilder>, options?: SelectMenuOptions): void;
    buttonPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions): void;
    buttonMenuPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions & SelectMenuOptions): void;
    isOwner(): boolean;
    createModal(): void;
}
export declare class InteractionCommandUtil {
    client: XernerxClient;
    interaction: any;
    constructor(client: XernerxClient, interaction: Interaction);
    reply(content: MessagePayload | string): any;
    defer(time: number): Promise<unknown>;
    getCommands():
        | import('@discordjs/collection').Collection<string, import('../main.js').SlashCommandBuilder>
        | import('@discordjs/collection').Collection<string, import('../main.js').ContextCommandBuilder>;
    getCommandName(): void;
    selectMenuPaginator(embeds: Array<EmbedBuilder>, options?: SelectMenuOptions): void;
    buttonPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions): void;
    buttonMenuPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions & SelectMenuOptions): void;
    isOwner(): boolean;
    createModal(): void;
}
export {};
