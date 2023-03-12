import XernerxClient from '../client/XernerxClient.js';
import Handler from './Handler.js';

export default class InhibitorHandler extends Handler {
    constructor(client: XernerxClient) {
        super(client);
    }
}
