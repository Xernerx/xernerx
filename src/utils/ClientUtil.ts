import setPresence from '../functions/setPresence.js';
import XernerxClient from '../main.js';
import { PresenceOptions } from '../types/interfaces.js';
import Util from './Util.js';

export default class ClientUtil extends Util {
    public hasVoted?: Function;

    constructor(client: XernerxClient) {
        super(client);
    }

    public setPresence(options: PresenceOptions) {
        return setPresence(this.client, options);
    }
}
