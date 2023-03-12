import XernerxClient from '../client/XernerxClient.js';
import { ContextCommandBuilder, MessageCommandBuilder, SlashCommandBuilder } from '../main.js';
export default class Handler {
    client: XernerxClient;
    commands: {
        (arrayLength: number): (MessageCommandBuilder | ContextCommandBuilder | SlashCommandBuilder)[];
        (...items: (MessageCommandBuilder | ContextCommandBuilder | SlashCommandBuilder)[]): (MessageCommandBuilder | ContextCommandBuilder | SlashCommandBuilder)[];
        new (arrayLength: number): (MessageCommandBuilder | ContextCommandBuilder | SlashCommandBuilder)[];
        new (...items: (MessageCommandBuilder | ContextCommandBuilder | SlashCommandBuilder)[]): (MessageCommandBuilder | ContextCommandBuilder | SlashCommandBuilder)[];
        isArray(arg: any): arg is any[];
        readonly prototype: any[];
        from<T>(arrayLike: ArrayLike<T>): T[];
        from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
        from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
        from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
        of<T_4>(...items: T_4[]): T_4[];
        readonly [Symbol.species]: ArrayConstructor;
    };
    readyTimestamp: number;
    constructor(client: XernerxClient);
    readdir(dir: string): string[];
    load(dir: string, fileName: string, type: string): Promise<void>;
}
/**
 * @description - The Handler class.
 * @param {XernerxClient} client - The XernerxClient.
 */
