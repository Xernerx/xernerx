import { ContextMenuCommandBuilder, Interaction } from 'discord.js';
import { ContextCommandOptions } from '../types/options.js';
import XernerxClient from '../client/XernerxClient.js';
/**
 * @description The command builder for context commands.
 * @param {String} id - The unique ID of the command.
 * @param {ContextCommandOptions} options - The command options.
 */
export default class ContextCommandBuilder {
    id: string;
    data: ContextMenuCommandBuilder;
    name: string;
    type: import('@discordjs/builders').ContextMenuCommandType;
    description: string | undefined;
    info: string | undefined;
    category: string | undefined;
    channelType: number | number[] | undefined;
    cooldown: number | undefined;
    ignore:
        | {
              owner?: boolean | undefined;
              users?: string[] | undefined;
              channels?: string[] | undefined;
              guilds?: string[] | undefined;
          }
        | undefined;
    strict:
        | {
              owner?: boolean | undefined;
              users?: string[] | undefined;
              channels?: string[] | undefined;
              guilds?: string[] | undefined;
          }
        | undefined;
    permissions:
        | {
              client?: string[] | undefined;
              users?: string[] | undefined;
              dm?: boolean | undefined;
          }
        | undefined;
    defer:
        | {
              /**
               * @param {Interaction} interaction - The Discord interaction event data.
               * @description Make your custom command here.
               * TODO - update description
               */
              reply?: boolean | undefined;
              ephemeral?: boolean | undefined;
              fetch?: boolean | undefined;
          }
        | undefined;
    client: typeof XernerxClient;
    constructor(id: string, options: ContextCommandOptions);
    /**
     * @param {Interaction} interaction - The Discord interaction event data.
     * @description make any preconditions here.
     * TODO - update description
     */
    conditions(interaction: Interaction, args: any): Promise<void>;
    /**
     * @param {Interaction} interaction - The Discord interaction event data.
     * @description Make your custom command here.
     * TODO - update description
     */
    exec(interaction: Interaction, args: any): Promise<void>;
}
