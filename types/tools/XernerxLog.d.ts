import XernerxError from './XernerxError.js';
import XernerxClient from '../client/XernerxClient.js';
export default class XernerxLog {
    private readonly client;
    private readonly errorLog;
    private readonly infoLog;
    private readonly readyLog;
    private readonly tableLog;
    constructor(client: XernerxClient);
    info(message: string, force?: boolean): void | null;
    warn(message: string): void | null;
    error(message: string, error?: XernerxError | unknown): void | null;
    ready(): void;
}
//# sourceMappingURL=XernerxLog.d.ts.map