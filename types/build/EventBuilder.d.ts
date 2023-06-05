import XernerxClient from '../client/XernerxClient.js';
import { EventBuilderOptions } from '../types/interfaces.js';
import { EventType } from '../types/types.js';
/**
 * @description - The event builder for  events.
 * @param {String} id - The unique ID of the event.
 * @param {EventOptions} options - The event options.
 */
export default class EventBuilder {
    readonly id: string;
    readonly name: EventType | string;
    readonly emitter?: 'client' | 'process' | string;
    readonly type?: 'discord' | string;
    readonly once?: boolean;
    readonly fileType: 'Event';
    readonly filePath: string;
    readonly client: typeof XernerxClient;
    constructor(id: string, options: EventBuilderOptions);
    /**
     * @description run your custom event here.
     * TODO - update description
     */
    run<T>(...args: Array<T>): Promise<void | undefined | T>;
}
//# sourceMappingURL=EventBuilder.d.ts.map