import { Style } from "dumfunctions";
import { XernerxClient } from "../main.js";

export default class Extensions {
    client: XernerxClient;

    constructor(client: XernerxClient) {
        this.client = client;
    }

    async load(extensions: Array<any>, logging: boolean = false) {
        const exts: Array<string> = [];

        extensions.map(extension => {
            this.client.extensions[extension.name] = new extension(this.client, logging);

            exts.push(extension.name);
        })

        if (logging) console.info(Style.log(`Xernerx | Loaded ${exts.length} extensions: ${exts.join(', ')}`, { color: Style.TextColor.Cyan }));
    }
}