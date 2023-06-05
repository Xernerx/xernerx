import XernerxClient from '../client/XernerxClient.js';
import { EventHandlerOptions } from '../types/interfaces.js';
import Handler from './Handler.js';
export default class EventHandler extends Handler {
    constructor(client: XernerxClient);
    loadEvents(options: EventHandlerOptions): Promise<void>;
}
//# sourceMappingURL=EventHandler.d.ts.map