import XernerxClient from '../client/XernerxClient.js';

export default class Util {
    public client;

    constructor(client: XernerxClient) {
        this.client = client;
    }
}
