import * as fs from 'fs';
import * as path from 'path';

import XernerxClient from '../client/XernerxClient.js';
import load from '../functions/load.js';
import MessageCommandBuilder from '../build/MessageCommandBuilder.js';
import SlashCommandBuilder from '../build/SlashCommandBuilder.js';
import ContextCommandBuilder from '../build/ContextCommandBuilder.js';
import { FileType } from '../types/types.js';

export default class Handler {
    public client;
    public files: Array<MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder>;
    public readyTimestamp;

    constructor(client: XernerxClient) {
        this.client = client;

        this.files = [];

        this.readyTimestamp = Number(Date.now());
    }

    public readdir(dir: string) {
        try {
            return fs.readdirSync(path.resolve(dir)).filter((file) => file.endsWith('.js'));
        } catch (error) {
            console.error(error);
        }
        return [];
    }

    public async load(filePath: string, type: FileType) {
        const file = await load(this.client, filePath, type);

        this.files.push(file);

        return file;
    }

    public async emit<T extends Record<string, string | boolean | Function | void>>(event: T) {
        if (event.fileType === 'Event') {
            if (event.emitter === 'client')
                event.once
                    ? this.client.once(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args))
                    : this.client.on(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args));
            else if (event.emitter === 'process')
                event.once
                    ? process.once(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args))
                    : process.on(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args));
        }

        if (['MessageCommand', 'SlashCommand', 'ContextCommand'].includes(event.fileType as string)) {
            event.once
                ? this.client.once(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args))
                : this.client.on(event.name as string, <T extends Array<T>>(...args: T) => (event.run as Function)(...args));
        }
    }
}
