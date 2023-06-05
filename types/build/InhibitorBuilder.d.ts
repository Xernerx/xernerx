import XernerxClient from '../client/XernerxClient.js';
import { InhibitorBuilderOptions } from '../types/interfaces.js';
import { InhibitorType } from '../types/types.js';
import { XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
/**
 * @description - The inhibitor builder for inhibitors.
 * @param {String} id - The unique ID of the inhibitor.
 * @param {InhibitorOptions} options - The inhibitor options.
 */
export default class InhibitorBuilder {
    readonly id: string;
    readonly name: string;
    readonly type: InhibitorType;
    readonly fileType: 'Inhibitor';
    readonly filePath: string;
    readonly client: typeof XernerxClient;
    constructor(id: string, options: InhibitorBuilderOptions);
    check<T>(interaction: XernerxMessage | XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction, args: T): Promise<void | undefined | T>;
}
//# sourceMappingURL=InhibitorBuilder.d.ts.map