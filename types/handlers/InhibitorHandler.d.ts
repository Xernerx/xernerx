import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';
import { InhibitorHandlerOptions } from '../types/interfaces.js';
export default class InhibitorHandler extends Handler {
    constructor(client: XernerxClient);
    loadInhibitors(options: InhibitorHandlerOptions): Promise<void>;
}
//# sourceMappingURL=InhibitorHandler.d.ts.map