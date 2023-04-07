import XernerxClient from '../main.js';
import Util from './Util.js';

export default class ClientUtil extends Util {
    public hasVoted?: Function;

    constructor(client: XernerxClient) {
        super(client);
    }
}
