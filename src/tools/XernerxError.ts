export default class XernerxError {
    name: string;
    message: string;

    constructor(message?: string) {
        this.name = 'XernerxError';

        this.message = message || '';
    }
}
