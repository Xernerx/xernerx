export default class XernerxError {
    name;
    message;
    constructor(message) {
        this.name = 'XernerxError';
        this.message = message || '';
    }
}
