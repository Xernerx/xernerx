import { MessageArgumentOptions, MessageCommandOptions } from '../types/options.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/types.js';
/**
 * @description - The command builder for message commands.
 * @param {String} id - The unique ID of the command.
 * @param {MessageCommandOptions} options - The command options.
 */
export default class MessageCommandBuilder {
    id: string;
    name: string;
    aliases: string[] | undefined;
    separator: string;
    description: string | undefined;
    info: string | undefined;
    category: string | undefined;
    prefix: string[];
    regex: string | undefined;
    channelType: number[] | undefined;
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
              user?: string[] | undefined;
              dm?: boolean | undefined;
          }
        | undefined;
    cooldown: number;
    args: MessageArgumentOptions[];
    client: typeof XernerxClient;
    constructor(id: string, options: MessageCommandOptions);
    /**
     * @param {Message} message - The Discord message event data.
     * @param {object} args - The arguments you created.
     * @description make any preconditions here.
     */
    conditions(message: XernerxMessage, args: MessageArgumentOptions): Promise<void>;
    /**
     * @param {Message} message - The Discord message event data.
     * @param {object} args - The arguments you created.
     * @description Make your custom command here.
     */
    exec(message: XernerxMessage, args: MessageArgumentOptions): Promise<void>;
}
