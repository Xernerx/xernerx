import { z } from 'zod';

import XernerxClient from '../client/XernerxClient.js';
import { XernerxInhibitorOptions, MessageCommandArguments, SlashCommandArguments } from '../types/interfaces.js';
import { InhibitorType, XernerxInteraction } from '../types/types.js';
import { XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';

/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export default class XernerxInhibitor {
    public declare readonly id;
    public declare readonly name;
    public declare readonly type: InhibitorType;
    public declare readonly fileType: 'Inhibitor';
    public declare readonly filePath: string;
    public declare readonly client;

    public constructor(id: string, options: XernerxInhibitorOptions) {
        this.id = id;

        z.object({
            name: z.string(),
            type: z.string(),
        }).parse(options);

        this.name = options.name;

        this.type = options.type;

        this.client = XernerxClient;
    }

    public async check<T extends XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>>(
        interaction: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
        args: T extends XernerxMessage
            ? MessageCommandArguments
            : T extends XernerxSlashInteraction
            ? SlashCommandArguments
            : T extends XernerxUserContextInteraction
            ? XernerxUserContextInteraction
            : XernerxMessageContextInteraction | null
    ): Promise<void | any | T> {}
}
