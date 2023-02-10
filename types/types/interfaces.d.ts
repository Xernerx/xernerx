import { Collection } from 'discord.js';
import CommandHandler from '../handlers/CommandHandler.js';
import EventHandler from '../handlers/EventHandler.js';
import InhibitorHandler from '../handlers/InhibitorHandler.js';
import MessageCommandBuilder from '../build/MessageCommandBuilder.js';
import ContextCommandBuilder from '../build/ContextCommandBuilder.js';
import SlashCommandBuilder from '../build/SlashCommandBuilder.js';
export interface ClientCommands {
    message: Collection<string, MessageCommandBuilder>;
    slash: Collection<string, SlashCommandBuilder>;
    context: Collection<string, ContextCommandBuilder>;
}
export interface ClientCache {
    messages: Collection<string, object>;
    cooldowns: Collection<string, object>;
    messageCommands: Collection<string, object>;
    slashCommands: Collection<string, object>;
    contextCommands: Collection<string, object>;
    commands: Collection<string, object>;
}
export interface ClientModules {
    commandHandler: CommandHandler;
    eventHandler: EventHandler;
    inhibitorHandler: InhibitorHandler;
}
