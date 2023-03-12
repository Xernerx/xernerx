import XernerxClient, { MessagePayload } from '../main.js';

export default class Util {
    public client;

    constructor(client: XernerxClient) {
        this.client = client;
    }
}
