import { Interaction } from 'discord.js';
import ContextCommandBuilder from '../build/ContextCommandBuilder.js';
import MessageCommandBuilder from '../build/MessageCommandBuilder.js';
import SlashCommandBuilder from '../build/SlashCommandBuilder.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/types.js';
export default function commandValidation(action: XernerxMessage | Interaction, command: SlashCommandBuilder | MessageCommandBuilder | ContextCommandBuilder | any, client: XernerxClient, res?: boolean): boolean;
